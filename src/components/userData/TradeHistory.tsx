import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { wei2ether } from '../../helpers'
import { RootState } from '../../reducers'
import { useQuery } from '@apollo/client'
import { getTokenNameFromAddress } from '../../constants/networks'
import moment from 'moment'
import { ethers } from 'ethers'
import { BigNumber } from 'bignumber.js'
import { getMyTrades } from '../../gqlQueries/UserData'
import shortid from 'shortid'
import { Loading, Error } from '.'
import { sortingDirections, sortingTypes, MyOrderType, MyOrdersListType } from '../../constants/actionTypes'
import { sortAndFilter, ActiveOffers } from '.'

interface StateProps {
  accountAddress: string,
  textFilter: string,
}

interface OwnProps {
  sortBy:sortingTypes,
  sortDirection:sortingDirections,
}

const mapStateToProps = (state: RootState):StateProps => ({
  accountAddress: state.funds.accountAddress,
  textFilter: state.userData.textFilter,
})

const connector = connect(mapStateToProps)

export type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & OwnProps

type MakeOrder = {
  __typename: string,
  id: string,
  payGem: string,
  payAmt: BigNumber,
  buyGem: string,
  buyAmt: BigNumber,
  timestamp: number,
}

type TakeOrder = {
  __typename: string,
  id: string,
  payGem: string,
  giveAmt: BigNumber,
  buyGem: string,
  takeAmt: BigNumber,
  timestamp: number,
}

const processTradeItem = (order:any):MyOrderType => {
  let side:string, pair:string, amount:BigNumber, buyAmt:BigNumber, payAmt:BigNumber, type:string

  const tokenBuy = getTokenNameFromAddress(order.buyGem)
  const tokenSell = getTokenNameFromAddress(order.payGem)

  if (order.__typename === 'Make') {
    type = 'Maker'
    buyAmt = new BigNumber(order.buyAmt)
    payAmt = new BigNumber(order.payAmt)
  } else {
    type = 'Taker'
    buyAmt = new BigNumber(order.takeAmt)
    payAmt = new BigNumber(order.giveAmt)
  }
  const price:BigNumber = buyAmt.div(payAmt)

  if (order.buyGem === ethers.constants.AddressZero) {
    side = 'Sell'
    pair = `${tokenSell}/${tokenBuy}`
    amount = payAmt
  } else {
    side = 'Buy'
    pair = `${tokenBuy}/${tokenSell}`
    amount = buyAmt
  }

  //  date, pair, type, side, avg, price, amount, fee
  return {
    timestamp: order.timestamp,
    pair,
    type,
    side,
    average: new BigNumber(0),
    price,
    amount,
    fee: new BigNumber(0),
    // to keep the type happy
    offerID: 0,
    filled: new BigNumber(0),
    total: new BigNumber(0),
  }
}

const TradeHistory = (props:Props) => {
  // 0x4bf1159e9e68fd04095abe902d6f55b220dffacb has some orders
  const address = props.accountAddress
  const { loading, error, data } = useQuery(getMyTrades(address), { pollInterval: 1000 })

  if (loading) return <Loading />
  if (error) return <Error error={error} />

  const tradeData:MyOrdersListType = {}
  const activeOffers:ActiveOffers = {}

  data.makes.forEach((order:MakeOrder) => {
    tradeData[order.id] = processTradeItem(order)
  })

  data.takes.forEach((order:TakeOrder) => {
    tradeData[order.id] = processTradeItem(order)
  })

  return (
    <>
      {sortAndFilter(
        tradeData,
        props.textFilter,
        props.sortBy,
        props.sortDirection,
        activeOffers,
        'all'
      )
      .map((id:string) => {
        const { timestamp, pair, type, side, average, price, amount, fee } = tradeData[id]
        return (
          <tr key={shortid()}>
            <td style={{ textAlign: 'left' }}>{moment.unix(timestamp).format("YYYY-MM-DD HH:mm")}</td>
            <td>{pair}</td>
            <td>{type}</td>
            <td style={{ color: side === 'Buy' ? '#D5002A' : '#00AA55'}}>{side}</td>
            <td>{wei2ether(average)}</td>
            <td>{price.toFixed(8)}</td>
            <td>{wei2ether(amount)}</td>
            <td>{wei2ether(fee)}</td>
          </tr>
        )
      })}
    </>
  )
}

export default connector(TradeHistory)
