export interface AddressTransectionItem {
  txid: string
  version: number
  locktime: number
  vin: Vin[]
  vout: Vout[]
  size: number
  weight: number
  sigops?: number
  fee: number
  status: Status
}

export interface Vin {
  txid: string
  vout: number
  prevout?: Prevout
  scriptsig: string
  scriptsig_asm: string
  witness?: string[]
  is_coinbase: boolean
  sequence: number | string
  inner_redeemscript_asm?: string
}

export interface Prevout {
  scriptpubkey: string
  scriptpubkey_asm: string
  scriptpubkey_type: string
  scriptpubkey_address: string
  value: number
}

export interface Vout {
  scriptpubkey: string
  scriptpubkey_asm: string
  scriptpubkey_type: string
  scriptpubkey_address?: string
  value: number
}

export interface Status {
  confirmed: boolean
  block_height: number
  block_hash: string
  block_time: number
}
