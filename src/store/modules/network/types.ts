import {AvaNetwork} from "@/js/AvaNetwork";
import BN from "bn.js";

export interface NetworkState {
    networks: AvaNetwork[]
    selectedNetwork: null|AvaNetwork
    // isConnected: boolean
    status: NetworkStatus
    txFee: BN
}

type NetworkStatus = 'disconnected' | 'connecting' | 'connected';


export interface NetworkItem {
    name: string,
    url: string,
    protocol: string,
    port: number,
    networkId: number,
    chainId: string,
}



