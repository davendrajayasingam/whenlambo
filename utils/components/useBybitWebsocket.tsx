import { useEffect, useRef, useState } from 'react'

type Props = {
    currencyToBuy: string
}

export default function useBybitWebsocket({ currencyToBuy }: Props)
{
    const bidPriceRef = useRef<number>(0)
    const askPriceRef = useRef<number>(0)
    const statusRef = useRef<ConnectionStatus>('disconnected')

    const [socketData, setSocketData] = useState<SocketData>({
        spot: {
            exchange: 'Bybit',
            currency: currencyToBuy,
            bidPrice: bidPriceRef.current,
            askPrice: askPriceRef.current
        },
        status: statusRef.current
    })

    useEffect(() =>
    {
        let heartbeatInterval: NodeJS.Timeout

        statusRef.current = 'connecting ...'
        setSocketData({
            ...socketData,
            status: statusRef.current
        })

        const socket = new WebSocket('wss://stream.bybit.com/v5/public/spot')
        const topic = `orderbook.1.${currencyToBuy.toUpperCase()}USDT`

        // Open
        socket.addEventListener('open', () =>
        {
            statusRef.current = 'established'
            setSocketData({
                ...socketData,
                status: statusRef.current
            })

            socket.send(JSON.stringify({
                op: 'subscribe',
                args: [topic]
            }))

            heartbeatInterval = setInterval(() => socket.send(JSON.stringify({ 'op': 'ping' })), 20000)
        })

        // Message
        socket.addEventListener('message', event =>
        {
            const tickerData = JSON.parse(event.data)

            if (tickerData.topic === topic)
            {
                bidPriceRef.current |= parseFloat(tickerData.data.b?.[0]?.[0] || 0)
                askPriceRef.current |= parseFloat(tickerData.data.a?.[0]?.[0] || 0)
                statusRef.current = 'connected'

                setSocketData({
                    spot: {
                        ...socketData.spot,
                        bidPrice: bidPriceRef.current,
                        askPrice: askPriceRef.current
                    },
                    status: statusRef.current
                })
            }
        })

        // Error
        socket.addEventListener('error', () =>
        {
            statusRef.current = 'error'
            setSocketData({
                ...socketData,
                status: statusRef.current
            })
        })

        // Handle WebSocket close event
        socket.addEventListener('close', () => 
        {
            statusRef.current = 'disconnected'
            setSocketData({
                ...socketData,
                status: statusRef.current
            })
        })

        return () =>
        {
            socket.close()
            if (heartbeatInterval)
            {
                clearInterval(heartbeatInterval)
            }
        }
    }, [currencyToBuy])


    return socketData
}