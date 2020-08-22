import { ActiveTabActions } from '../actions'
import { ACTIVATE_TAB } from '../constants/actionTypes'
import {
  TAB_MARKETS_ETH,
  TAB_MENU_MARKETS_NAME,
  TAB_SELECTEDMARKET_ORDERS,
  TAB_MENU_SELECTEDMARKET_NAME,
  TAB_USERDATA_OPEN_ORDERS,
  TAB_MENU_USERDATA_NAME
} from '../constants/tabData'

export interface ActiveTabs {
  [tabbedNavigationName: string]: string
}

const initialActiveTabs: ActiveTabs = {
  [TAB_MENU_MARKETS_NAME]: TAB_MARKETS_ETH,
  [TAB_MENU_SELECTEDMARKET_NAME]: TAB_SELECTEDMARKET_ORDERS,
  [TAB_MENU_USERDATA_NAME]: TAB_USERDATA_OPEN_ORDERS,
}

const activeTabsReducer = (state:ActiveTabs = initialActiveTabs, action:ActiveTabActions):ActiveTabs => {
  switch(action.type) {
    case ACTIVATE_TAB:
      return { ...state, ...action.payload }
  }
  return state
}

export default activeTabsReducer