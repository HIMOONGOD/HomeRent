import { apiRequest } from './client'

export interface AdminOverview {
  listingCount: number
  ownerCount: number
  locationCount: number
  cashPaymentStatus: 'connected' | 'not_configured'
  commissionPercent: 0
}

export function fetchAdminOverview() {
  return apiRequest<AdminOverview>('/admin/overview')
}

export function fetchAdminOwners() {
  return apiRequest<Array<{ id: string; name: string; email: string; status: string }>>('/admin/owners')
}
