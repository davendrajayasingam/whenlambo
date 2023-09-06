type SpotPrice = {
    exchange: string
    currency: string
    bidPrice: number
    askPrice: number
}

type ConnectionStatus = 'connecting ...' | 'established' | 'connected' | 'disconnected' | 'error'

type SocketData = {
    spot: SpotPrice,
    status: ConnectionStatus
}