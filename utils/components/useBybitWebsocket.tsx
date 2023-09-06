import { useEffect, useRef, useState } from 'react'
import { Socket, io } from 'socket.io-client'

type Props = {
    currencyToBuy: string
}

export default function useBybitWebsocket({ currencyToBuy }: Props)
{
    const bidPriceRef = useRef<number>(0)
    const askPriceRef = useRef<number>(0)
    const statusRef = useRef<ConnectionStatus>('initializing ...')

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
        if (!currencyToBuy)
        {
            return
        }

        let socket: Socket
        let heartbeatInterval: NodeJS.Timeout
        const topic = `orderbook.1.${currencyToBuy.toUpperCase()}USDT`

        const socketOpenListener = () =>
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
        }

        const socketMessageListener = ({ type, data }: any) =>
        {
            console.log('type', type, 'data', data)
            // const tickerData = JSON.parse(event.data)

            // if (tickerData.topic === topic)
            // {
            //     bidPriceRef.current = parseFloat(tickerData.data.b?.[0]?.[0] || 0) || bidPriceRef.current
            //     askPriceRef.current = parseFloat(tickerData.data.a?.[0]?.[0] || 0) || askPriceRef.current
            //     statusRef.current = 'connected'

            //     setSocketData({
            //         spot: {
            //             ...socketData.spot,
            //             bidPrice: bidPriceRef.current,
            //             askPrice: askPriceRef.current
            //         },
            //         status: statusRef.current
            //     })
            // }
        }

        const socketErrorListener = () =>
        {
            statusRef.current = 'error'
            setSocketData({
                ...socketData,
                status: statusRef.current
            })
        }

        const socketCloseListener = () =>
        {
            statusRef.current = 'connecting ...'
            setSocketData({
                ...socketData,
                status: statusRef.current
            })

            // reopens the socket in case of disconnection
            socket = io('wss://stream.bybit.com/v5/public/spot', {
                reconnectionDelayMax: 10000
            })
            // socket = new WebSocket('wss://stream.bybit.com/v5/public/spot')
            socket.io.on('open', socketOpenListener)
            socket.io.on('packet', socketMessageListener)
            socket.io.on('error', socketErrorListener)
            socket.io.on('close', socketCloseListener)
        }

        socketCloseListener()

        return () =>
        {
            if (heartbeatInterval)
            {
                clearInterval(heartbeatInterval)
            }
            socket.close()
        }
    }, [currencyToBuy])


    return socketData
}