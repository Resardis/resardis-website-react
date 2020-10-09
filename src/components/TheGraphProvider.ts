import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '../reducers'
import { ethers } from 'ethers'
import { isActive } from '../contracts'
import BigNumber from 'bignumber.js'
import { getMyOrders, getMyOrderTakes } from '../gqlQueries/UserData'
import { getTokenNameFromAddress } from '../constants/networks'
import { MyOrderType, AddMyOrderAction } from '../constants/actionTypes'
import { addMyOrder } from '../actions/userDataActions'

interface StateProps {
  accountAddress: string,
  api: any,
}

interface OwnProps {
  client: any,
}

const mapStateToProps = (state: RootState, ownProps: OwnProps):StateProps => ({
  accountAddress: state.funds.accountAddress,
  api: state.contract.contractAPI,
})

const mapDispatchToProps = (dispatch:any) => ({
  addMyOrder: (order:MyOrderType):AddMyOrderAction => dispatch(addMyOrder(order)),
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

type FullProps = PropsFromRedux & OwnProps

type MakeOrder = {
  offerID: number,
  maker: string,
  payGem: string,
  payAmt: BigNumber,
  buyGem: string,
  buyAmt: BigNumber,
  timestamp: number,
  offerType: number,
}

type TakeOrder = {
  offerID: number,
  payGem: string,
  giveAmt: BigNumber,
  buyGem: string,
  takeAmt: BigNumber,
}

const getAmountTaken = (data:any, amount:BigNumber, price:BigNumber):BigNumber => {
  let paid = new BigNumber(0)

  const taken:BigNumber = data.takes.reduce((paid:BigNumber, order:TakeOrder) => {

    const takeAmt = new BigNumber(order.takeAmt)
    const giveAmt = new BigNumber(order.giveAmt)

    if (giveAmt.div(takeAmt).eq(price)) {
      //console.log('price matches', price)
    } else {
      console.error('price DOES NOT MATCH', giveAmt.div(takeAmt), price)
      return null
    }

    if (order.buyGem === ethers.constants.AddressZero) {
      return paid.plus(takeAmt)
    } else {
      return paid.plus(giveAmt)
    }

  }, paid)

  return taken
}

interface Props {
  amount: BigNumber,
  price: BigNumber,
  offerID: number,
  client: any,
}

const filledAndTotal = ({ client, amount, price, offerID }:Props) => {
  return client.query({
    query: getMyOrderTakes(offerID),
    fetchPolicy: 'network-only',
  })
  .then((res:any) => {
    const amountTaken = getAmountTaken(res.data, amount, price)
    const filledPct:BigNumber = amountTaken.multipliedBy(100).div(amount)
    const average:BigNumber = amountTaken.div(res.data.takes.length)
    const total:BigNumber = amount.minus(amount.multipliedBy(filledPct.div(100)))

    return [filledPct, average, total]
  })
  .catch(console.error)
}

const TheGraphProvider = ({
  accountAddress,
  addMyOrder,
  client,
  api,
}: FullProps) => {

  if (!accountAddress) return null

  const observableQuery = client.watchQuery({ query: getMyOrders(accountAddress), pollInterval: 1000 })
  observableQuery.startPolling(1000)
  observableQuery.subscribe({ next: ({ data }: {data:any}) => {
    // TODO: batched updates, data.makes.map at a time, isActive&addMyOrder

    data.makes.map(async (order:MakeOrder) => {
      let side:string, pair:string, amount:BigNumber

      const tokenBuy = getTokenNameFromAddress(order.buyGem)
      const tokenSell = getTokenNameFromAddress(order.payGem)
      const buyAmt = new BigNumber(order.buyAmt)
      const payAmt = new BigNumber(order.payAmt)
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

      const type = order.offerType ? 'Market' : 'Limit'

      const [filled, average, total] = await filledAndTotal({ client, amount, price, offerID: order.offerID })

      // fire isActive check, which is going to update state in contract reducer
      isActive(api, order.offerID)

      //if (order.offerID > 152) console.log(`my new order: ${order.offerID} ${order.timestamp} buyAmt: ${buyAmt.toString()}, payAmt: ${payAmt.toString()}, amount: ${amount}`)

      addMyOrder({
        offerID: order.offerID,
        timestamp: order.timestamp,
        pair,
        type,
        side,
        price,
        amount,
        filled,
        average,
        total,
        fee: new BigNumber(0),
      })
    })
  }})

  return null
}

export default connector(TheGraphProvider)
