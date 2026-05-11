import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { IoIosArrowBack } from 'react-icons/io';

import { commonSaga } from 'store/actions';
import './authenticationModal.css';

const DepositQR = ({ isOpen, onClose, backBtn }) => {
  const dispatch = useDispatch();
  const { walletAddress } = useSelector(state => state.user);

  const [copied, setCopied] = useState(false);
  const [isDevServer, setIsDevServer] = useState(false);

  useEffect(() => {
    const isDev = window.location.href.includes('https://dev-admin.investwithmogul.com/');
    setIsDevServer(isDev);
  }, []);
  const copyToCLipBoard = value => {
    try {
      navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (err) {
      // console.log(err);
    }
  };
  const toggle = () => {
    onClose(prev => !prev);
  };

  const onMintToken = () => {
    dispatch(
      commonSaga({
        endPoint: '/direct-musdc-mint',
        type: 'post',
        stateObj: 'mintUSDCToken',
        dataToPost: { amount: 1000 },
        msg: 'Token Minted Created Successfully!',
        showAlert: true,
        baseEP: 'MARKETPLACE',
      }),
    );
  };

  return (
    <>
      <Modal isOpen={isOpen} centered>
        <ModalHeader toggle={toggle}>
          {' '}
          <div className="mb-2" onClick={backBtn}>
            <IoIosArrowBack />
            <span className="m-header-qr">Back</span>
          </div>
        </ModalHeader>
        <ModalBody className="scan2fabodycontainer">
          <div className="scan2fabody">
            <h5>SCAN QR CODE</h5>
            <h6>
              Scan the QR code or copy the wallet address to transfer USDC(Polygon) to your Occurrence
              wallet
            </h6>
            <img alt="" className="scanimg" src={walletAddress?.data?.qr} />
            <h6>OR</h6>
            <div className="secretcode">
              <div>{walletAddress?.data?.walletAddress}</div>

              <i
                role="button"
                className={copied ? 'fas fa-check color-green' : 'far fa-copy'}
                onClick={() => copyToCLipBoard(walletAddress?.data?.walletAddress)}
              />
            </div>
            {isDevServer && (
              <Button type="button" className="m-1" onClick={onMintToken}>
                Mint Token
              </Button>
            )}
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default DepositQR;
