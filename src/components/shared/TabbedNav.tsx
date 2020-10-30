import React from 'react'
import TabItem, { Item } from './TabItem'
import '../../scss/TabbedNav.scss'

interface TabbedNavProps {
  items: Item[],
  tabbedNavigationName: string,
}

const TabbedNav = ({ items, tabbedNavigationName }: TabbedNavProps) => (
  <nav>
    <ul className="nav nav-tabs justify-content-between" role="tablist">
      {items.map(item => (
        <TabItem
          key={item.title}
          item={item}
          tabbedNavigationName={tabbedNavigationName}
        />
      ))}
    </ul>
  </nav>
)

export { TabbedNav }