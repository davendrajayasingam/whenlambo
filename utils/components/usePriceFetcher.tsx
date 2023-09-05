import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'

type Props = {
    currencyToBuy: string
}

const intervalInMs = 10000 // refresh the data every 10 seconds

export default function usePriceFetcher({ currencyToBuy }: Props)
{
    const [binancePrice, setBinancePrice] = useState<number>(0)
    const [kucoinPrice, setKucoinPrice] = useState<number>(0)
    const [krakenPrice, setKrakenPrice] = useState<number>(0)
    const [bybitPrice, setBybitPrice] = useState<number>(0)
    const [nextRefresh, setNextRefresh] = useState<number>(0)

    // setup a timer to fetch and update prices every {x} seconds
    useEffect(() =>
    {
        if (currencyToBuy !== 'btc' && currencyToBuy !== 'eth')
        {
            return
        }

        const currency = currencyToBuy.toUpperCase()

        const fetchPrices = async () =>
        {
            await Promise.all([
                // Binance
                fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${currency}USDT`, {
                    cache: 'no-store'
                })
                    .then(res => res.json())
                    .then(data => setBinancePrice(parseFloat(data.price)))
                    .catch(() =>
                    {
                        setBinancePrice(0)
                        toast.error('Failed to fetch Binance price')
                    }),
                // Kucoin has a cors issue, so we use our own api gateway to get the price
                axios.get(`/api/prices/${currencyToBuy.toLowerCase()}`, {
                    headers: {
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache',
                        'Expires': '0'
                    }
                })
                    .then(response => setKucoinPrice(parseFloat(response.data)))
                    .catch(() =>
                    {
                        setKucoinPrice(0)
                        toast.error('Failed to fetch Kucoin price')
                    }),
                // Kraken
                fetch(`https://api.kraken.com/0/public/Ticker?pair=${currency}USDT`, {
                    cache: 'no-store'
                })
                    .then(res => res.json())
                    .then(data => setKrakenPrice(parseFloat(data.result[Object.keys(data.result)[0]].c[0])))
                    .catch(() =>
                    {
                        setKrakenPrice(0)
                        toast.error('Failed to fetch Kraken price')
                    }),
                // Bybit
                fetch(`https://api.bybit.com/v2/public/tickers?symbol=${currency}USDT`, {
                    cache: 'no-store'
                })
                    .then(res => res.json())
                    .then(data => setBybitPrice(parseFloat(data.result[0].last_price)))
                    .catch(() =>
                    {
                        setBybitPrice(0)
                        toast.error('Failed to fetch Bybit price')
                    })
            ])
                .catch(() => toast.error('Failed to fetch prices.'))
                .finally(() => setNextRefresh(Date.now() + intervalInMs))
        }
        fetchPrices()

        const timer = setInterval(fetchPrices, intervalInMs)
        return () => clearInterval(timer)
    }, [currencyToBuy])

    return [binancePrice, kucoinPrice, krakenPrice, bybitPrice, nextRefresh]
}