import type { DataTableHeader } from 'vuetify'
import type { HeadersConfig } from '@/types/configs'

class HeadersService {
  private headers: DataTableHeader[] = []

  constructor(allHeaders: DataTableHeader[], config?: HeadersConfig) {
    if (config) {
      this.headers = allHeaders
        .filter((header) => typeof header.key === 'string' && config.fields.includes(header.key))
        .sort((a, b) => {
          return config.fields.indexOf(a.key as string) - config.fields.indexOf(b.key as string)
        })
    } else {
      this.headers = allHeaders
    }
  }

  getHeaders(): DataTableHeader[] {
    return this.headers
  }
}

export const headersService = HeadersService
