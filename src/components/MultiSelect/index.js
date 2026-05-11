/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect, useRef } from 'react';
import './index.css';

const MultiSelect = ({
  name,
  title,
  options,
  onSelect,
  selectAll = true,
  eleClass = '',
  showSelected = false,
  preSelected = [],
  disabled = false,
}) => {
  const wrapperRef = useRef(null);

  const [allSelected, setAllSelected] = useState(false);
  const [selectionArr, setSelectionArr] = useState(preSelected);
  const [optionsList, setOptionsList] = useState([]);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    const handleClickOutside = event => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target) && showList) {
        setShowList(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef, showList]);

  useEffect(() => {
    const alterListArr = [];
    options?.forEach(ele => {
      alterListArr.push({ label: ele, selected: preSelected.indexOf(ele) !== -1 });
    });
    if (options?.length === preSelected?.length) {
      setAllSelected(true);
    }

    setOptionsList(alterListArr);
  }, []);

  const _onSelect = val => {
    if (val === 'all') {
      setSelectionArr(!allSelected ? options : []);
      onSelect(!allSelected ? options : [], name);
      setAllSelected(!allSelected);
      optionsList.forEach(ele => (ele.selected = false));
      setShowList(false);
    } else {
      const _selectionArr = selectionArr;
      const itemIndex = _selectionArr.indexOf(val?.label);
      if (itemIndex !== -1) {
        val.selected = false;
        _selectionArr.splice(itemIndex, 1);
      } else {
        val.selected = true;
        _selectionArr.push(val?.label);
      }
      setSelectionArr(_selectionArr);
      onSelect(selectionArr, name);

      if (_selectionArr?.length === options?.length) {
        setAllSelected(true);
      } else {
        setAllSelected(false);
      }
    }
  };

  const _showList = () => {
    if (!disabled) {
      setShowList(!showList);
    }
  };

  return (
    <div className="multiSelectBox" ref={wrapperRef}>
      <span onClick={_showList} className={`${eleClass} ${disabled ? 'disabled' : ''} selectLabel`}>
        {showSelected && selectionArr?.length
          ? selectionArr.join(' , ')
          : title || 'Select Multiple'}
        <span className={showList ? 'arrow_up' : 'arrow_down'} />
      </span>
      {showList && (
        <div className="listItemsBox">
          {selectAll && (
            <span onClick={() => _onSelect('all')} value="all" className="selectItem">
              {/* <span className={allSelected ? "selectedFlag" : "unselectedFlag"} /> */}
              <input readOnly key={Math.random()} type="checkbox" checked={allSelected} />
              All
            </span>
          )}
          {optionsList?.length > 0 &&
            optionsList.map((ele,ind) => (
              <span key={ind} onClick={() => _onSelect(ele)} value={ele?.label} className="selectItem">
                {/* <span className={(ele?.selected || allSelected) ? "selectedFlag" : "unselectedFlag"} /> */}
                <input
                  key={Math.random()}
                  readOnly
                  type="checkbox"
                  checked={ele?.selected || allSelected}
                />
                {ele?.label[0].toUpperCase() + ele?.label?.slice(1, ele?.label?.length)}
              </span>
            ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
