import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest)
{
    const currency = 'BTC'
    const response = await fetch(`https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=${currency}-USDT`, { cache: 'no-store' })
        .then(res => res.json())
        .then(data => data.data.price)
        .catch(() => 0)
    return NextResponse.json(response)
}