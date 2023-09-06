import { NextRequest, NextResponse } from 'next/server'

const handler = async (req: NextRequest) =>
{
    const payload = await fetch('https://api.kucoin.com/api/v1/bullet-public', {
        method: 'POST'
    })
        .then(res => res.json())
    return NextResponse.json(payload)
}

export { handler as GET, handler as POST }