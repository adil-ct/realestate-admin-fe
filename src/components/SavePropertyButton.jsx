/* eslint-disable no-underscore-dangle */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { Button } from 'reactstrap';

import { checkUpdatedTab } from 'constants/DraftData';
import { mintProperty, createProperty, putOnSale, setSavedItem } from 'store/actions';
import RenderIf from './RenderIf';

const SavePropertyButton = ({ data, showMarket, handleSave, openBuyModal }) => {

  const { saveList } = useSelector(state => state.user);
  const { propertyDetail } = useSelector(state => state.common);

  const { status, crowdSale } = data;
  const mogulEquityBuyStatus = crowdSale?.isMogulEquityBought;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const editSuccess = () => {

    toast.success('Property details updated successfully');
    dispatch(setSavedItem());
  };
  const mintSuccess = () => {
    navigate('/draft-properties',{state: 'Minted' });
    toast.success('Property tokens minted successfully');
  };
  const listSuccess = () => {
    navigate('/published-properties',{state: 'OnSale' });
    toast.success('Property listed successfully');
  };
  // const buySuccess = () => {
  //   history.push('/published-properties', state: 'OnSale' });
  //   toast.success('Investment Successful');
  // };

  const onSubmit = event => {
    const isDraft = status === 'Draft';
    if (showMarket) {
      handleSave();
      return;
    }
    const successObj = {
      mint: mintSuccess,
    };
    if (event === 'buy') {
      // dispatch(buyEquity({ id: data._id, success: buySuccess }));
      openBuyModal(true);
      return;
    }
    if (event === 'sell') {
      dispatch(putOnSale({ id: data._id, success: listSuccess }));
      return;
    }
    if (event === 'mint' && !saveList.length) {
      dispatch(
        mintProperty({
          id: data._id,
          success: mintSuccess,
        }),
      );
      return;
    }
    if (!saveList.length) return;

    const newData = JSON.parse(JSON.stringify(data));
    Object.keys(checkUpdatedTab).forEach(item => {
      const { name, info } = checkUpdatedTab[item];
      if (!saveList.includes(Number(item))) delete newData[name];
      else if (name === 'attom') {
        delete newData.attom.attomId;
        if (!isDraft) {
          Object.keys(info).forEach(itm => {
            if (!info[itm].update) delete newData[name]?.[itm];
          });
        }
      } else if (name === 'otherInfo') {
        if (!isDraft) {
          Object.keys(info).forEach(itm => {
            if (!info[itm].update) delete newData[name]?.[itm];
            if (newData[name]?.[itm]?._id) delete newData[name]?.[itm]?._id;
          });
        }
      } else if (name === 'financials') {
        Object.keys(newData.financials).forEach(it => {
          if (it.startsWith('contingencyVar')) {
            delete newData.financials[it]._id;
          }

          if (it === 'mercuryToken' && newData.financials[it] === propertyDetail?.dataObj?.financials?.mercuryToken) {
            delete newData.financials.mercuryToken;
          }

          if (it === 'leveragedCashflowMargin' && Array.isArray(newData.financials[it])) {
            newData.financials[it] = newData.financials[it].join(',');
          }
        });
        delete newData[name].propertyValues;
        delete newData[name].assetValues;
        if (!isDraft) {
          Object.keys(info).forEach(itm => {
            if (!info[itm].update) delete newData[name]?.[itm];
          });
        }
      } else if (name === 'crowdSale') {
        const { startDate, stopDate } = newData[name];
        if (startDate) newData[name].startDate = new Date(startDate).toISOString();
        if (stopDate) newData[name].stopDate = new Date(stopDate).toISOString();
        if (!isDraft) {
          Object.keys(info).forEach(itm => {
            if (!info[itm].update) delete newData[name]?.[itm];
          });
        }
      } else if (name === 'cashflow') {
        const { rentalDocument, propertyMgtFee, LLCAdministrationFee, HOAFee } = newData[name];
        delete propertyMgtFee?._id;
        delete LLCAdministrationFee?._id;
        delete HOAFee?._id;
        delete newData[name].rentalDocuments;
        delete newData[name].mortgage;
        // delete newData[name].annualRentGrowth;
        if (rentalDocument) {
          // rentalDocument.url = rentalDocument.location;
          rentalDocument.sizeInMegaByte = rentalDocument.size;
          delete rentalDocument.mimetype;
          delete rentalDocument.location;
          delete rentalDocument.size;
        }
        if (!isDraft) {
          Object.keys(info).forEach(itm => {
            if (!info[itm].update) delete newData[name]?.[itm];
          });
        }
      } else if (name === 'documents') {
        const { main, others } = newData[name];
        if (main) {
          if (main._id) delete main._id;
          else {
            // main.url = main.location;
            main.sizeInMegaByte = main.size;
            delete main.mimetype;
            delete main.location;
            delete main.size;
          }
        }
        if (others.length) {
          const newOthers = others.map(file => {
            if (file._id) delete file._id;
            else {
              // if(!file.url) file.url = file.location;
              file.sizeInMegaByte = file.size;
              delete file.mimetype;
              delete file.location;
              delete file.size;
            }
            return file;
          });
          newData[name].others = newOthers;
        }
        if (!isDraft) delete newData[name]?.main;
        // else {
        //   delete newData[name].others;
        // }
      } else if (name === 'images') {
        const { list } = newData[name];
        if (list?.length) {
          const images = list.map(file => {
            if (file._id) delete file._id;
            else {
              // file.url = file.location;
              file.sizeInMegaByte = file.size;
              delete file.mimetype;
              delete file.location;
              delete file.size;
            }
            return file;
          });
          newData[name].list = images;
        }
      }
    });
    delete newData._id;
    delete newData.trending;
    delete newData.updatedAt;
    delete newData.createdAt;
    delete newData._createdBy;
    delete newData.isTrending;
    delete newData.isHidden;
    delete newData._updatedBy;
    delete newData.circle;
    delete newData.mogulEquityBuyStatus;
    delete newData.status;
    delete newData.crowdsale;
    delete newData.rentalDocuments;
    delete newData?.otherInfo?.estateId;
    delete newData.crowdSale?.pricePerToken;
    delete newData.crowdSale?.tokensForSale;
    delete newData.crowdSale?.isMogulEquityBought;
    newData.otherInfo = { ...newData.otherInfo };
    dispatch(
      createProperty({
        status,
        event,
        data: newData,
        _id: data._id,
        success: successObj[event] || editSuccess,
      }),
    );
  };
  return (
    <>
      {!showMarket ? (
        status === 'Draft' ? (
          <Button className="button-color mx-2" onClick={() => onSubmit('mint')}>
            Mint Property Tokens
          </Button>
        ) : status === 'Minted' ? (
          <Button className="button-color mx-2" onClick={() => onSubmit('sell')}>
            List Property
          </Button>
        ) : !mogulEquityBuyStatus ? (
          <Button className="button-color mx-2" onClick={() => onSubmit('buy')}>
            Buy Equity
          </Button>
        ) : null
      ) : null}
      <RenderIf render={saveList?.length}>
        <Button className="button-color" onClick={onSubmit}>
          Save Changes
        </Button>
      </RenderIf>
    </>
  );
};

export default SavePropertyButton;
