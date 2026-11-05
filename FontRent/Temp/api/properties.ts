import type { Property } from '../data/properties'
import { apiRequest } from './client'

export interface CreatePropertyInput extends Property {
  durationMonths: number
  creditsToCharge: number
}

export interface CreatePropertyResult {
  property: Property
  remainingCredits: number
}

export function fetchProperties() {
  return apiRequest<Property[]>('/properties')
}

export function fetchAdminProperties() {
  return apiRequest<Property[]>('/admin/properties')
}

export function createProperty(input: CreatePropertyInput) {
  return apiRequest<CreatePropertyResult>('/owner/properties', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function deleteProperty(id: number) {
  return apiRequest<void>(`/admin/properties/${encodeURIComponent(id)}`, { method: 'DELETE' })
}
