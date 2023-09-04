'use client'

import usePriceFetcher from '@/utils/components/usePriceFetcher'
import { classNames } from '@/utils/helpers/tailwindHelper'

export default function CurrencyPage({ params }: { params: { currencyId: string } }) 
{
  const { currencyId } = params

  const [exchangeRates, nextRefresh] = usePriceFetcher({ currencyToBuy: currencyId })

  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  })

  const PriceData = ({ data }: { data: ExchangeRate }) => (
    <div className={classNames(
      data.price === Math.min(...(exchangeRates as ExchangeRate[]).map(e => e.price).filter(price => data.price !== 0)) ? 'bg-emerald-500' : 'bg-rose-500',
      'p-4 w-full h-full aspect-video',
      'flex flex-col items-center justify-center space-y-2',
    )}>
      <p className='font-bold text-white/80 text-center text-lg'>
        {data.exchange}
      </p>
      <p className='font-bold text-white text-center text-2xl'>
        {
          data.price === 0
            ? 'N/A'
            : currencyFormatter.format(data.price)
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
      {(exchangeRates as ExchangeRate[]).map((exchangeRate: ExchangeRate) => (
        <PriceData
          key={exchangeRate.exchange}
          data={exchangeRate}
        />
      ))}
    </div>

  </div>
}