import {
  ACTIVATE_TAB,
  ActivateTabAction,
  ActivationPayload,
  SelectCurrencyPairAction,
  SORT_BY,
  SORT_DIRECTION,
  TEXT_FILTER,
  SELECT_CURRENCY_PAIR,
  UPDATE_CURRENCY_PAIR_DATA,
  OPEN_FUNDS_WINDOW,
  CLOSE_FUNDS_WINDOW,
  SELECT_SCREEN,
  SortByAction,
  SortDirectionAction,
  sortingTypes,
  TextFilterAction,
  OpenFundsWindowAction,
  CloseFundsWindowAction,
  SelectScreenAction,
  UpdateCurrencyPairDataAction,
  SELECT_ORDER,
  MyOrderType,
  SelectOrderAction,
} from '../constants/actionTypes'
import { PairData } from '../reducers/markets'

export const activateTab = (payload: ActivationPayload):ActivateTabAction => ({
  type: ACTIVATE_TAB,
  payload,
})

export const sortBy = (payload: sortingTypes):SortByAction => ({
  type: SORT_BY,
  payload,
})

export const sortDirection = ():SortDirectionAction => ({
  type: SORT_DIRECTION,
})

export const updateTextFilter = (target: string, textFilter: string):TextFilterAction => ({
  type: TEXT_FILTER,
  payload: {
    target,
    textFilter: textFilter.toUpperCase(),
  }
})

export const selectCurrencyPair = (pair: string):SelectCurrencyPairAction => ({
  type: SELECT_CURRENCY_PAIR,
  payload: pair,
})

export const updateCurrencyPairData = (pairData:PairData):UpdateCurrencyPairDataAction => ({
  type: UPDATE_CURRENCY_PAIR_DATA,
  payload: pairData,
})

export const openFundsWindow = ():OpenFundsWindowAction => ({
  type: OPEN_FUNDS_WINDOW,
})

export const closeFundsWindow = ():FundsWindowActions => ({
  type: CLOSE_FUNDS_WINDOW,
})

export const selectScreen = (screen: string):SelectScreenAction => ({
  type: SELECT_SCREEN,
  payload: screen,
})

export const selectOrder = (order: MyOrderType):SelectOrderAction => ({
  type: SELECT_ORDER,
  payload: order,
})

export type ActiveTabActions = ActivateTabAction

export type TableActions = SortByAction | SortDirectionAction | TextFilterAction | SelectOrderAction | SelectCurrencyPairAction | UpdateCurrencyPairDataAction

export type FundsWindowActions = OpenFundsWindowAction | CloseFundsWindowAction
