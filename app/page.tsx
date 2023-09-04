import Link from 'next/link'

export default async function HomePage() 
{
  return <div className='p-6 flex flex-col items-center justify-center h-full space-y-8 max-w-screen-sm mx-auto'>

    <p className='font-semibold text-2xl text-white/80 text-center'>
      What would you like to buy with USDT?
    </p>

    <div className='grid grid-cols-1 sm:grid-cols-2 gap-8 w-full'>

      <Link
        href='/btc'
        className='bg-bitcoin rounded-xl p-4 font-bold text-xl text-white text-center hover:brightness-110 transition-all duration-300 ease-in-out'
      >
        Bitcoin (BTC)
      </Link>

      <Link
        href='/eth'
        className='bg-ethereum rounded-xl p-4 font-bold text-xl text-white text-center hover:brightness-110 transition-all duration-300 ease-in-out'
      >
        Ethereum (ETH)
      </Link>

    </div>

  </div>
}