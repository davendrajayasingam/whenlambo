import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: { exchangeId: string, currencyId: string } })
{
    const exchange = params.exchangeId.toUpperCase()
    const currency = params.currencyId.toUpperCase()

    const defaultPrice = {
        exchange,
        currency,
        bidPrice: 0,
        askPrice: 0
    } as SpotPrice

    if (currency !== 'BTC' && currency !== 'ETH')
    {
        return NextResponse.json(defaultPrice)
    }

    if (exchange !== 'BINANCE' && exchange !== 'KUCOIN' && exchange !== 'KRAKEN' && exchange !== 'BYBIT')
    {
        return NextResponse.json(defaultPrice)
    }

    if (exchange === 'BINANCE')
    {
        const price = await fetch(`https://data-api.binance.vision/bookTicker?symbol=${currency}USDT`, {
            next: { revalidate: 5 }
        })
            .then(res => res.json())
            .then(data =>
            {
                return {
                    ...defaultPrice,
                    bidPrice: parseFloat(data.bidPrice),
                    askPrice: parseFloat(data.askPrice)
                } as SpotPrice
            })
            .catch(err =>
            {
                console.error(err)
                return defaultPrice
            })
        return NextResponse.json(price)
    }

    if (exchange === 'KUCOIN')
    {
        const price = await fetch(`https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=${currency}-USDT`, {
            next: { revalidate: 5 }
        })
            .then(res => res.json())
            .then(data =>
            {
                return {
                    ...defaultPrice,
                    bidPrice: parseFloat(data.data.bestBid),
                    askPrice: parseFloat(data.data.bestAsk)
                } as SpotPrice
            })
            .catch(err =>
            {
                console.error(err)
                return defaultPrice
            })
        return NextResponse.json(price)
    }

    if (exchange === 'KRAKEN')
    {
        const price = await fetch(`https://api.kraken.com/0/public/Ticker?pair=${currency}USDT`, {
            next: { revalidate: 5 }
        })
            .then(res => res.json())
            .then(data =>
            {
                return {
                    ...defaultPrice,
                    bidPrice: parseFloat(data.result[Object.keys(data.result)[0]].b[0]),
                    askPrice: parseFloat(data.result[Object.keys(data.result)[0]].a[0])
                } as SpotPrice
            })
            .catch(err =>
            {
                console.error(err)
                return defaultPrice
            })
        return NextResponse.json(price)
    }

    if (exchange === 'BYBIT')
    {
        const price = await fetch(`https://api.bybit.com/v2/public/tickers?symbol=${currency}USDT`, {
            next: { revalidate: 5 }
        })
            .then(res => res.json())
            .then(data =>
            {
                return {
                    ...defaultPrice,
                    bidPrice: parseFloat(data.result[0].bid_price),
                    askPrice: parseFloat(data.result[0].ask_price)
                } as SpotPrice
            })
            .catch(err =>
            {
                console.error(err)
                return defaultPrice
            })
        return NextResponse.json(price)
    }

    return NextResponse.json(defaultPrice)
}