import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'

type Props = {
    currencyToBuy: string
}

export default function usePriceFetcher({ currencyToBuy }: Props)
{
    const [prices, setPrices] = useState<ExchangeRate[]>([])
    const [nextRefresh, setNextRefresh] = useState<number>(0)

    // setup a timer to fetch and update prices every 5 seconds
    useEffect(() =>
    {
        if (currencyToBuy !== 'btc' && currencyToBuy !== 'eth')
        {
            return
        }

        const fetchPrices = () =>
        {
            axios.get(`/api/prices/${currencyToBuy.toLowerCase()}`)
                .then(response => setPrices(response.data))
                .catch(error => toast.error('Failed to fetch prices. Trying again...'))
                .finally(() => setNextRefresh(Date.now() + 10000))
        }
        fetchPrices()

        const timer = setInterval(fetchPrices, 10000)

        return () => clearInterval(timer)
    }, [currencyToBuy])

    return [prices, nextRefresh]
}