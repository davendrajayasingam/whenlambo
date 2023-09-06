'use client'

import Link from 'next/link'

import { classNames } from '@/utils/helpers/tailwindHelper'
import useBinanceWebsocket from '@/utils/components/useBinanceWebsocket'
import useBybitWebsocket from '@/utils/components/useBybitWebsocket'
import useKrakenWebsocket from '@/utils/components/useKrakenWebsocket'
import useKucoinWebsocket from '@/utils/components/useKucoinWebsocket'

export default function BTCPage({ params }: { params: { currencyId: string } }) 
{
  const { currencyId } = params

  const sockets = [
    useBinanceWebsocket({ currencyToBuy: currencyId }),
    useBybitWebsocket({ currencyToBuy: currencyId }),
    useKrakenWebsocket({ currencyToBuy: currencyId }),
    useKucoinWebsocket({ currencyToBuy: currencyId })
  ]

  const getCheapestExchanges = (): SocketData[] =>
  {
    const exchanges = sockets
      .filter(socket => socket.status === 'connected')
      .filter(socket => socket.spot.askPrice !== 0)

    const lowestAsk = Math.min(...exchanges.map(socket => socket.spot.askPrice))
    if (lowestAsk === 0)
    {
      return []
    }

    return exchanges.filter(socket => socket.spot.askPrice === lowestAsk)
  }
  const cheapestExchanges = getCheapestExchanges()
  const cheapestExchangeNames = cheapestExchanges.map(socket => socket.spot.exchange).join(', or ')

  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  })

  const showPrice = (spotPrice: SpotPrice, status: ConnectionStatus) => (
    <div
      key={spotPrice.exchange}
      className={classNames(
        spotPrice.askPrice === cheapestExchanges?.[0]?.spot?.askPrice ? 'bg-emerald-500' : 'bg-rose-500',
        'w-full h-full py-2',
      )}
    >
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

      {/* Status */}
      <p className='p-2 pb-0 font-light text-center text-xs text-white/80 uppercase'>
        {status}
      </p>

    </div>
  )

  // Handle unsupported currencies
  if (currencyId.toLowerCase() !== 'btc' && currencyId.toLowerCase() !== 'eth')
  {
    return (
      <div className='p-6 w-full h-full max-w-xl mx-auto flex flex-col space-y-6'>
        <p className='font-semibold text-2xl text-rose-400 text-center'>
          {currencyId.toUpperCase()} currency is not supported. Use either BTC or ETH.
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
      {
        cheapestExchangeNames !== ''
        && <p className='font-bold text-4xl text-white/80 text-center'>
          on <span className='text-emerald-400'>{cheapestExchangeNames}</span>
        </p>
      }
    </div>

    <div className='grid grid-cols-2 gap-1 w-full'>
      {sockets.map(socket => showPrice(socket.spot, socket.status))}
    </div>

    <div className='pt-16 text-center'>
      <a
        href={`/${currencyId === 'btc' ? 'eth' : 'btc'}`}
        className={classNames(
          currencyId === 'btc' ? 'bg-ethereum' : 'bg-bitcoin',
          'rounded-xl p-4 font-bold text-xl text-white text-center hover:brightness-110 transition-all duration-300 ease-in-out',
        )}
      >
        Buy {currencyId === 'btc' ? 'ETH' : 'BTC'} instead
      </a>
    </div>

  </div>
}