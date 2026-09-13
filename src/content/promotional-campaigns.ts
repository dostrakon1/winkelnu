import { getActiveCommerceEventCampaign, getCommerceEventCampaigns, type CommerceEventCampaign } from '@/content/commerce-event-campaigns'
import { getActiveSeasonalCampaign, seasonalCampaigns, type SeasonalCampaign } from '@/content/seasonal-campaigns'

export type PromotionalCampaign = SeasonalCampaign | CommerceEventCampaign

export function getActivePromotionalCampaign(date = new Date()): PromotionalCampaign | undefined {
  return getActiveCommerceEventCampaign(date) ?? getActiveSeasonalCampaign(date)
}

export function getPromotionalCampaignBySlug(slug: string, date = new Date()): PromotionalCampaign | undefined {
  const commerce = getCommerceEventCampaigns(date.getFullYear()).find((campaign) => campaign.slug === slug)
  return commerce ?? seasonalCampaigns.find((campaign) => campaign.slug === slug)
}
