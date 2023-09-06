import axios from 'axios'
import { useEffect, useRef, useState } from 'react'

type Props = {
    currencyToBuy: string
}

export default function useKucoinWebsocket({ currencyToBuy }: Props)
{
    const bidPriceRef = useRef<number>(0)
    const askPriceRef = useRef<number>(0)
    const statusRef = useRef<ConnectionStatus>('disconnected')

    const getRandomNumber = () => Math.floor(Math.random() * 1000000000)
    const connectionIdRef = useRef<number>(getRandomNumber())

    const [connectionDetails, setConnectionDetails] = useState<{
        token: string
        endpoint: string
        pingInterval: number
    }>()

    const [socketData, setSocketData] = useState<SocketData>({
        spot: {
            exchange: 'Kucoin',
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

        axios.post('/api/kucoin')
            .then(response => response.data.data)
            .then(data =>
            {
                setConnectionDetails({
                    token: data.token,
                    endpoint: data.instanceServers[0].endpoint,
                    pingInterval: data.instanceServers[0].pingInterval
                })
            })
    }, [currencyToBuy])

    useEffect(() =>
    {
        if (!connectionDetails)
        {
            return
        }

        let heartbeatInterval: NodeJS.Timeout

        statusRef.current = 'connecting ...'
        setSocketData({
            ...socketData,
            status: statusRef.current
        })

        const socket = new WebSocket(`${connectionDetails.endpoint}?token=${connectionDetails.token}`)
        const topic = `/market/ticker:${currencyToBuy.toUpperCase()}-USDT`

        // Open
        socket.addEventListener('open', data =>
        {
            statusRef.current = 'established'
            setSocketData({
                ...socketData,
                status: statusRef.current
            })

            socket.send(JSON.stringify({
                id: connectionIdRef.current, //The id should be an unique value
                type: 'subscribe',
                topic, //Topic needs to be subscribed. Some topics support to divisional subscribe the informations of multiple trading pairs through ",".
                privateChannel: false, //Adopted the private channel or not. Set as false by default.
                response: true //Whether the server needs to return the receipt information of this subscription or not. Set as false by default.
            }))

            heartbeatInterval = setInterval(() => socket.send(JSON.stringify({
                id: connectionIdRef.current,
                type: 'ping'
            })), connectionDetails.pingInterval)
        })

        // Message
        socket.addEventListener('message', event =>
        {
            const tickerData = JSON.parse(event.data)

            if (tickerData.type === 'message' && tickerData.topic === topic && tickerData.subject === 'trade.ticker')
            {
                bidPriceRef.current |= parseFloat(tickerData?.data?.bestBid || 0)
                askPriceRef.current |= parseFloat(tickerData?.data?.bestAsk || 0)
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
            else
            {
                console.log(tickerData)
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

        return () => socket.close()
    }, [connectionDetails])


    return socketData
}