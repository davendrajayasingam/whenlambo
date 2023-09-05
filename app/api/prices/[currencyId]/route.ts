import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: { currencyId: string } })
{
    const currency = params.currencyId.toUpperCase()

    if (currency !== 'BTC' && currency !== 'ETH')
    {
        return NextResponse.json(0)
    }

    const kucoinPrice = await fetch(`https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=${currency}-USDT`, {
        next: { revalidate: 5 }
    })
        .then(res => res.json())
        .then(data => parseFloat(data.data.price))
        .catch(err =>
        {
            console.error(err)
            return 0
        })

    return NextResponse.json(kucoinPrice)
}