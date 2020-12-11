import {
  SET_CONTRACT_API,
  ADD_ACTIVE_OFFER,
  REMOVE_ACTIVE_OFFER,
} from '../constants/actionTypes'
import { ContractActions } from '../actions/contractActions'
import { Network } from '../constants/networks'
import { getDefaultNetwork } from '../constants/networks'

export interface Contract {
  activeOffers: {
    [key:string]: boolean
  },
  contractAPI: object|null,
  network: Network,
}

// initial state: the choice of Network is a) main, b) mumbai (test net), c) some other net, local or whatever
// how can we distinguish? ${networkID} our wallet is connected to - maybe, but we don't care what user is using,
// what we care about is this particular instance connected to specific contract on a known network.

const initialState: Contract = {
  activeOffers: {},
  contractAPI: null,
  network: getDefaultNetwork(),
}

const contractReducer = (state:Contract = initialState, action:ContractActions):Contract => {
  const newState = { ...state }

  switch(action.type) {
    case SET_CONTRACT_API:
      return { ...state, contractAPI: action.payload.contractAPI }

    case ADD_ACTIVE_OFFER:
      newState.activeOffers = { ...newState.activeOffers, [action.payload.toString()]: true }
      //console.log('activeOffers +', newState)
      return newState

    case REMOVE_ACTIVE_OFFER:
      console.log()
      newState.activeOffers = { ...newState.activeOffers, [action.payload.toString()]: false }
      //console.log('activeOffers -', newState)
      return newState

    default:
        return state
    }
  }

  export default contractReducer
