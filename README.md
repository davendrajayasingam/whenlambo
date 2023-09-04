## Demo

[https://www.whenlambo.my](https://www.whenlambo.my)

## Environment Variables
```
# Site
NEXT_PUBLIC_DOMAIN_NAME = <your domain name without https://>

# Analytics
NEXT_PUBLIC_FATHOM_ID = <omit>
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project: When Lambo?

Assume you have some USDT and you’d like to buy some BTC and ETH. You would like to know whether it is cheaper to buy on Binance, Kucoin, Kraken, or Bybit. Write a web app that displays the buy and sell prices of BTC and ETH (depending on which URL path we are on i.e. yourapp.com/btc or yourapp.com/eth), then display the name of the exchange of which it is cheapest to buy said coins.

You only have to choose 2 out of 4 of the exchanges (Binance, Kucoin, Kraken, or Bybit) for this task. To clarify, you are only looking at USDT denominated spot prices, not futures. Bonus points if your application updates the page and its verdict live according to every latest price change.
