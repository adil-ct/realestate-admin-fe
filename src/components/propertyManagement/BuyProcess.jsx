import ActionCell from 'components/ActionButton';
import RenderIf from 'components/RenderIf';
import DatatableTables from 'components/Table/Table';
import AddStepModal from 'components/UI/Model/AddStepModal';
import { BuyStep } from 'constants/tableColumn';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from 'reactstrap';
import { setSavedItem } from 'store/actions';

const BuyProcess = ({ detail, data, view }) => {
  const dispatch = useDispatch();
  const [initialData] = useState(
    detail.map(item => ({
      name: item.name,
      date: item.date.substring(0, 10),
      description: item.description ?? '',
    })),
  );
  const [changed, setChanged] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [row, setRow] = useState(JSON.parse(JSON.stringify(initialData)));
  const [rowdata, setRowData] = useState([]);
  const [selectdata, setSelectData] = useState(null);
  const handleAdd = () => {
    setAddModal(prev => !prev);
    if (selectdata) setSelectData(null);
  };
  const handleRemove = step => {
    setRow(row.filter((item, index) => index + 1 !== step));
  };
  const handleEdit = step => {
    const dataItem = row.find((item, index) => step === index + 1);
    handleAdd();
    setSelectData({ ...dataItem, step });
  };
  useEffect(() => {
    data.buyProcess = row.map(item => ({ ...item, status: 'Pending' }));
    const rowData = row.map((item, index) => ({
      number: index + 1,
      action: <ActionCell remove={handleRemove} edit={handleEdit} id={index + 1} />,
      ...item,
    }));
    const changedAgain = JSON.stringify(row) !== JSON.stringify(initialData);
    if (changedAgain !== changed) {
      // changed = changedAgain;
      setChanged(changedAgain);
      dispatch(setSavedItem({ tab: 8, changed: changedAgain }));
    }
    setRowData(rowData);
  }, [row]);
  const addToTable = (val) => {
    if (selectdata) {
      setRow(prev => prev.map((item, index) => (index + 1 === selectdata.step ? val : item)));
      setSelectData(null);
    } else {
      setRow(prev => [...prev, val]);
    }
    handleAdd();
  };
  return (
    <>
      <div className="heading fw-bolder">Buy Process</div>
      <div className="text-end px-4 py-2">
        {!view && (
          <Button className="button-color" onClick={handleAdd}>
            Add Step
          </Button>
        )}
      </div>
      <DatatableTables
        column={view ? BuyStep.filter(item => item.field !== 'action') : BuyStep}
        row={rowdata}
        noentry
      />
      <RenderIf render={addModal}>
        <AddStepModal close={handleAdd} handleSubmit={addToTable} model={selectdata} />
      </RenderIf>
    </>
  );
};

export default BuyProcess;
