'use client'

import useCountdown from '@/utils/components/useCountdown'
import usePriceFetcher from '@/utils/components/usePriceFetcher'
import { classNames } from '@/utils/helpers/tailwindHelper'
import Link from 'next/link'

export default function BTCPage({ params }: { params: { currencyId: string } }) 
{
  const { currencyId } = params

  const [binancePrice, kucoinPrice, krakenPrice, bybitPrice, nextRefresh] = usePriceFetcher({ currencyToBuy: currencyId })
  const prices = [binancePrice, kucoinPrice, krakenPrice, bybitPrice]

  const secondsUntilRefresh = useCountdown({ targetTimeInMs: nextRefresh })

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
        on <span className='text-emerald-400'>
          {
            binancePrice === Math.min(...prices.filter(price => price !== 0))
              ? 'Binance'
              : kucoinPrice === Math.min(...prices.filter(price => price !== 0))
                ? 'Kucoin'
                : krakenPrice === Math.min(...prices.filter(price => price !== 0))
                  ? 'Kraken'
                  : bybitPrice === Math.min(...prices.filter(price => price !== 0))
                    ? 'Bybit'
                    : '...'
          }
        </span>
      </p>
    </div>

    <div className='grid grid-cols-2 gap-1 w-full'>
      {showPrice('Binance', binancePrice)}
      {showPrice('Kucoin', kucoinPrice)}
      {showPrice('Kraken', krakenPrice)}
      {showPrice('Bybit', bybitPrice)}
    </div>

    <p className='text-center'>
      {
        secondsUntilRefresh > 0
          ? <span className='text-white/50'>Updating in {secondsUntilRefresh}s</span>
          : <span className='text-emerald-400'>Updating prices ...</span>
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