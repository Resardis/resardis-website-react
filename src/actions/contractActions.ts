import {
  SET_CONTRACT_API,
  ADD_ACTIVE_OFFER,
  REMOVE_ACTIVE_OFFER,
  SetContractAPIAction,
  AddActiveOfferIDAction,
  RemoveActiveOfferIDAction,
} from '../constants/actionTypes'

export const setContractAPI = (contractAPI:object|null):SetContractAPIAction => ({
  type: SET_CONTRACT_API,
  payload: {
    contractAPI,
  }
})

export const addActiveOfferID = (payload: number):AddActiveOfferIDAction => ({
  type: ADD_ACTIVE_OFFER,
  payload,
})

export const removeActiveOfferID = (payload: number):RemoveActiveOfferIDAction => ({
  type: REMOVE_ACTIVE_OFFER,
  payload,
})

export type ContractActions = SetContractAPIAction | AddActiveOfferIDAction | RemoveActiveOfferIDAction