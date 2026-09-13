/* Generated from the live Winkelnu Supabase public schema. Do not edit manually. */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      affiliate_click_events: {
        Row: {
          created_at: string
          external_key: string
          id: string
          merchant_id: string
          occurred_at: string
          offer_id: string
          product_id: string
          source_path: string | null
        }
        Insert: {
          created_at?: string
          external_key: string
          id?: string
          merchant_id: string
          occurred_at?: string
          offer_id: string
          product_id: string
          source_path?: string | null
        }
        Update: {
          created_at?: string
          external_key?: string
          id?: string
          merchant_id?: string
          occurred_at?: string
          offer_id?: string
          product_id?: string
          source_path?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_click_events_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_click_events_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_click_events_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_networks: {
        Row: {
          created_at: string
          external_key: string
          id: string
          is_active: boolean
          kind: string
          name: string
          slug: string
          updated_at: string
          website_url: string | null
        }
        Insert: {
          created_at?: string
          external_key: string
          id?: string
          is_active?: boolean
          kind: string
          name: string
          slug: string
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          created_at?: string
          external_key?: string
          id?: string
          is_active?: boolean
          kind?: string
          name?: string
          slug?: string
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          external_key: string | null
          id: string
          is_active: boolean
          name: string
          parent_id: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          external_key?: string | null
          id?: string
          is_active?: boolean
          name: string
          parent_id?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          external_key?: string | null
          id?: string
          is_active?: boolean
          name?: string
          parent_id?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      feed_import_orchestration: {
        Row: {
          created_at: string
          failure_count: number
          feed_source_id: string
          id: string
          last_error: string | null
          last_started_at: string | null
          last_succeeded_at: string | null
          lease_expires_at: string | null
          lease_owner: string | null
          lease_token: string | null
          next_run_at: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          failure_count?: number
          feed_source_id: string
          id?: string
          last_error?: string | null
          last_started_at?: string | null
          last_succeeded_at?: string | null
          lease_expires_at?: string | null
          lease_owner?: string | null
          lease_token?: string | null
          next_run_at?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          failure_count?: number
          feed_source_id?: string
          id?: string
          last_error?: string | null
          last_started_at?: string | null
          last_succeeded_at?: string | null
          lease_expires_at?: string | null
          lease_owner?: string | null
          lease_token?: string | null
          next_run_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "feed_import_orchestration_feed_source_id_fkey"
            columns: ["feed_source_id"]
            isOneToOne: true
            referencedRelation: "feed_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      feed_sources: {
        Row: {
          affiliate_integration_id: string | null
          config: Json
          created_at: string
          id: string
          is_active: boolean
          merchant_id: string
          source_key: string
          source_type: string
          updated_at: string
        }
        Insert: {
          affiliate_integration_id?: string | null
          config?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          merchant_id: string
          source_key: string
          source_type: string
          updated_at?: string
        }
        Update: {
          affiliate_integration_id?: string | null
          config?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          merchant_id?: string
          source_key?: string
          source_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "feed_sources_affiliate_integration_id_fkey"
            columns: ["affiliate_integration_id"]
            isOneToOne: false
            referencedRelation: "merchant_affiliate_integrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_sources_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      gift_group_assignments: {
        Row: {
          created_at: string
          draw_version: number
          giver_participant_id: string
          group_id: string
          id: string
          recipient_participant_id: string
        }
        Insert: {
          created_at?: string
          draw_version: number
          giver_participant_id: string
          group_id: string
          id?: string
          recipient_participant_id: string
        }
        Update: {
          created_at?: string
          draw_version?: number
          giver_participant_id?: string
          group_id?: string
          id?: string
          recipient_participant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gift_group_assignments_giver_participant_id_fkey"
            columns: ["giver_participant_id"]
            isOneToOne: false
            referencedRelation: "gift_group_participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gift_group_assignments_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "gift_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gift_group_assignments_recipient_participant_id_fkey"
            columns: ["recipient_participant_id"]
            isOneToOne: false
            referencedRelation: "gift_group_participants"
            referencedColumns: ["id"]
          },
        ]
      }
      gift_group_exclusions: {
        Row: {
          created_at: string
          excluded_recipient_id: string
          group_id: string
          id: string
          participant_id: string
        }
        Insert: {
          created_at?: string
          excluded_recipient_id: string
          group_id: string
          id?: string
          participant_id: string
        }
        Update: {
          created_at?: string
          excluded_recipient_id?: string
          group_id?: string
          id?: string
          participant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gift_group_exclusions_excluded_recipient_id_fkey"
            columns: ["excluded_recipient_id"]
            isOneToOne: false
            referencedRelation: "gift_group_participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gift_group_exclusions_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "gift_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gift_group_exclusions_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "gift_group_participants"
            referencedColumns: ["id"]
          },
        ]
      }
      gift_group_participants: {
        Row: {
          created_at: string
          display_name: string
          external_key: string
          gift_list_id: string
          group_id: string
          id: string
          joined_at: string
          participant_token_hash: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name: string
          external_key: string
          gift_list_id: string
          group_id: string
          id?: string
          joined_at?: string
          participant_token_hash: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string
          external_key?: string
          gift_list_id?: string
          group_id?: string
          id?: string
          joined_at?: string
          participant_token_hash?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gift_group_participants_gift_list_id_fkey"
            columns: ["gift_list_id"]
            isOneToOne: true
            referencedRelation: "gift_lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gift_group_participants_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "gift_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      gift_groups: {
        Row: {
          budget_cents: number | null
          created_at: string
          draw_version: number
          event_date: string | null
          expires_at: string
          external_key: string
          group_code_hash: string
          id: string
          name: string
          occasion: string
          organizer_token_hash: string
          status: string
          updated_at: string
        }
        Insert: {
          budget_cents?: number | null
          created_at?: string
          draw_version?: number
          event_date?: string | null
          expires_at: string
          external_key: string
          group_code_hash: string
          id?: string
          name: string
          occasion: string
          organizer_token_hash: string
          status?: string
          updated_at?: string
        }
        Update: {
          budget_cents?: number | null
          created_at?: string
          draw_version?: number
          event_date?: string | null
          expires_at?: string
          external_key?: string
          group_code_hash?: string
          id?: string
          name?: string
          occasion?: string
          organizer_token_hash?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      gift_item_reservations: {
        Row: {
          created_at: string
          gift_list_item_id: string
          group_id: string
          id: string
          reserved_by_participant_id: string
        }
        Insert: {
          created_at?: string
          gift_list_item_id: string
          group_id: string
          id?: string
          reserved_by_participant_id: string
        }
        Update: {
          created_at?: string
          gift_list_item_id?: string
          group_id?: string
          id?: string
          reserved_by_participant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gift_item_reservations_gift_list_item_id_fkey"
            columns: ["gift_list_item_id"]
            isOneToOne: false
            referencedRelation: "gift_list_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gift_item_reservations_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "gift_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gift_item_reservations_reserved_by_participant_id_fkey"
            columns: ["reserved_by_participant_id"]
            isOneToOne: false
            referencedRelation: "gift_group_participants"
            referencedColumns: ["id"]
          },
        ]
      }
      gift_list_items: {
        Row: {
          created_at: string
          currency_snapshot: string | null
          external_url: string | null
          gift_list_id: string
          id: string
          image_url_snapshot: string | null
          item_type: string
          note: string | null
          price_cents_snapshot: number | null
          product_external_key: string | null
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency_snapshot?: string | null
          external_url?: string | null
          gift_list_id: string
          id?: string
          image_url_snapshot?: string | null
          item_type: string
          note?: string | null
          price_cents_snapshot?: number | null
          product_external_key?: string | null
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency_snapshot?: string | null
          external_url?: string | null
          gift_list_id?: string
          id?: string
          image_url_snapshot?: string | null
          item_type?: string
          note?: string | null
          price_cents_snapshot?: number | null
          product_external_key?: string | null
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gift_list_items_gift_list_id_fkey"
            columns: ["gift_list_id"]
            isOneToOne: false
            referencedRelation: "gift_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      gift_lists: {
        Row: {
          budget_max_cents: number | null
          budget_min_cents: number | null
          created_at: string
          display_name: string
          event_date: string | null
          expires_at: string
          external_key: string
          id: string
          occasion: string
          owner_token_hash: string | null
          share_code_hash: string
          status: string
          title: string | null
          updated_at: string
        }
        Insert: {
          budget_max_cents?: number | null
          budget_min_cents?: number | null
          created_at?: string
          display_name: string
          event_date?: string | null
          expires_at: string
          external_key: string
          id?: string
          occasion: string
          owner_token_hash?: string | null
          share_code_hash: string
          status?: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          budget_max_cents?: number | null
          budget_min_cents?: number | null
          created_at?: string
          display_name?: string
          event_date?: string | null
          expires_at?: string
          external_key?: string
          id?: string
          occasion?: string
          owner_token_hash?: string | null
          share_code_hash?: string
          status?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      import_rejects: {
        Row: {
          id: string
          import_run_id: string
          merchant_product_id: string
          raw_record: Json | null
          reasons: Json
          rejected_at: string
          source_key: string
        }
        Insert: {
          id?: string
          import_run_id: string
          merchant_product_id: string
          raw_record?: Json | null
          reasons?: Json
          rejected_at?: string
          source_key: string
        }
        Update: {
          id?: string
          import_run_id?: string
          merchant_product_id?: string
          raw_record?: Json | null
          reasons?: Json
          rejected_at?: string
          source_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "import_rejects_import_run_id_fkey"
            columns: ["import_run_id"]
            isOneToOne: false
            referencedRelation: "import_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      import_runs: {
        Row: {
          correlation_id: string | null
          error_summary: Json
          external_key: string | null
          feed_source_id: string
          finished_at: string | null
          id: string
          offers_deactivated: number
          records_accepted: number
          records_rejected: number
          records_seen: number
          review_required: number
          started_at: string
          status: string
        }
        Insert: {
          correlation_id?: string | null
          error_summary?: Json
          external_key?: string | null
          feed_source_id: string
          finished_at?: string | null
          id?: string
          offers_deactivated?: number
          records_accepted?: number
          records_rejected?: number
          records_seen?: number
          review_required?: number
          started_at?: string
          status?: string
        }
        Update: {
          correlation_id?: string | null
          error_summary?: Json
          external_key?: string | null
          feed_source_id?: string
          finished_at?: string | null
          id?: string
          offers_deactivated?: number
          records_accepted?: number
          records_rejected?: number
          records_seen?: number
          review_required?: number
          started_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "import_runs_feed_source_id_fkey"
            columns: ["feed_source_id"]
            isOneToOne: false
            referencedRelation: "feed_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      merchant_affiliate_integrations: {
        Row: {
          affiliate_network_id: string | null
          created_at: string
          external_key: string
          id: string
          kind: string
          merchant_id: string
          program_identifier: string | null
          secret_ref: string | null
          status: string
          tracking_config: Json
          updated_at: string
        }
        Insert: {
          affiliate_network_id?: string | null
          created_at?: string
          external_key: string
          id?: string
          kind: string
          merchant_id: string
          program_identifier?: string | null
          secret_ref?: string | null
          status?: string
          tracking_config?: Json
          updated_at?: string
        }
        Update: {
          affiliate_network_id?: string | null
          created_at?: string
          external_key?: string
          id?: string
          kind?: string
          merchant_id?: string
          program_identifier?: string | null
          secret_ref?: string | null
          status?: string
          tracking_config?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "merchant_affiliate_integrations_affiliate_network_id_fkey"
            columns: ["affiliate_network_id"]
            isOneToOne: false
            referencedRelation: "affiliate_networks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "merchant_affiliate_integrations_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      merchants: {
        Row: {
          created_at: string
          external_key: string | null
          id: string
          is_active: boolean
          name: string
          slug: string
          updated_at: string
          website_url: string
        }
        Insert: {
          created_at?: string
          external_key?: string | null
          id?: string
          is_active?: boolean
          name: string
          slug: string
          updated_at?: string
          website_url: string
        }
        Update: {
          created_at?: string
          external_key?: string | null
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          updated_at?: string
          website_url?: string
        }
        Relationships: []
      }
      offers: {
        Row: {
          affiliate_url: string
          availability: string | null
          created_at: string
          currency: string
          external_key: string | null
          feed_source_id: string | null
          id: string
          imported_at: string
          is_active: boolean
          last_seen_at: string
          merchant_id: string
          merchant_product_id: string
          price: number
          product_id: string
          product_url: string
          shipping_cost: number | null
          source_updated_at: string | null
          updated_at: string
        }
        Insert: {
          affiliate_url: string
          availability?: string | null
          created_at?: string
          currency?: string
          external_key?: string | null
          feed_source_id?: string | null
          id?: string
          imported_at?: string
          is_active?: boolean
          last_seen_at?: string
          merchant_id: string
          merchant_product_id: string
          price: number
          product_id: string
          product_url: string
          shipping_cost?: number | null
          source_updated_at?: string | null
          updated_at?: string
        }
        Update: {
          affiliate_url?: string
          availability?: string | null
          created_at?: string
          currency?: string
          external_key?: string | null
          feed_source_id?: string | null
          id?: string
          imported_at?: string
          is_active?: boolean
          last_seen_at?: string
          merchant_id?: string
          merchant_product_id?: string
          price?: number
          product_id?: string
          product_url?: string
          shipping_cost?: number | null
          source_updated_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "offers_feed_source_id_fkey"
            columns: ["feed_source_id"]
            isOneToOne: false
            referencedRelation: "feed_sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offers_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offers_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      operator_action_requests: {
        Row: {
          action: string
          actor_user_id: string
          completed_at: string | null
          created_at: string
          error_message: string | null
          id: string
          request_key: string
          status: string
          target_id: string | null
          target_type: string
        }
        Insert: {
          action: string
          actor_user_id: string
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          request_key: string
          status?: string
          target_id?: string | null
          target_type: string
        }
        Update: {
          action?: string
          actor_user_id?: string
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          request_key?: string
          status?: string
          target_id?: string | null
          target_type?: string
        }
        Relationships: []
      }
      operator_audit_events: {
        Row: {
          action: string
          actor_email: string
          actor_role: string
          actor_user_id: string
          correlation_id: string
          error_message: string | null
          id: string
          metadata: Json
          occurred_at: string
          status: string
          target_id: string | null
          target_type: string
        }
        Insert: {
          action: string
          actor_email: string
          actor_role: string
          actor_user_id: string
          correlation_id: string
          error_message?: string | null
          id?: string
          metadata?: Json
          occurred_at?: string
          status: string
          target_id?: string | null
          target_type: string
        }
        Update: {
          action?: string
          actor_email?: string
          actor_role?: string
          actor_user_id?: string
          correlation_id?: string
          error_message?: string | null
          id?: string
          metadata?: Json
          occurred_at?: string
          status?: string
          target_id?: string | null
          target_type?: string
        }
        Relationships: []
      }
      product_identifiers: {
        Row: {
          confidence: number | null
          created_at: string
          id: string
          identifier_type: string
          identifier_value: string
          merchant_id: string | null
          product_id: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          id?: string
          identifier_type: string
          identifier_value: string
          merchant_id?: string | null
          product_id: string
        }
        Update: {
          confidence?: number | null
          created_at?: string
          id?: string
          identifier_type?: string
          identifier_value?: string
          merchant_id?: string | null
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_identifiers_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_identifiers_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_match_reviews: {
        Row: {
          canonical_product_id: string | null
          confidence: string
          created_at: string
          id: string
          import_run_id: string
          match_method: string
          merchant_id: string
          merchant_product_id: string
          reasons: Json
          resolved_at: string | null
          source_key: string
          status: string
        }
        Insert: {
          canonical_product_id?: string | null
          confidence: string
          created_at?: string
          id?: string
          import_run_id: string
          match_method: string
          merchant_id: string
          merchant_product_id: string
          reasons?: Json
          resolved_at?: string | null
          source_key: string
          status?: string
        }
        Update: {
          canonical_product_id?: string | null
          confidence?: string
          created_at?: string
          id?: string
          import_run_id?: string
          match_method?: string
          merchant_id?: string
          merchant_product_id?: string
          reasons?: Json
          resolved_at?: string | null
          source_key?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_match_reviews_canonical_product_id_fkey"
            columns: ["canonical_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_match_reviews_import_run_id_fkey"
            columns: ["import_run_id"]
            isOneToOne: false
            referencedRelation: "import_runs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_match_reviews_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand: string | null
          category_id: string | null
          created_at: string
          description: string | null
          external_key: string | null
          id: string
          mpn: string | null
          primary_gtin: string | null
          primary_image_url: string | null
          slug: string
          specifications: Json
          status: string
          title: string
          updated_at: string
          visual_kind: string | null
        }
        Insert: {
          brand?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          external_key?: string | null
          id?: string
          mpn?: string | null
          primary_gtin?: string | null
          primary_image_url?: string | null
          slug: string
          specifications?: Json
          status?: string
          title: string
          updated_at?: string
          visual_kind?: string | null
        }
        Update: {
          brand?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          external_key?: string | null
          id?: string
          mpn?: string | null
          primary_gtin?: string | null
          primary_image_url?: string | null
          slug?: string
          specifications?: Json
          status?: string
          title?: string
          updated_at?: string
          visual_kind?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      search_feedback_events: {
        Row: {
          best_match_count: number | null
          category_slug: string | null
          corrected_query: string | null
          created_at: string
          event_type: string
          id: string
          intent_keys: string[]
          previous_query_normalized: string | null
          product_term: string | null
          query_normalized: string
          target_key: string | null
          target_kind: string | null
          target_position: number | null
          zero_results: boolean
        }
        Insert: {
          best_match_count?: number | null
          category_slug?: string | null
          corrected_query?: string | null
          created_at?: string
          event_type: string
          id?: string
          intent_keys?: string[]
          previous_query_normalized?: string | null
          product_term?: string | null
          query_normalized: string
          target_key?: string | null
          target_kind?: string | null
          target_position?: number | null
          zero_results?: boolean
        }
        Update: {
          best_match_count?: number | null
          category_slug?: string | null
          corrected_query?: string | null
          created_at?: string
          event_type?: string
          id?: string
          intent_keys?: string[]
          previous_query_normalized?: string | null
          product_term?: string | null
          query_normalized?: string
          target_key?: string | null
          target_kind?: string | null
          target_position?: number | null
          zero_results?: boolean
        }
        Relationships: []
      }
    }
    Views: {
      search_feedback_query_summary: {
        Row: {
          best_match_clicks: number | null
          last_seen_at: string | null
          opportunity_score: number | null
          predictive_clicks: number | null
          product_clicks: number | null
          query_normalized: string | null
          refinements: number | null
          searches: number | null
          zero_result_searches: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      catalog_ranked_products: {
        Args: {
          p_brand?: string
          p_category_slug?: string
          p_in_stock_only?: boolean
          p_limit?: number
          p_max_total?: number
          p_min_total?: number
          p_now: string
          p_offset?: number
          p_sort?: string
          p_term?: string
        }
        Returns: {
          affiliate_url: string
          availability: string
          category_external_key: string
          freshness: string
          imported_at: string
          last_seen_at: string
          merchant_external_key: string
          merchant_name: string
          merchant_product_id: string
          merchant_slug: string
          merchant_website_url: string
          offer_count: number
          offer_external_key: string
          price: number
          product_brand: string
          product_description: string
          product_external_key: string
          product_gtin: string
          product_image_url: string
          product_mpn: string
          product_slug: string
          product_specifications: Json
          product_title: string
          product_url: string
          product_visual_kind: string
          relevance: number
          shipping_cost: number
          source_updated_at: string
          total_amount: number
        }[]
      }
      complete_feed_import_failure: {
        Args: {
          p_error: string
          p_finished_at: string
          p_merchant_external_key: string
          p_next_run_at: string
          p_source_key: string
          p_token: string
        }
        Returns: boolean
      }
      complete_feed_import_success: {
        Args: {
          p_finished_at: string
          p_merchant_external_key: string
          p_next_run_at: string
          p_source_key: string
          p_token: string
        }
        Returns: boolean
      }
      list_due_feed_imports: {
        Args: { p_limit?: number; p_now: string }
        Returns: {
          merchant_external_key: string
          next_run_at: string
          source_key: string
        }[]
      }
      operator_pause_feed: {
        Args: { p_merchant_external_key: string; p_source_key: string }
        Returns: undefined
      }
      operator_resume_feed: {
        Args: {
          p_merchant_external_key: string
          p_now: string
          p_source_key: string
        }
        Returns: undefined
      }
      operator_retry_feed: {
        Args: {
          p_merchant_external_key: string
          p_now: string
          p_source_key: string
        }
        Returns: undefined
      }
      renew_feed_import_lease: {
        Args: {
          p_expires_at: string
          p_merchant_external_key: string
          p_renewed_at: string
          p_source_key: string
          p_token: string
        }
        Returns: boolean
      }
      try_acquire_feed_import_lease: {
        Args: {
          p_acquired_at: string
          p_expires_at: string
          p_merchant_external_key: string
          p_owner: string
          p_source_key: string
          p_token: string
        }
        Returns: {
          failure_count: number
          last_error: string
          last_started_at: string
          last_succeeded_at: string
          lease_expires_at: string
          lease_owner: string
          lease_token: string
          merchant_external_key: string
          next_run_at: string
          source_key: string
        }[]
      }
      winkelnu_operations_security_readiness: {
        Args: never
        Returns: {
          audit_append_only_trigger: boolean
          operator_rls_tables: number
          operator_tables_without_policies: number
          recovery_functions_anon_denied: boolean
          recovery_functions_authenticated_denied: boolean
          recovery_functions_service_role: boolean
          service_role_table_contract: boolean
          untrusted_operator_table_grants: number
        }[]
      }
      winkelnu_production_readiness: {
        Args: never
        Returns: {
          active_feed_sources: number
          active_merchants: number
          active_offers: number
          latest_successful_import_at: string
          published_products: number
          rls_enabled_tables: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
