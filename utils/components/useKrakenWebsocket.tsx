import { useEffect, useRef, useState } from 'react'

type Props = {
    currencyToBuy: string
}

export default function useKrakenWebsocket({ currencyToBuy }: Props)
{
    const bidPriceRef = useRef<number>(0)
    const askPriceRef = useRef<number>(0)
    const statusRef = useRef<ConnectionStatus>('initializing ...')

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
        if (!currencyToBuy)
        {
            return
        }

        let socket: WebSocket
        const topic = `${currencyToBuy.toUpperCase()}/USDT`

        const socketOpenListener = () =>
        {
            statusRef.current = 'established'
            setSocketData({
                ...socketData,
                status: statusRef.current
            })

            socket.send(JSON.stringify({
                event: 'subscribe',
                pair: [topic],
                subscription: {
                    name: 'ticker'
                }
            }))
        }

        const socketMessageListener = (event: MessageEvent) =>
        {
            const tickerData = JSON.parse(event.data)

            if (tickerData[2] === 'ticker')
            {
                bidPriceRef.current = parseFloat(tickerData[1].b[0]) || bidPriceRef.current
                askPriceRef.current = parseFloat(tickerData[1].a[0]) || askPriceRef.current
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

            // reopens the socket in case of disconnection
            socket = new WebSocket('wss://ws.kraken.com')
            socket.onopen = socketOpenListener
            socket.onmessage = socketMessageListener
            socket.onerror = socketErrorListener
            socket.onclose = socketCloseListener
        }

        socketCloseListener()

        return () => socket.close()
    }, [currencyToBuy])


    return socketData
}