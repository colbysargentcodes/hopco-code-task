import { describe, it, expect } from 'vitest'
import { headersService } from '../headersService'
import type { DataTableHeader } from 'vuetify'
import type { HeadersConfig } from '@/types/configs'

const allHeaders: DataTableHeader[] = [
  { key: 'a', title: 'A' },
  { key: 'b', title: 'B' },
  { key: 'c', title: 'C' },
]

const config: HeadersConfig = {
  fields: ['b', 'a'],
  defaultSort: { key: 'a', order: 'asc' },
}

describe('headersService', () => {
  it('returns all headers if no config is provided', () => {
    const service = new headersService(allHeaders)
    expect(service.getHeaders()).toEqual(allHeaders)
  })

  it('filters and sorts headers according to config.fields', () => {
    const service = new headersService(allHeaders, config)
    expect(service.getHeaders()).toEqual([
      { key: 'b', title: 'B' },
      { key: 'a', title: 'A' },
    ])
  })

  it('returns an empty array if config.fields does not match any header', () => {
    const badConfig: HeadersConfig = { fields: ['x', 'y'], defaultSort: { key: 'x', order: 'asc' } }
    const service = new headersService(allHeaders, badConfig)
    expect(service.getHeaders()).toEqual([])
  })
})
