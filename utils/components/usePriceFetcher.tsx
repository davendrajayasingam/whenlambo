import { useEffect, useState } from 'react'

type Props = {
    currencyToBuy: string
}

export default function usePriceFetcher({ currencyToBuy }: Props)
{
    const [binancePrice, setBinancePrice] = useState<number>(0)
    const [kucoinPrice, setKucoinPrice] = useState<number>(0)
    const [krakenPrice, setKrakenPrice] = useState<number>(0)
    const [bybitPrice, setBybitPrice] = useState<number>(0)

    // setup a timer to fetch and update prices every 5 seconds
    useEffect(() =>
    {
        if (currencyToBuy !== 'btc' && currencyToBuy !== 'eth')
        {
            return
        }

        const currency = currencyToBuy.toUpperCase()

        const fetchPrices = async () =>
        {
            await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${currency}USDT`, { cache: 'no-store' })
                .then(res => res.json())
                .then(data => setBinancePrice(parseFloat(data.price)))
                .catch(() => setBinancePrice(0))

            await fetch(`https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=${currency}-USDT`, { cache: 'no-store' })
                .then(res => res.json())
                .then(data => setKucoinPrice(parseFloat(data.data.price)))
                .catch(() => setKucoinPrice(0))

            await fetch(`https://api.kraken.com/0/public/Ticker?pair=${currency}USDT`, { cache: 'no-store' })
                .then(res => res.json())
                .then(data => setKrakenPrice(parseFloat(data.result[Object.keys(data.result)[0]].c[0])))
                .catch(() => setKrakenPrice(0))

            await fetch(`https://api.bybit.com/v2/public/tickers?symbol=${currency}USDT`, { cache: 'no-store' })
                .then(res => res.json())
                .then(data => setBybitPrice(parseFloat(data.result[0].last_price)))
                .catch(() => setBybitPrice(0))
        }
        fetchPrices()

        const timer = setInterval(fetchPrices, 5000)

        return () => clearInterval(timer)
    }, [currencyToBuy])

    return [binancePrice, kucoinPrice, krakenPrice, bybitPrice]
}