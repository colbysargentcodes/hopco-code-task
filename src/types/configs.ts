export type HeadersConfig<T extends string = string> = {
  fields: T[]
  defaultSort: {
    key: T
    order: 'asc' | 'desc'
  }
}
