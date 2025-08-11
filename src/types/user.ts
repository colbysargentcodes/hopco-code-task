import type { Hospital } from '@/types/hospital'

export type User = {
  id: number
  name: string
  email: string
  hospital: Hospital
}
