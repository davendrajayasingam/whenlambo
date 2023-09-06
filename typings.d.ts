type SpotPrice = {
    exchange: string
    currency: string
    bidPrice: number
    askPrice: number
}

type SpotPricesResponse = {
    prices: SpotPrice[]
    nextUpdate: number
    bestExchange: SpotPrice
}

type ConnectionStatus = 'connecting ...' | 'established' | 'connected' | 'disconnected' | 'error'

type SocketData = {
    spot: SpotPrice,
    status: ConnectionStatus
}