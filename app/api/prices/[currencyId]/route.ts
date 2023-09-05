import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: { currencyId: string } })
{
    const currency = params.currencyId.toUpperCase()

    const payload = [
        { exchange: 'Binance', currency, price: 0 },
        { exchange: 'Kucoin', currency, price: 0 },
        { exchange: 'Kraken', currency, price: 0 },
        { exchange: 'Bybit', currency, price: 0 }
    ]

    if (currency !== 'BTC' && currency !== 'ETH')
    {
        return NextResponse.json(payload)
    }

    const [binancePrice, kucoinPrice, krakenPrice, bybitPrice] = await Promise.all([
        fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${currency}USDT`, { next: { revalidate: 5 } })
            .then(res => res.json())
            .then(data => parseFloat(data.price))
            .catch(err =>
            {
                console.error(err)
                return 0
            }),
        fetch(`https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=${currency}-USDT`, { next: { revalidate: 5 } })
            .then(res => res.json())
            .then(data => parseFloat(data.data.price))
            .catch(err =>
            {
                console.error(err)
                return 0
            }),
        fetch(`https://api.kraken.com/0/public/Ticker?pair=${currency}USDT`, { next: { revalidate: 5 } })
            .then(res => res.json())
            .then(data => parseFloat(data.result[Object.keys(data.result)[0]].c[0]))
            .catch(err =>
            {
                console.error(err)
                return 0
            }),
        fetch(`https://api.bybit.com/v2/public/tickers?symbol=${currency}USDT`, { next: { revalidate: 5 } })
            .then(res => res.json())
            .then(data => parseFloat(data.result[0].last_price))
            .catch(err =>
            {
                console.error(err)
                return 0
            })
    ])

    payload[0].price = binancePrice
    payload[1].price = kucoinPrice
    payload[2].price = krakenPrice
    payload[3].price = bybitPrice

    return NextResponse.json(payload)
}