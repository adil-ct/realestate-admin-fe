import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const ActionCell = ({ view, edit, remove, blacklist, whitelist, id, buy, sell, vote, duplicate }) => {
  const { userData } = useSelector(state => state.user);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    if(userData?.isSuperAdmin) {
      setIsSuperAdmin(true);
    }
  }, [userData]);

  return (<div className="d-flex align-items-center">
    {buy && <a className="title-color px-2 fw-bolder cursor-pointer">BUY</a>}
    {sell && <a className="title-color px-2 fw-bolder cursor-pointer">SELL</a>}
    {vote && <a className="title-color px-2 fw-bolder cursor-pointer">VOTE</a>}
    {view && <i title="View" className="fa fa-eye mx-2 active-link title-color" role="button" onClick={() => view(id)} />}
    {edit && isSuperAdmin && <i title="Edit" className="color-green fas fa-edit mx-2" role="button" onClick={() => edit(id)} />}
    {remove && isSuperAdmin && <i title="Remove" className="fa fa-trash mx-2 color-red" role="button" onClick={() => remove(id)} />}
    {duplicate && isSuperAdmin && <i title="Duplicate" className="fa fa-files-o mx-2" role="button" onClick={() => duplicate(id)} />}
    {whitelist && isSuperAdmin && (
      <i className="fas fa-user-check mx-2" role="button" onClick={() => whitelist(id)} />
    )}
    {blacklist && isSuperAdmin && (
      <i className="fas fa-user-slash mx-2" role="button" onClick={() => blacklist(id)} />
    )}
  </div>)
};

export default ActionCell;
