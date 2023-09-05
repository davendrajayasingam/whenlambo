'use client'

import Link from 'next/link'
import { FaSpinner } from 'react-icons/fa6'

import useCountdown from '@/utils/components/useCountdown'
import usePriceFetcher from '@/utils/components/usePriceFetcher'
import { classNames } from '@/utils/helpers/tailwindHelper'

export default function BTCPage({ params }: { params: { currencyId: string } }) 
{
  const { currencyId } = params

  const results = usePriceFetcher({ currencyToBuy: currencyId })

  const secondsUntilUpdate = useCountdown({ targetTimeInMs: results.nextUpdate })

  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  })

  const showPrice = (spotPrice: SpotPrice) => (
    <div className={classNames(
      spotPrice.askPrice === results.bestExchange.askPrice ? 'bg-emerald-500' : 'bg-rose-500',
      'w-full h-full py-2',
    )}>
      <p className='p-2 pb-0 font-bold text-white/80 text-center text-lg'>
        {spotPrice.exchange}
      </p>
      <div className='grid sm:grid-cols-2 place-items-center p-2 gap-2'>
        <div>
          <p className='font-bold text-white/80 text-center'>
            Bid
          </p>
          <p className='font-bold text-white text-center text-lg'>
            {
              spotPrice.bidPrice === 0
                ? 'N/A'
                : currencyFormatter.format(spotPrice.bidPrice)
            }
          </p>
        </div>
        <div>
          <p className='font-bold text-white/80 text-center'>
            Ask
          </p>
          <p className='font-bold text-white text-center text-lg'>
            {
              spotPrice.askPrice === 0
                ? 'N/A'
                : currencyFormatter.format(spotPrice.askPrice)
            }
          </p>
        </div>
      </div>
    </div>
  )

  if (currencyId !== 'btc' && currencyId !== 'eth')
  {
    return (
      <div className='p-6 w-full h-full max-w-xl mx-auto flex flex-col space-y-6'>
        <p className='font-semibold text-2xl text-rose-400 text-center'>
          {currencyId.toUpperCase()} is not supported.
        </p>
      </div>
    )
  }

  return <div className='p-6 w-full h-full max-w-xl mx-auto flex flex-col space-y-6'>

    <div>
      <p className='font-semibold text-2xl text-white/80 text-center'>
        Trade your <span className='font-bold'>USDT</span> for <span className={classNames(
          'font-bold',
          currencyId === 'btc' ? 'text-bitcoin' : 'text-ethereum'
        )}>
          {`${currencyId}`.toUpperCase()}
        </span>
      </p>
      <p className='font-bold text-4xl text-white/80 text-center'>
        on <span className='text-emerald-400'>{results.bestExchange.exchange}</span>
      </p>
    </div>

    <div className='grid grid-cols-2 gap-1 w-full'>
      {results.prices.map(showPrice)}
    </div>

    <p className='text-center'>
      {
        secondsUntilUpdate > 0
          ? <span className='text-white/50'>Updating in {secondsUntilUpdate}s</span>
          : <span className='text-emerald-400 flex items-center justify-center space-x-1'><FaSpinner className='animate-spin' /> <span>Updating prices ...</span></span>
      }
    </p>

    <div className='pt-16 text-center'>
      <Link
        href={`/${currencyId === 'btc' ? 'eth' : 'btc'}`}
        className={classNames(
          currencyId === 'btc' ? 'bg-ethereum' : 'bg-bitcoin',
          'rounded-xl p-4 font-bold text-xl text-white text-center hover:brightness-110 transition-all duration-300 ease-in-out',
        )}
      >
        Buy {currencyId === 'btc' ? 'ETH' : 'BTC'} instead
      </Link>
    </div>

  </div>
}