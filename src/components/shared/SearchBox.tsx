import React from 'react'
import { ReactComponent as SearchIcon } from '../../svg/search.svg'
import '../../scss/SearchInput.scss'

interface SearchBox {
  value:string, updateTextFilter:Function, target:string,
}

const SearchBox = ({value, updateTextFilter, target}:SearchBox) => (
  <div className="search-wrapper">
    <input className="search-input" placeholder="Search" type="text" value={value} onChange={
      e => updateTextFilter(target, e.target.value)
    }/>
    <SearchIcon className="search-icon" />
  </div>
)

export default SearchBox