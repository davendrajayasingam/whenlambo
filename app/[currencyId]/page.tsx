'use client'

import usePriceFetcher from '@/utils/components/usePriceFetcher'
import { classNames } from '@/utils/helpers/tailwindHelper'

export default function BTCPage({ params }: { params: { currencyId: string } }) 
{
  const { currencyId } = params

  const prices = usePriceFetcher({ currencyToBuy: currencyId })
  const [binancePrice, kucoinPrice, krakenPrice, bybitPrice] = prices

  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  })

  const showPrice = (exchange: Exchange, price: number) => (
    <div className={classNames(
      price === Math.min(...prices.filter(price => price !== 0)) ? 'bg-emerald-500' : 'bg-rose-500',
      'p-4 w-full h-full aspect-video',
      'flex flex-col items-center justify-center space-y-2',
    )}>
      <p className='font-bold text-white/80 text-center text-lg'>
        {exchange}
      </p>
      <p className='font-bold text-white text-center text-2xl'>
        {
          price === 0
            ? 'N/A'
            : currencyFormatter.format(price)
        }
      </p>
    </div>
  )

  if (currencyId !== 'btc' && currencyId !== 'eth')
  {
    return (
      <div className='p-6 w-full h-full max-w-lg mx-auto flex flex-col space-y-6'>
        <p className='font-semibold text-2xl text-rose-400 text-center'>
          {currencyId.toUpperCase()} is not supported.
        </p>
      </div>
    )
  }

  return <div className='p-6 w-full h-full max-w-lg mx-auto flex flex-col space-y-6'>

    <p className='font-semibold text-2xl text-white/80 text-center'>
      Trade your USDT for {`${currencyId}`.toUpperCase()}!
    </p>

    <div className='grid grid-cols-2 gap-1 w-full'>
      {showPrice('Binance', binancePrice)}
      {showPrice('Kucoin', kucoinPrice)}
      {showPrice('Kraken', krakenPrice)}
      {showPrice('Bybit', bybitPrice)}
    </div>

  </div>
}