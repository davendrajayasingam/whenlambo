import { Metadata } from 'next'

import '@/app/globals.css'

import { Toaster } from 'react-hot-toast'

import Analytics from '@/utils/components/Analytics'
import Header from '@/app/header'
import Footer from '@/app/footer'

const metadataTitle = 'When Lambo?'
const metadataDescription = 'If you have USDT, it is cheaper to buy BTC and ETH on Binance, Kucoin, Kraken, or Bybit?'
const metadataKeywords = ['crypto', 'btc', 'eth']
const metadataAuthors = [{ name: 'Davendra Jayasingam', url: 'https://davendra.me' }]

export const metadata: Metadata = {
  metadataBase: new URL(`https://${process.env.NEXT_PUBLIC_DOMAIN_NAME!}`),
  title: {
    default: metadataTitle,
    template: `%s | ${metadataTitle}`
  },
  description: metadataDescription,
  openGraph: {
    title: {
      default: metadataTitle,
      template: `%s | ${metadataTitle}`
    },
    description: metadataDescription,
    url: `https://${process.env.NEXT_PUBLIC_DOMAIN_NAME}`,
    type: 'website',
    images: [
      {
        url: `https://${process.env.NEXT_PUBLIC_DOMAIN_NAME}/images/og-image.jpg`,
        width: 1200,
        height: 630
      }
    ]
  },
  keywords: metadataKeywords,
  authors: metadataAuthors,
  robots: 'index, follow',
  generator: 'Next.js',
  icons: {
    icon: '/images/favicon.png',
    apple: '/images/apple-icon.png'
  }
}

type Props = {
  children: React.ReactNode
}

export default function RootLayout({ children }: Props)
{
  return (
    <html
      lang='en'
      className='h-full bg-gray-900'
    >
      <head />
      <body className='font-sans h-full'>
        <Header />
        {children}
        <Footer />
        <Analytics />
        <Toaster />
      </body>
    </html>
  )
}