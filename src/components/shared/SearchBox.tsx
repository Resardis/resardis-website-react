import React, { useEffect, useRef } from "react";
import { ReactComponent as SearchIcon } from "../../svg/search.svg";
import "../../css/SearchInput.css";

interface SearchBox {
  value: string;
  updateTextFilter: Function;
  target: string;
}

const SearchBox = ({ value, updateTextFilter, target }: SearchBox) => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, [value]);

  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
      <input
        className="search-input"
        placeholder="Search"
        type="text"
        value={value}
        ref={ref}
        onChange={(e) => updateTextFilter(target, e.target.value)}
      />
      <SearchIcon className="search-icon" />
    </div>
  );
};

export default SearchBox;
