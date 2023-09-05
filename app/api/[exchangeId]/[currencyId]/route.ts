import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: { exchangeId: string, currencyId: string } })
{
    const exchange = params.exchangeId.toUpperCase()
    const currency = params.currencyId.toUpperCase()

    if (currency !== 'BTC' && currency !== 'ETH')
    {
        return NextResponse.json(0)
    }

    if (exchange !== 'BINANCE' && exchange !== 'KUCOIN' && exchange !== 'KRAKEN' && exchange !== 'BYBIT')
    {
        return NextResponse.json(0)
    }

    if (exchange === 'BINANCE')
    {
        const price = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${currency}USDT`, {
            next: { revalidate: 5 }
        })
            .then(res => res.json())
            .then(data => parseFloat(data.price))
            .catch(err =>
            {
                console.error(err)
                return 0
            })
        return NextResponse.json(price)
    }

    if (exchange === 'KUCOIN')
    {
        const price = await fetch(`https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=${currency}-USDT`, {
            next: { revalidate: 5 }
        })
            .then(res => res.json())
            .then(data => parseFloat(data.data.price))
            .catch(err =>
            {
                console.error(err)
                return 0
            })
        return NextResponse.json(price)
    }

    if (exchange === 'KRAKEN')
    {
        const price = await fetch(`https://api.kraken.com/0/public/Ticker?pair=${currency}USDT`, {
            next: { revalidate: 5 }
        })
            .then(res => res.json())
            .then(data => parseFloat(data.result[Object.keys(data.result)[0]].c[0]))
            .catch(err =>
            {
                console.error(err)
                return 0
            })
        return NextResponse.json(price)
    }

    if (exchange === 'BYBIT')
    {
        const price = await fetch(`https://api.bybit.com/v2/public/tickers?symbol=${currency}USDT`, {
            next: { revalidate: 5 }
        })
            .then(res => res.json())
            .then(data => parseFloat(data.result[0].last_price))
            .catch(err =>
            {
                console.error(err)
                return 0
            })
        return NextResponse.json(price)
    }

    return NextResponse.json(0)
}