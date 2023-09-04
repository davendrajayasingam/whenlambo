type Exchange = 'Binance' | 'Kucoin' | 'Kraken' | 'Bybit'

type Currency = 'BTC' | 'ETH'

type ExchangeRate = {
    exchange: Exchange
    price: number
}