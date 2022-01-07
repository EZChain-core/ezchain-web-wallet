import { UTXO } from 'ezchainjs2/dist/apis/avm'

export interface NftGroupDict {
    [key: string]: [UTXO]
}
