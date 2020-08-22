import React from 'react'
import TabItem, { Item } from './TabItem'
import '../../css/TabbedNav.css'

interface TabbedNavProps {
  items: Item[],
  tabbedNavigationName: string,
}

const TabbedNav = ({ items, tabbedNavigationName }: TabbedNavProps) => (
  <div className="tabbed-nav">
    {items.map(item => <TabItem key={item.title} item={item} tabbedNavigationName={tabbedNavigationName} />)}
  </div>
)

export { TabbedNav }