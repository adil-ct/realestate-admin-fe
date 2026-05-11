/* eslint-disable no-param-reassign */
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from 'reactstrap';

import AddChartData from 'components/UI/Model/AddChartData';
import { MarketChartColumn } from 'constants/tableColumn';
import DatatableTables from 'components/Table/Table';
import ActionCell from 'components/ActionButton';
import { setSavedItem } from 'store/actions';
import RenderIf from 'components/RenderIf';

const MarketChart = ({ view, detail }) => {
  const dispatch = useDispatch();

  const [initialData] = useState(detail?.marketChart || []);
  const [row, setRow] = useState(detail?.marketChart || []);
  const [selectdata, setSelectData] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [changed, setChanged] = useState(false);
  const [rowdata, setRowData] = useState([]);

  const columnData = view ? MarketChartColumn.filter(item => item.field !== 'action') : MarketChartColumn;

  const handleAdd = () => {
    setAddModal(prev => !prev);
    if (selectdata) {
      setSelectData(null);
    }
  };

  const handleRemove = step => {
    setRow(row.filter((item, index) => index + 1 !== step));
  };

  const handleEdit = step => {
    const data = row.find((item, index) => step === index + 1);
    handleAdd();
    setSelectData({ ...data, step });
  };

  useEffect(() => {
    const rowData = row.map((item, index) => ({
      action: <ActionCell remove={handleRemove} edit={handleEdit} id={index + 1} />,
      ...item,
    }));
    const changedAgain = JSON.stringify(row) !== JSON.stringify(initialData);
    if (changedAgain !== changed) {
      setChanged(changedAgain);
      dispatch(setSavedItem({ tab: 8, changed: changedAgain }));
    }
    detail.marketChart = row;
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
      <div className="text-end px-4 py-3">
        <RenderIf render={!view}>
          <Button className="button-color" onClick={handleAdd}>
            Add Chart Data
          </Button>
        </RenderIf>
      </div>
      <DatatableTables column={columnData} row={rowdata} />
      <RenderIf render={addModal}>
        <AddChartData close={handleAdd} handleSubmit={addToTable} model={selectdata} />
      </RenderIf>
    </>
  );
};

export default MarketChart;
