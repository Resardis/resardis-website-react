import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { wei2ether } from '../../helpers'
import { RootState } from '../../reducers'
import moment from 'moment'
import { MyOrdersListType } from '../../constants/actionTypes'
import { sortingDirections, sortingTypes } from '../../constants/actionTypes'
import { sortAndFilter, ActiveOffers } from '.'

interface StateProps {
  accountAddress: string,
  activeOffers: ActiveOffers,
  orders: MyOrdersListType,
  textFilter: string,
}

interface OwnProps {
  sortBy:sortingTypes,
  sortDirection:sortingDirections,
}

const mapStateToProps = (state: RootState):StateProps => ({
  accountAddress: state.funds.accountAddress,
  activeOffers: state.contract.activeOffers,
  orders: state.userData.orders,
  textFilter: state.userData.textFilter,
})

const connector = connect(mapStateToProps)

export type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & OwnProps

const OrderHistory = (props:Props) => {
  return <>
  {sortAndFilter(
    props.orders,
    props.textFilter,
    props.sortBy,
    props.sortDirection,
    props.activeOffers,
    'closed',
  ).map((id:string) => {
    const { timestamp, pair, type, side, price, filled, average, total } = props.orders[id]

    return (
      <tr key={id}>
        <td style={{ textAlign: 'left' }}>{moment.unix(timestamp).format("YYYY-MM-DD HH:mm")}</td>
        <td>{pair}</td>
        <td>{type}</td>
        <td style={{ color: side === 'Buy' ? '#D5002A' : '#00AA55'}}>{side}</td>
        <td>{wei2ether(average)}</td>
        <td>{wei2ether(price)}</td>
        <td key="filled">{filled.toFixed(3)}%</td>
        <td key="total">{wei2ether(total)}</td>
        <td>{filled.eq(100) ? 'Fulfilled' : 'Cancelled'}</td>
      </tr>
    )
  })}
  </>
}

export default connector(OrderHistory)
