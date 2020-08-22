import { TEXT_FILTER } from '../constants/actionTypes'
import { TableActions } from '../actions'
import {
  TAB_USERDATA,
  TAB_USERDATA_OPEN_ORDERS,
  TAB_USERDATA_ORDER_HISTORY,
  TAB_USERDATA_FUNDS,
  TAB_USERDATA_TRADE_HISTORY,
} from '../constants/tabData'

export type UserDataType = Array<number | string>

export interface UserData {
  textFilter: string,
  data: {
    [key:string]: Array<UserDataType>
  }
}

const initialState: UserData = {
  textFilter: '',
  data: {
    [TAB_USERDATA_OPEN_ORDERS]: [
      ['27/10/19 12:00', 'SDJ/ETH','Market','Sell',0.0000,0.0000,1,0.0000],
      ['27/11/19 12:01', 'ASD/ETH','Limit','Buy',0.0000,0.0000,2,0.1000],
      ['27/11/19 12:02', 'SJ/ETH','Market','Sell',0.0000,0.0000,3,0.0020],
      ['27/11/19 12:03', 'SDJ/ETH','Market','Sell',0.0000,0.0000,4,0.0000],
      ['27/11/13 12:00', 'SDJ/ETH','Market','Sell',0.0000,0.0000,1,20.0000],
      ['27/11/14 12:00', 'SDJ/ETH','Market','Sell',0.0000,0.0000,1,0.0000],
      ['27/11/15 12:00', 'SDJ/ETH','Market','Sell',0.0000,0.0000,1,0.0000],
      ['26/11/19 12:00', 'SDJ/ETH','Market','Sell',0.0000,0.0000,1,0.0000],
      ['21/11/19 12:00', 'SDJ/ETH','Market','Sell',0.0000,0.0000,1,0.0000],
    ],
    [TAB_USERDATA_ORDER_HISTORY]: [
      ['27/11/19 12:00', 'SDJ/ETH','Market','Sell',0.0000,0.0000,0.0000,0.0000,'Filled'],
    ],
    [TAB_USERDATA_FUNDS]: [
      ['BAT - Basic Attention Token',0.0000,0.0000,0.0000],
    ],
    [TAB_USERDATA_TRADE_HISTORY]: [
      ['27/11/19 12:00', 'SDJ/ETH','Maker','Sell',0.0000,0.0000,0.0000,0.0000],
    ],
  }
}

const userDataReducer = (state:UserData = initialState, action:TableActions):UserData => {
  switch(action.type) {
    case TEXT_FILTER:
      if (action.payload.target === TAB_USERDATA)
        return { ...state, textFilter: action.payload.textFilter }
      else
        return state
    }
  return state
}

export default userDataReducer
