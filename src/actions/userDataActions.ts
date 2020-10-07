import { ADD_MY_ORDER, TextFilterAction, MyOrderType, AddMyOrderAction } from '../constants/actionTypes'

export const addMyOrder = (payload: MyOrderType):AddMyOrderAction => ({
  type: ADD_MY_ORDER,
  payload,
})

export type UserDataActions = TextFilterAction| AddMyOrderAction