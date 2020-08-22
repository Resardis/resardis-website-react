import { SORT_BY, SORT_DIRECTION, TEXT_FILTER, sortingTypes, sortingDirections, SELECT_CURRENCY_PAIR } from '../constants/actionTypes'
import { TableActions } from '../actions'
import { TAB_MARKETS } from '../constants/tabData'

export type MarketData = Array<[string, number, number, number]>
export type OrdersData = Array<[number, number, number]>

export interface Markets {
  sortBy: sortingTypes,
  sortDirection: sortingDirections,
  textFilter: string,
  selectedCurrencyPair: string,
  dataETH: MarketData,
  dataUSDT: MarketData,
  ordersData: OrdersData,
}

const initialState: Markets = {
  sortBy: sortingTypes.NO_SORT,
  sortDirection: sortingDirections.SORT_ASC,
  textFilter: '',
  selectedCurrencyPair: 'USDT/ETH',
  dataETH: [
    ['USDT/ETH', 1.0, 0.3300, 0.0000],
    ['LEND/ETH', 0.1, 0.0000, 0.0000],
    ['RSD/ETH', -2.0, 0.0000, 0.0550],
    ['LINK/ETH', 0.0, 0.0550, 0.0000],
    ['MKR/ETH', 0.0, 0.0000, 0.0000],
    ['BAT/ETH', 0.3, 0.0000, 0.0000],
    ['LEND/ETH', 0.0, 0.0000, 0.0000],
    ['USDT/ETH', 5.0, 0.0000, 0.0000],
    ['LEND/ETH', 0.0, 0.0000, 0.0000],
    ['RSD/ETH', 0.0, 0.0000, 0.0000],
    ['LINK/ETH', 0.0, 0.0000, 0.0000],
    ['MKR/ETH', 3.0, 0.0000, 0.3000],
    ['BAT/ETH', 3.3, 0.0000, 0.0000],
    ['LEND/ETH', -0.0, 0.0000, 0.5550],
    ['USDT/ETH', 0.0, 0.0000, 7.0000],
    ['LEND/ETH', 0.0, 0.7000, 0.0000],
    ['RSD/ETH', 0.0, 0.0000, 0.0000],
    ['LINK/ETH', 0.0, 8.0000, 0.0000],
    ['MKR/ETH', 0.0, 0.0000, 0.0000],
    ['BAT/ETH', 0.0, 0.0000, 0.0000],
    ['LEND/ETH', -10.0, 0.0000, 0.0000],
    ['USDT/ETH', 0.0, 0.0000, 0.0000],
    ['LEND/ETH', 0.0, 0.0000, 0.0000],
    ['RSD/ETH', 0.0, 0.0000, 0.0000],
    ['LINK/ETH', 0.0, 0.0000, 0.0000],
    ['MKR/ETH', 0.0, 0.0000, 0.0000],
    ['BAT/ETH', 0.0, 0.0000, 0.0000],
    ['LEND/ETH', 0.0, 0.0000, 0.0000],
    ['USDT/ETH', 0.0, 0.0000, 0.0000],
    ['LEND/ETH', 0.0, 0.0000, 0.0000],
    ['RSD/ETH', 0.0, 0.0000, 0.0000],
    ['LINK/ETH', 0.0, 0.0000, 0.0000],
    ['MKR/ETH', 0.0, 0.0000, 0.0000],
  ],
  dataUSDT: [
    ['ETH/USDT', 1.2, 0.3300, 0.0000],
    ['LEND/USDT', 2.1, 0.0000, 0.0000],
    ['RSD/USDT', 2.0, 0.0000, 0.0550],
    ['LINK/USDT', 0.0, 0.0550, 0.0000],
    ['MKR/USDT', 0.4, 0.0040, 0.0000],
    ['BAT/USDT', 0.3, 0.0000, 0.0000],
    ['LEND/USDT', 0.0, 4.0000, 0.0000],
    ['USDT/USDT', 5.0, 0.0000, 0.0000],
    ['LEND/USDT', 0.0, 0.0000, 0.0000],
    ['RSD/USDT', 0.0, 0.0000, 0.0000],
    ['LINK/USDT', 0.0, 5.0000, 0.0000],
    ['MKR/USDT', 3.0, 0.0000, 0.3000],
    ['BAT/USDT', 3.3, 0.0000, 0.0000],
    ['LEND/USDT', 0.0, 0.0000, 0.5550],
    ['USDT/USDT', 0.0, 0.0000, 7.0000],
    ['LEND/USDT', 0.0, 0.7000, 0.0000],
    ['RSD/USDT', 0.0, 0.0000, 0.0000],
    ['LINK/USDT', 0.0, 8.0000, 0.0000],
    ['MKR/USDT', 0.0, 0.0000, 0.0000],
    ['BAT/USDT', 0.0, 0.0000, 0.0000],
    ['LEND/USDT', 0.0, 0.0000, 0.0000],
    ['USDT/USDT', 0.0, 0.0000, 0.0000],
    ['LEND/USDT', 0.0, 0.0000, 0.0000],
    ['RSD/USDT', 0.0, 0.0000, 0.0000],
    ['LINK/USDT', 0.0, 0.0000, 0.0000],
    ['MKR/USDT', 0.0, 0.0000, 0.0000],
    ['BAT/USDT', 0.0, 0.0000, 0.0000],
    ['LEND/USDT', 0.0, 0.0000, 0.0000],
    ['USDT/USDT', 0.0, 0.0000, 0.0000],
    ['LEND/USDT', 0.0, 0.0000, 0.0000],
    ['RSD/USDT', 0.0, 0.0000, 0.0000],
    ['LINK/USDT', 0.0, 0.0000, 0.0000],
    ['MKR/USDT', 0.0, 0.0000, 0.0000],
  ],
  ordersData: [
    [0.0000, 0.0000, 0.0000],
    [0.0000, 0.0000, 0.0000],
    [0.0000, 0.0000, 0.0000],
    [0.0000, 0.0000, 0.0000],
    [0.0000, 0.0000, 0.0000],
    [0.0000, 0.0000, 0.0000],
    [0.0000, 0.0000, 0.0000],
    [0.0000, 0.0000, 0.0000],
    [0.0000, 0.0000, 0.0000],
    [0.0000, 0.0000, 0.0000],
    [0.0000, 0.0000, 0.0000],
    [0.0000, 0.0000, 0.0000],
    [0.0000, 0.0000, 0.0000],
    [0.0000, 0.0000, 0.0000],
    [0.0000, 0.0000, 0.0000],
    [0.0000, 0.0000, 0.0000],
    [0.0000, 0.0000, 0.0000],
    [0.0000, 0.0000, 0.0000],
    [0.0000, 0.0000, 0.0000],
    [0.0000, 0.0000, 0.0000],
    [0.0000, 0.0000, 0.0000],
    [0.0000, 0.0000, 0.0000],
    [0.0000, 0.0000, 0.0000],
    [0.0000, 0.0000, 0.0000],
    [0.0000, 0.0000, 0.0000],
  ],
}

const marketsReducer = (state:Markets = initialState, action:TableActions):Markets => {
  switch(action.type) {
    case SORT_BY:
      return { ...state, sortBy: action.payload }
    case SORT_DIRECTION:

      return {
        ...state,
        sortDirection: state.sortDirection === sortingDirections.SORT_ASC
        ? sortingDirections.SORT_DESC
        : sortingDirections.SORT_ASC
      }
    case TEXT_FILTER:
      if (action.payload.target === TAB_MARKETS)
        return { ...state, textFilter: action.payload.textFilter }
      else
        return state
    case SELECT_CURRENCY_PAIR:
      console.log(action)
      return { ...state, selectedCurrencyPair: action.payload }
    default:
      return state
  }
}

export default marketsReducer
