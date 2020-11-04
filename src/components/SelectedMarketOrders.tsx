import React from 'react'
import { ReactComponent as ArrowUp } from '../svg/arrow-up.svg'
import { ReactComponent as ArrowDown } from '../svg/arrow-down.svg'
import { useQuery } from '@apollo/client'
import { BigNumber } from 'bignumber.js'
import { wei2ether } from '../helpers'
import { getPairMakesBuys, getPairMakesSells, getTrades } from '../gqlQueries/SelectedMarket'
import { ethers } from 'ethers'
import { Network } from '../constants/networks'
import { TradeType } from '../constants/marketTypes'

interface OrdersHeaderProps {
  baseCurrency: string,
  quoteCurrency: string,
}

interface OrdersProps {
  selectedCurrencyPair: string,
  network: Network,
}

type OrderType = Array<BigNumber>

const OrdersHeader = ({ baseCurrency, quoteCurrency }:OrdersHeaderProps) => (
  <thead>
    <tr>
      <th scope="col">Price</th>
      <th scope="col">Amount({baseCurrency})</th>
      <th scope="col">Total({quoteCurrency})</th>
    </tr>
  </thead>
)

type ColorTheme = { [key:string]: Array<[string, string, string]> }
const colorThemes:ColorTheme = {
  red: [
    [ '#B52F39', '#833A40', '#454849' ],
    [ '#B7323C', '#8F474D', '#5D6162'],
  ],
  green: [
    [ '#1A9150', '#2D704C', '#454849' ],
    [ '#1D9452', '#397D59', '#5D6162' ],
],
}

const orderRowBackgroudColor = (order:OrderType, total: BigNumber, totalSoFar:BigNumber, rowIndex:number, theme:string) => {
  const colors = colorThemes[theme][rowIndex%2]
  // [total / order[0]]  [total / order[1]]
  const part = order[2].div(total).multipliedBy(100).toNumber()
  const sum = totalSoFar.div(total).multipliedBy(100).toNumber()
  //console.log(part, sum, order[2].toString(), totalSoFar.toString(), total)

  return {
    background: `linear-gradient(90deg, ${colors[0]} ${part}%, ${colors[1]} ${part}%, ${colors[1]} ${sum}%, ${colors[2]} ${sum}%`
  }
}

type OrdersData = { [key:string]: OrderType }

interface OrderRowProps {
  order: OrderType,
  color: string,
  total: BigNumber,
  totalSoFar: BigNumber,
  rowIndex: number,
}
const OrderRow = ({ order, total, totalSoFar, rowIndex, color }:OrderRowProps) => (
  <tr style={orderRowBackgroudColor(order, total, totalSoFar, rowIndex, color)}>
    <td style={{ textAlign: 'left' }}>{wei2ether(order[0], 18)}</td>
    <td>{wei2ether(order[1])}</td>
    <td>{wei2ether(totalSoFar)}</td>
  </tr>
)

interface OrdersTableProps {
  orders: OrdersData,
  total: BigNumber,
}

const SellOrdersTable = ({ orders, total }:OrdersTableProps) => {
  let totalSoFar:BigNumber = total

  return (
    <tbody>
      {Object.keys(orders)
      .sort((a, b) => orders[a][0].gt(orders[b][0]) ? 1 : -1)
      .map((priceIndex, rowIndex) => {
        const order = orders[priceIndex]
        totalSoFar = totalSoFar.minus(order[2])
        return <OrderRow key={priceIndex} order={order} total={total} totalSoFar={totalSoFar} rowIndex={rowIndex} color="red" />
      })}
    </tbody>
)}

const BuyOrdersTable = ({ orders, total }:OrdersTableProps) => {
  let totalSoFar:BigNumber = new BigNumber(0)

  return (
    <tbody>
      {Object.keys(orders)
      .sort((a, b) => orders[a][0].gt(orders[b][0]) ? -1 : 1)
      .map((priceIndex, rowIndex) => {
        const order = orders[priceIndex]
        totalSoFar = totalSoFar.plus(order[2])
        return <OrderRow key={priceIndex} order={order} total={total} totalSoFar={totalSoFar} rowIndex={rowIndex} color="green" />
      })}
    </tbody>
)}

const NoOrdersTable = () => (
    <tbody>
      <tr className="text-center text-capitalize">
        <td colSpan={3}>no orders found</td>
      </tr>
    </tbody>
)

const getPrice = (trade:TradeType) => {
  const buyAmt = new BigNumber(trade.buyAmt)
  const payAmt = new BigNumber(trade.payAmt)

  if (trade.buyGem === ethers.constants.AddressZero) return buyAmt.div(payAmt)
  return payAmt.div(buyAmt)
}

