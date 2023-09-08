import axios from 'axios'
import { useEffect, useRef, useState } from 'react'

type Props = {
    currencyToBuy: string
}

export default function useKucoinWebsocket({ currencyToBuy }: Props)
{
    const bidPriceRef = useRef<number>(0)
    const askPriceRef = useRef<number>(0)
    const statusRef = useRef<ConnectionStatus>('initializing ...')

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

    const updateConnectionDetails = () =>
    {
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
    }

    useEffect(() =>
    {
        if (!currencyToBuy)
        {
            return
        }

        updateConnectionDetails()
    }, [currencyToBuy])

    useEffect(() =>
    {
        if (!connectionDetails)
        {
            return
        }

        let heartbeatInterval: NodeJS.Timeout
        let socket: WebSocket
        const topic = `/market/ticker:${currencyToBuy.toUpperCase()}-USDT`

        const socketOpenListener = () =>
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
        }

        const socketMessageListener = (event: MessageEvent) =>
        {
            const tickerData = JSON.parse(event.data)

            if (tickerData.type === 'message' && tickerData.topic === topic && tickerData.subject === 'trade.ticker')
            {
                bidPriceRef.current = parseFloat(tickerData?.data?.bestBid || 0) || bidPriceRef.current
                askPriceRef.current = parseFloat(tickerData?.data?.bestAsk || 0) || askPriceRef.current
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

            if (heartbeatInterval)
            {
                clearInterval(heartbeatInterval)
            }

            // reopens the socket in case of disconnection
            socket = new WebSocket(`${connectionDetails.endpoint}?token=${connectionDetails.token}`)
            socket.onopen = socketOpenListener
            socket.onmessage = socketMessageListener
            socket.onerror = socketErrorListener
            socket.onclose = () =>
            {
                socket.close()
                setTimeout(() =>
                {
                    updateConnectionDetails()
                }, 5000)
            }
        }

        socketCloseListener()

        return () => socket.close()
    }, [connectionDetails])


    return socketData
}