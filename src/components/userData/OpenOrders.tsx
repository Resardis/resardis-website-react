import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { wei2ether } from '../../helpers'
import { RootState } from '../../reducers'
import moment from 'moment'
import { cancelOrder } from '../../contracts'
import { MyOrderType, MyOrdersListType } from '../../constants/actionTypes'
import { sortingDirections, sortingTypes } from '../../constants/actionTypes'
import { sortAndFilter, ActiveOffers } from '.'
import { selectOrder } from '../../actions'
import shortid from 'shortid'

interface StateProps {
  accountAddress: string,
  api: any,
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
  api: state.contract.contractAPI,
  activeOffers: state.contract.activeOffers,
  orders: state.userData.orders,
  textFilter: state.userData.textFilter,
})

const mapDispatchToProps = (dispatch:any) => ({
  selectOrder: (order:MyOrderType) => dispatch(selectOrder(order)),
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & OwnProps

const OpenOrders = ({ orders, textFilter, activeOffers, sortBy, sortDirection, api, selectOrder }:Props) => {
  //if (Object.keys(activeOffers).length > 155) console.log('OpenOrders', activeOffers, sortBy, sortDirection)
  return <>
  {sortAndFilter(
    orders,
    textFilter,
    sortBy,
    sortDirection,
    activeOffers,
    'active'
  )
  .map((id:string) => {
    const { offerID, timestamp, pair, type, side, price, amount, filled, total } = orders[id]
    const DOMID = shortid()

    return (
      <tr key={id} onClick={() => selectOrder(orders[id])} style={{ cursor: 'pointer'}}>
        <td style={{ textAlign: 'left' }}>{moment.unix(timestamp).format("YYYY-MM-DD HH:mm")}</td>
        <td>{pair}</td>
        <td>{type}</td>
        <td style={{ color: side === 'Buy' ? '#D5002A' : '#00AA55'}}>{side}</td>
        <td>{price.toFixed(8)}</td>
        <td>{wei2ether(amount)}</td>
        <td key="filled">{filled.toFixed(3)}%</td>
        <td key="total">{wei2ether(total)}</td>
        <td>
          <button
            id={DOMID}
            className="cancel-button"
            onClick={() => {
              const buttonElement = document.getElementById(DOMID)
              if (buttonElement) buttonElement.innerHTML = 'cancelling...'
              cancelOrder(api, offerID, DOMID)
            }}
          >
            Cancel
          </button>
        </td>
      </tr>
    )
  })}
</>


}

export default connector(OpenOrders)
