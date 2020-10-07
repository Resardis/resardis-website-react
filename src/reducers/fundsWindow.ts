import { FundsWindowActions } from '../actions'

export interface FundsWindowState {
  isOpen: boolean,
}

const initialFundsWindowState: FundsWindowState = {
  isOpen: false,
}

const fundsWindowReducer = (state:FundsWindowState = initialFundsWindowState, action:FundsWindowActions):FundsWindowState => {
  switch(action.type) {
    case 'OPEN_FUNDS_WINDOW': return {
      isOpen: true,
    }
    case 'CLOSE_FUNDS_WINDOW': return {
      isOpen: false,
    }
    default: return state
  }
}

export default fundsWindowReducer