interface LastTradePriceProps {
  selectedCurrencyPair: string,
  network: Network,
}
const LastTradePrice = ({ network, selectedCurrencyPair }:LastTradePriceProps) => {
  let lastPrice:BigNumber = new BigNumber(0)
  let nextToLastPrice:BigNumber = new BigNumber(0)

  let { loading, error, data } = useQuery(getTrades(selectedCurrencyPair, network), { pollInterval: 1000 })

  if (loading) return <span>Loading...</span>
  if (error) {
    console.log(error.message)
    return <span>Error!</span>
  }

  data.trades.forEach((trade:TradeType) => {
    // TODO: move this to TheGraphProvider and make it sane
    if (nextToLastPrice.gt(0)) return
    if (lastPrice.eq(0)) {
      lastPrice = getPrice(trade)
    } else {
      if (nextToLastPrice.eq(0)) {
        nextToLastPrice = getPrice(trade)
      }
    }
  })

  if (nextToLastPrice.eq(0) || lastPrice.eq(nextToLastPrice)) return (
    <div className="orders-price-change-indicator py-2">
      0.0000000
    </div>
  )

  if (lastPrice.gt(nextToLastPrice)) return (
    <div className="orders-price-change-indicator py-2 green">
      {wei2ether(lastPrice.minus(nextToLastPrice), 18)} <ArrowUp fill="#169A51" />
    </div>
  )

  return (
    <div className="orders-price-change-indicator py-2 red">
      {wei2ether(nextToLastPrice.minus(lastPrice), 18)} <ArrowDown fill="#C22D38" />
    </div>
  )
}

const processOrders = (data:any) => {
  const orders:OrdersData = {}
  let total:BigNumber = new BigNumber(0)
  let price:BigNumber
  let priceIndex:string
  let amtX:BigNumber
  let amtY:BigNumber

  data.makes.forEach((order:any) => {
    if (order.buyGem === ethers.constants.AddressZero) {
      amtX = new BigNumber(order.buyAmt)
      amtY = new BigNumber(order.payAmt)
    } else {
      amtY = new BigNumber(order.buyAmt)
      amtX = new BigNumber(order.payAmt)
    }

    // [ price, amount, part of total sum ]
    price = amtX.div(amtY)
    total = total.plus(amtX)
    priceIndex = price.toString()

    if (priceIndex in orders) {
      orders[priceIndex][1] = orders[priceIndex][1].plus(amtY)
      orders[priceIndex][2] = orders[priceIndex][2].plus(amtX)
    } else {
      orders[priceIndex] = [price, amtY, amtX, order.offerID]
    }
  })

  return { orders, total }
}

const Orders = ({
  selectedCurrencyPair,
  network,
}:OrdersProps) => {
  const [ baseCurrency, quoteCurrency ] = selectedCurrencyPair.split('/')

  let { loading:l1, error:e1, data:d1 } = useQuery(getPairMakesSells(selectedCurrencyPair, network), { pollInterval: 1000 })
  let { loading:l2, error:e2, data:d2 } = useQuery(getPairMakesBuys(selectedCurrencyPair, network), { pollInterval: 1000 })

  if (l1 || l2) return <span>Loading...</span>
  if (e1 || e2) {
    console.log(e1 ? e1.message : e2 ? e2.message : '')
    return <span>Error!</span>
  }

  const { orders:sellOrders, total:totalSell } = processOrders(d1)
  const { orders:buyOrders, total:totalBuy } = processOrders(d2)

  return <>
    <div className="orderbook orderbook-sell-orders">
      <table className="table table-borderless table-dark table-striped table-hover table-sm">
        <OrdersHeader baseCurrency={baseCurrency} quoteCurrency={quoteCurrency} />
          {Object.keys(sellOrders).length ? (
            <SellOrdersTable orders={sellOrders} total={totalSell} />
          ) : (
            <NoOrdersTable />
          )}
      </table>
    </div>

    <LastTradePrice network={network} selectedCurrencyPair={selectedCurrencyPair} />

    <div className="orderbook orderbook-buy-orders">
      <table className="table table-borderless table-dark table-striped table-hover table-sm">
        {Object.keys(buyOrders).length ? (
          <BuyOrdersTable orders={buyOrders} total={totalBuy} />
        ) : (
          <NoOrdersTable />
        )}
        <OrdersHeader baseCurrency={baseCurrency} quoteCurrency={quoteCurrency} />
      </table>
    </div>
  </>
}

export default Orders