import { ACTIVATE_TAB, ActivationPayload, ActivateTabAction, SelectCurrencyPairAction } from '../constants/actionTypes'
import {
  SORT_BY,
  SORT_DIRECTION,
  TEXT_FILTER,
  SELECT_CURRENCY_PAIR,
  SortByAction,
  SortDirectionAction,
  sortingTypes,
  TextFilterAction,
} from '../constants/actionTypes'

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

export type ActiveTabActions = ActivateTabAction

export type TableActions = SortByAction | SortDirectionAction | TextFilterAction | SelectCurrencyPairAction