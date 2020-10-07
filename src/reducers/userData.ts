import { TEXT_FILTER, ADD_MY_ORDER, MyOrdersListType } from '../constants/actionTypes'
import { TAB_USERDATA } from '../constants/tabData'
import { UserDataActions } from '../actions/userDataActions'

// export type MyOrderType = {
//   offerID: number,
//   timestamp: number,
//   pair: string,
//   type: number,
//   side: string,
//   price: BigNumber,
//   amount: BigNumber,
//   filled: BigNumber,
//   average: BigNumber,
//   total: BigNumber,
// }

export interface UserData {
  textFilter: string,
  orders: MyOrdersListType,
}

const initialState: UserData = {
  textFilter: '',
  orders: {},
}

const userDataReducer = (state:UserData = initialState, action:UserDataActions):UserData => {
  switch(action.type) {
    case TEXT_FILTER:
      if (action.payload.target === TAB_USERDATA)
        return { ...state, textFilter: action.payload.textFilter }
      else
        return state

    case ADD_MY_ORDER:
      const newState = { ...state, orders: { ...state.orders, [action.payload.offerID.toString()]: action.payload }}
      return newState
  }

  return state
}

export default userDataReducer
