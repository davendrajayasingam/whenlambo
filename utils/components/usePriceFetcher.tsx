import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'

type Props = {
    currencyToBuy: string
}

const intervalInMs = 10000 // update the data every 10 seconds

export default function usePriceFetcher({ currencyToBuy }: Props)
{
    const currency = currencyToBuy.toUpperCase()

    const [binancePrice, setBinancePrice] = useState<SpotPrice>({
        exchange: 'Binance',
        currency,
        bidPrice: 0,
        askPrice: 0
    })
    const [kucoinPrice, setKucoinPrice] = useState<SpotPrice>({
        exchange: 'Kucoin',
        currency,
        bidPrice: 0,
        askPrice: 0
    })
    const [krakenPrice, setKrakenPrice] = useState<SpotPrice>({
        exchange: 'Kraken',
        currency,
        bidPrice: 0,
        askPrice: 0
    })
    const [bybitPrice, setBybitPrice] = useState<SpotPrice>({
        exchange: 'Bybit',
        currency,
        bidPrice: 0,
        askPrice: 0
    })
    const [nextUpdate, setNextUpdate] = useState<number>(0)

    const defaultBestExchange = {
        exchange: 'N/A',
        currency,
        bidPrice: 0,
        askPrice: 0
    }
    const [bestExchange, setBestExchange] = useState<SpotPrice>(defaultBestExchange)

    // setup a timer to fetch and update prices every {x} seconds
    useEffect(() =>
    {
        if (currency !== 'BTC' && currency !== 'ETH')
        {
            return
        }

        const headers = {
            headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        }

        const fetchPrices = async () =>
        {
            await Promise.all([
                // Binance
                axios.get(`/api/binance/${currencyToBuy.toLowerCase()}`, headers)
                    .then(response => setBinancePrice(response.data))
                    .catch(() => toast.error('Failed to fetch Binance price')), ,
                // Kucoin has a cors issue, so we use our own api gateway to get the price
                axios.get(`/api/kucoin/${currencyToBuy.toLowerCase()}`, headers)
                    .then(response => setKucoinPrice(response.data))
                    .catch(() => toast.error('Failed to fetch Kucoin price')),
                // Kraken
                axios.get(`/api/kraken/${currencyToBuy.toLowerCase()}`, headers)
                    .then(response => setKrakenPrice(response.data))
                    .catch(() => toast.error('Failed to fetch Kraken price')),
                // Bybit
                axios.get(`/api/bybit/${currencyToBuy.toLowerCase()}`, headers)
                    .then(response => setBybitPrice(response.data))
                    .catch(() => toast.error('Failed to fetch Bybit price'))
            ])
                .catch(() => toast.error('Failed to fetch prices.'))
                .finally(() => setNextUpdate(Date.now() + intervalInMs))
        }
        fetchPrices()

        const timer = setInterval(fetchPrices, intervalInMs)
        return () => clearInterval(timer)
    }, [currencyToBuy])

    useEffect(() =>
    {
        const bestAsk = Math.min(...[binancePrice.askPrice, kucoinPrice.askPrice, krakenPrice.askPrice, bybitPrice.askPrice].filter(price => price !== 0))
        setBestExchange([binancePrice, kucoinPrice, krakenPrice, bybitPrice].find(price => price.askPrice === bestAsk) || defaultBestExchange)
    }, [binancePrice, kucoinPrice, krakenPrice, bybitPrice])

    return {
        prices: [binancePrice, kucoinPrice, krakenPrice, bybitPrice],
        nextUpdate,
        bestExchange
    } as SpotPricesResponse
}