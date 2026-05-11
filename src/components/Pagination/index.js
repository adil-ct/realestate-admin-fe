/* eslint-disable no-underscore-dangle */
import React, { useState } from 'react';
import './index.css';

const Pagination = ({ paginationConfig }) => {
    const {pageCount, itemCount, currentPage, onPageChange, showLabel = true, showStartEndPage = true } = paginationConfig;

    const [_currentPage, setCurrentPage] = useState(currentPage || 1);

    const _onPageChange = (page) => {
        setCurrentPage(page);
        onPageChange(page);
    }

    const nextPage = () => {
        const updatedPage = _currentPage + 1 <= pageCount ? _currentPage + 1 : _currentPage;
        setCurrentPage(updatedPage);
        onPageChange(updatedPage);
    }

    const prevPage = () => {
        const updatedPage = _currentPage - 1 >= 1 ? _currentPage - 1 : 1;
        setCurrentPage(updatedPage);
        onPageChange(updatedPage);
    }

    return (
        <div>
            { pageCount > 1 &&
                <div className="pagination">
                    {showLabel && <span className="align-self-center mx-4">
                        Total Entries <strong>{itemCount}</strong>
                    </span>
                    }

                    {showStartEndPage && 
                        <button disabled={_currentPage === 1} type="button" onKeyDown={() => _onPageChange(1)} onClick={() => _onPageChange(1)} className="page active">
                            <i className="arrow left" />
                            <i className="arrow left" />
                        </button>
                    }
                    <button disabled={_currentPage === 1} type="button" onKeyDown={() => prevPage()} onClick={() => prevPage()} className="page active">
                        Prev
                    </button>

                    {Array.from(Array(pageCount), (ele, i) => {
                        const start = (_currentPage+4) <= pageCount ? _currentPage : (pageCount-4);
                        const end = (_currentPage+4) <= pageCount ? (_currentPage+4) : pageCount;
                        let dom = "";
                        if(i+1 >= start && i+1 <= end) {
                            dom = <span
                            tabIndex={i}
                            key={`pagination${i}`}
                            role="button"
                            className={i+1 === _currentPage ? 'active page' : 'page'}
                            onClick={() => _onPageChange(i+1)}
                            onKeyDown={() => _onPageChange(i+1)}
                            >
                                {i+1}
                            </span>
                        }
                        return dom;
                    })}

                    <button disabled={_currentPage === pageCount} className="page active" type="button" onKeyDown={() => nextPage()} onClick={() => nextPage()}>
                        Next
                    </button>
                    {showStartEndPage && 
                        <button disabled={_currentPage === pageCount} type="button" onKeyDown={() => _onPageChange(pageCount)} onClick={() => _onPageChange(pageCount)} className="page active">
                            <i className="arrow right" />
                            <i className="arrow right" />
                        </button>
                    }
                </div>
            }
        </div>
    )
};

export default Pagination;
