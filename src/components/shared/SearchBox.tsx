import React from 'react'
import { ReactComponent as SearchIcon } from '../../svg/search.svg'
import '../../css/SearchInput.css'

interface SearchBox {
  value:string, updateTextFilter:Function, target:string,
}

const SearchBox = ({value, updateTextFilter, target}:SearchBox) => (
  <div style={{ position: 'relative' }}>
    <input className="search-input" placeholder="Search" type="text" value={value} onChange={
      e => updateTextFilter(target, e.target.value)
    }/>
    <SearchIcon className="search-icon" />
  </div>
)

export default SearchBox