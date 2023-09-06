import { useEffect, useRef, useState } from 'react'

type Props = {
    currencyToBuy: string
}

export default function useKrakenWebsocket({ currencyToBuy }: Props)
{
    const bidPriceRef = useRef<number>(0)
    const askPriceRef = useRef<number>(0)
    const statusRef = useRef<ConnectionStatus>('disconnected')

    const [socketData, setSocketData] = useState<SocketData>({
        spot: {
            exchange: 'Kraken',
            currency: currencyToBuy,
            bidPrice: bidPriceRef.current,
            askPrice: askPriceRef.current
        },
        status: statusRef.current
    })

    useEffect(() =>
    {
        statusRef.current = 'connecting ...'
        setSocketData({
            ...socketData,
            status: statusRef.current
        })

        const socket = new WebSocket('wss://ws.kraken.com')

        // Open
        socket.addEventListener('open', () =>
        {
            statusRef.current = 'established'
            setSocketData({
                ...socketData,
                status: statusRef.current
            })

            socket.send(JSON.stringify({
                event: 'subscribe',
                pair: [`${currencyToBuy.toUpperCase()}/USDT`],
                subscription: {
                    name: 'ticker'
                }
            }))
        })

        // Message
        socket.addEventListener('message', event =>
        {
            const tickerData = JSON.parse(event.data)

            console.log('tickerData', tickerData)
            if (tickerData[2] === 'ticker' && tickerData[3] === currencyToBuy.toUpperCase() + '/USDT')
            {
                bidPriceRef.current = parseFloat(tickerData[1].b[0])
                askPriceRef.current = parseFloat(tickerData[1].a[0])
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

        return () => socket.close()
    }, [currencyToBuy])


    return socketData
}