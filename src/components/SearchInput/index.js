/* eslint-disable no-underscore-dangle */
const SearchInput = ({onChange, placeholder, waitTime, minSearchChar}) => {
    
    let tempInterval = '';
    const _handleChange = val => {
        const searchedKeywrod = val.target.value.trim();
        clearTimeout(tempInterval);
        tempInterval = setTimeout(() => {
            const qp = searchedKeywrod.length > (minSearchChar || 2) ? searchedKeywrod : "";
            onChange(qp);
        }, (waitTime || 500));
    };

    return (
        <div className="search-box">
            <div className="position-relative">
                <input className="form-control" type="search" onChange={_handleChange} placeholder={placeholder || "Search"} />
                <i className="mdi mdi-magnify search-icon" />
            </div>
        </div>
    )
};

export default SearchInput;