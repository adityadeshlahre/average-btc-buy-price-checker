export interface coinMarketCap {
  data: Data
  status: Status
}

export interface Data {
  id: number
  name: string
  symbol: string
  is_active: number
  is_fiat: number
  quotes: Quote[]
}

export interface Quote {
  timestamp: string
  quote: Quote2
}

export interface Quote2 {
  USD: Usd
}

export interface Usd {
  price: number
  volume_24h: number
  market_cap: number
  circulating_supply: number
  total_supply: number
  timestamp: string
}

export interface Status {
  timestamp: string
  error_code: number
  error_message: string
  elapsed: number
  credit_count: number
  notice: string
}
