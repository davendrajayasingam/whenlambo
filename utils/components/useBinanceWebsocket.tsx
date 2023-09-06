import { useEffect, useRef, useState } from 'react'

type Props = {
    currencyToBuy: string
}

export default function useBinanceWebsocket({ currencyToBuy }: Props)
{
    const bidPriceRef = useRef<number>(0)
    const askPriceRef = useRef<number>(0)
    const statusRef = useRef<ConnectionStatus>('disconnected')

    const [socketData, setSocketData] = useState<SocketData>({
        spot: {
            exchange: 'Binance',
            currency: currencyToBuy,
            bidPrice: bidPriceRef.current,
            askPrice: askPriceRef.current
        },
        status: statusRef.current
    })

    useEffect(() =>
    {
        if (!currencyToBuy)
        {
            return
        }

        statusRef.current = 'connecting ...'
        setSocketData({
            ...socketData,
            status: statusRef.current
        })

        const socket = new WebSocket(`wss://data-stream.binance.vision/ws/${currencyToBuy.toLowerCase()}usdt@bookTicker`)

        // Open
        socket.addEventListener('open', () =>
        {
            statusRef.current = 'established'
            setSocketData({
                ...socketData,
                status: statusRef.current
            })
        })

        // Message
        socket.addEventListener('message', event =>
        {
            const tickerData = JSON.parse(event.data)

            bidPriceRef.current = parseFloat(tickerData.b)
            askPriceRef.current = parseFloat(tickerData.a)
            statusRef.current = 'connected'

            setSocketData({
                spot: {
                    ...socketData.spot,
                    bidPrice: bidPriceRef.current,
                    askPrice: askPriceRef.current
                },
                status: statusRef.current
            })
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

        socket.addEventListener('ping', data =>
        {
            console.log('Received data from Binance:', data)

            // Check if the received message is a Ping from Binance
            if (data.toString() === 'ping')
            {
                console.log('Received Ping from Binance. Sending Pong.')
                socket.send('pong')
            }
        })

        return () => socket.close()
    }, [currencyToBuy])


    return socketData
}