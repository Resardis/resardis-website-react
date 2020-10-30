import React from 'react'
import { TabbedNav } from './shared'
import {
  TAB_MENU_USERDATA,
  TAB_MENU_USERDATA_NAME,
} from '../constants/tabData'
import UserDataTabContent from './userData'
import '../scss/UserData.scss'

const UserData = () => (
  <div className="user-data main-tab">
    <TabbedNav items={TAB_MENU_USERDATA} tabbedNavigationName={TAB_MENU_USERDATA_NAME} />
    <UserDataTabContent />
  </div>
)

export default UserData
