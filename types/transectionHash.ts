export interface TransectionHashItems {
    block_hash: string
    block_height: number
    block_index: number
    hash: string
    addresses: string[]
    total: number
    fees: number
    size: number
    vsize: number
    preference: string
    confirmed: string
    received: string
    ver: number
    double_spend: boolean
    vin_sz: number
    vout_sz: number
    confirmations: number
    confidence: number
    inputs: Input[]
    outputs: Output[]
  }
  
  export interface Input {
    prev_hash: string
    output_index: number
    script: string
    output_value: number
    sequence: number
    addresses: string[]
    script_type: string
    age: number
  }
  
  export interface Output {
    value: number
    script: string
    spent_by: string
    addresses: string[]
    script_type: string
  }
  