import React, { useEffect, useState, useRef } from 'react';
import '../modal.css';
import './multiselct.css';
import { Modal, Spinner } from 'reactstrap';
import { axiosMain } from 'http/axios/axios_main';
import RenderIf from 'components/RenderIf';
import Loader from 'components/UI/Spinner/Spinner';
import { useSelector } from 'react-redux';
import DataElement from './DataElement';

const MultipleSelctModal = ({
  isOpen,
  close,
  title,
  investors,
  select = '_id',
  show = 'email',
  buttonText = 'Done',
  endPoint,
  send,
  showAll = true,
  search = true,
  handleSubmit,
  addUser,
}) => {
  const { sendPassLoading } = useSelector(state => state.user);
  const [users, setUsers] = useState([]);
  const [data, setData] = useState(investors || []);
  const [loading, setLoading] = useState(false);
  const ref = useRef();
  useEffect(async () => {
    if (endPoint) {
      try {
        setLoading(true);
        const resp = await axiosMain.get(endPoint);
        setData(resp.data.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    }
  }, [endPoint]);
  const handleChange = (e, user) => {
    const { checked } = e.target;
    if (checked) {
      if (user === 'all') setUsers(data.map(item => item[select]));
      else setUsers([...users, user[select]]);
    } else if (user === 'all') setUsers([]);
    else setUsers(users.filter(item => item !== user[select]));
  };
  const handleInput = e => {
    const val = e.target.value.toLowerCase().trim();
    if (!val) {
      setData(investors);
      return;
    }
    const searchData = investors.filter(item => item[show].toLowerCase().includes(val));
    setData(searchData);
  };
  return (
    <>
      <div id="multiple_select">
        <div>
          <Modal isOpen={isOpen} centered scrollable>
            <div className="modal-header justify-content-center flex-column">
              <div className="p-2">
                <div className="d-flex justify-content-center">
                  <h5 className="modal-title mt-0" id="myModalLabel" style={{ marginLeft: '10px' }}>
                    {title}
                  </h5>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    close(false);
                  }}
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <RenderIf render={search}>
                {' '}
                <div className="w-100 position-relative">
                  <input
                    type="text"
                    className="search-box1 w-100"
                    onChange={handleInput}
                    placeholder="Search investors"
                    ref={ref}
                  />
                  {!ref.current?.value ? (
                    <i className="mdi mdi-magnify search-icon fa-2x glass" />
                  ) : (
                    <h3
                      className="cross"
                      onClick={() => {
                        ref.current.value = '';
                        setData(investors);
                      }}
                    >
                      x
                    </h3>
                  )}
                </div>
              </RenderIf>
            </div>
            <div className="modal-body">
              <RenderIf render={showAll && data?.length > 1}>
                <div className="selectall">
                  <div>All</div>
                  <input
                    type="checkbox"
                    className="circle_checkbox"
                    onChange={e => handleChange(e, 'all')}
                  />
                </div>
              </RenderIf>
              {data?.length ? (
                data.map((item,ind) => (
                  <DataElement
                    key={ind}
                    item={item}
                    handleChange={handleChange}
                    users={users}
                    show={show}
                    select={select}
                    send={send}
                  />
                ))
              ) : loading ? (
                <Loader withoutMargin />
              ) : (
                <h5 className="text-center">No {show} available</h5>
              )}
            </div>
            <div className="modal-footer d-flex justify-content-center">
              <button
                type="button"
                className="btn btn-primary waves-effect dropdownColor w-50"
                data-dismiss="modal"
                onClick={() => handleSubmit(users)}
                disabled={!send && !users.length}
              >
                {sendPassLoading || !addUser ? <Spinner size="sm" /> : buttonText}
              </button>
            </div>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default MultipleSelctModal;
