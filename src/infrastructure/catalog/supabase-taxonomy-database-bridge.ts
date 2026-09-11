import 'server-only'

import {
  TAXONOMY_CATEGORY_EXTERNAL_KEY_PREFIX,
  taxonomyDatabaseNodes,
  type TaxonomyDatabaseBridge,
  type TaxonomyDatabaseNode,
  type TaxonomyDatabaseSnapshot,
} from '@/application/catalog/taxonomy-database-bridge'
import { createSupabaseServerClient } from '@/infrastructure/supabase/server-client'

type CategoryRow = {
  id: string
  external_key: string | null
  parent_id: string | null
  slug: string
  name: string
  is_active: boolean
}

function fail(error: { message: string } | null, context: string): void {
  if (error) throw new Error(`${context}: ${error.message}`)
}

function conflictMessage(node: TaxonomyDatabaseNode): string {
  return `Taxonomy category conflict for ${node.slug}: slug and external key point to different database rows.`
}

export class SupabaseTaxonomyDatabaseBridge implements TaxonomyDatabaseBridge {
  private readonly db = createSupabaseServerClient()

  private async readCategories(): Promise<CategoryRow[]> {
    const { data, error } = await this.db
      .from('categories')
      .select('id, external_key, parent_id, slug, name, is_active')
      .order('slug')
    fail(error, 'Read taxonomy categories')
    return (data ?? []) as CategoryRow[]
  }

  private findExisting(rows: CategoryRow[], node: TaxonomyDatabaseNode): CategoryRow | undefined {
    const byExternalKey = rows.find((row) => row.external_key === node.externalKey)
    const bySlug = rows.find((row) => row.slug === node.slug)

    if (byExternalKey && bySlug && byExternalKey.id !== bySlug.id) throw new Error(conflictMessage(node))
    return byExternalKey ?? bySlug
  }

  private async reconcileLevel(
    nodes: readonly TaxonomyDatabaseNode[],
    rows: CategoryRow[],
    parentIdBySlug: ReadonlyMap<string, string>,
  ): Promise<void> {
    const now = new Date().toISOString()
    const existingPayloads: Array<Record<string, unknown>> = []
    const newPayloads: Array<Record<string, unknown>> = []

    for (const node of nodes) {
      const parentId = node.parentSlug ? parentIdBySlug.get(node.parentSlug) : null
      if (node.parentSlug && !parentId) throw new Error(`Taxonomy parent UUID missing for ${node.slug}: ${node.parentSlug}`)

      const existing = this.findExisting(rows, node)
      const payload = {
        external_key: node.externalKey,
        parent_id: parentId,
        slug: node.slug,
        name: node.name,
        is_active: true,
        updated_at: now,
      }

      if (existing) existingPayloads.push({ id: existing.id, ...payload })
      else newPayloads.push(payload)
    }

    if (existingPayloads.length > 0) {
      const { error } = await this.db.from('categories').upsert(existingPayloads, { onConflict: 'id' })
      fail(error, 'Reconcile existing taxonomy categories')
    }

    if (newPayloads.length > 0) {
      const { error } = await this.db.from('categories').upsert(newPayloads, { onConflict: 'external_key' })
      fail(error, 'Insert missing taxonomy categories')
    }
  }

  async ensureSynced(): Promise<TaxonomyDatabaseSnapshot> {
    const roots = taxonomyDatabaseNodes.filter((node) => !node.parentSlug)
    const children = taxonomyDatabaseNodes.filter((node) => node.parentSlug)

    let rows = await this.readCategories()
    await this.reconcileLevel(roots, rows, new Map())

    rows = await this.readCategories()
    const rootIdBySlug = new Map<string, string>()
    for (const root of roots) {
      const row = this.findExisting(rows, root)
      if (!row) throw new Error(`Taxonomy root missing after reconciliation: ${root.slug}`)
      rootIdBySlug.set(root.slug, row.id)
    }

    await this.reconcileLevel(children, rows, rootIdBySlug)
    rows = await this.readCategories()

    const desiredExternalKeys = new Set(taxonomyDatabaseNodes.map((node) => node.externalKey))
    const staleManagedIds = rows
      .filter((row) => row.external_key?.startsWith(TAXONOMY_CATEGORY_EXTERNAL_KEY_PREFIX))
      .filter((row) => !desiredExternalKeys.has(row.external_key!))
      .filter((row) => row.is_active)
      .map((row) => row.id)

    if (staleManagedIds.length > 0) {
      const { error } = await this.db
        .from('categories')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .in('id', staleManagedIds)
      fail(error, 'Deactivate stale managed taxonomy categories')
      rows = await this.readCategories()
    }

    const uuidBySlug: Record<string, string> = {}
    const externalKeyBySlug: Record<string, string> = {}

    for (const node of taxonomyDatabaseNodes) {
      const row = this.findExisting(rows, node)
      if (!row || !row.is_active) throw new Error(`Taxonomy category not active after reconciliation: ${node.slug}`)

      if (node.parentSlug) {
        const expectedParentId = uuidBySlug[node.parentSlug]
        if (!expectedParentId || row.parent_id !== expectedParentId) {
          throw new Error(`Taxonomy parent mismatch after reconciliation: ${node.slug}`)
        }
      } else if (row.parent_id !== null) {
        throw new Error(`Taxonomy root unexpectedly has a parent after reconciliation: ${node.slug}`)
      }

      uuidBySlug[node.slug] = row.id
      externalKeyBySlug[node.slug] = node.externalKey
    }

    return { uuidBySlug, externalKeyBySlug }
  }
}
