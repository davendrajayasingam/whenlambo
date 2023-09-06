import { useEffect, useRef, useState } from 'react'

type Props = {
    currencyToBuy: string
}

export default function useBinanceWebsocket({ currencyToBuy }: Props)
{
    const bidPriceRef = useRef<number>(0)
    const askPriceRef = useRef<number>(0)
    const statusRef = useRef<ConnectionStatus>('initializing ...')

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

        let socket: WebSocket

        const socketOpenListener = () =>
        {
            statusRef.current = 'established'
            setSocketData({
                ...socketData,
                status: statusRef.current
            })
        }

        const socketMessageListener = (event: MessageEvent) =>
        {
            const tickerData = JSON.parse(event.data)

            bidPriceRef.current = parseFloat(tickerData.b) || bidPriceRef.current
            askPriceRef.current = parseFloat(tickerData.a) || askPriceRef.current
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

        const socketErrorListener = () =>
        {
            statusRef.current = 'error'
            setSocketData({
                ...socketData,
                status: statusRef.current
            })
        }

        const socketPingListener = (data: Event) =>
        {
            if (data.toString() === 'ping')
            {
                socket.send('pong')
            }
        }

        const socketCloseListener = () =>
        {
            statusRef.current = 'connecting ...'
            setSocketData({
                ...socketData,
                status: statusRef.current
            })

            // reopens the socket in case of disconnection
            socket = new WebSocket(`wss://data-stream.binance.vision/ws/${currencyToBuy.toLowerCase()}usdt@bookTicker`)
            socket.addEventListener('open', socketOpenListener)
            socket.addEventListener('message', socketMessageListener)
            socket.addEventListener('error', socketErrorListener)
            socket.addEventListener('close', socketCloseListener)
            socket.addEventListener('ping', socketPingListener)
        }

        socketCloseListener()

        return () => socket.close()
    }, [currencyToBuy])


    return socketData
}