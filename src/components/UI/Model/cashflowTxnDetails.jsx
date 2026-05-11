import React from 'react';
import moment from 'moment';

import { Modal, ModalHeader, ModalBody} from 'reactstrap';

const CashflowTxnDetails = ({ isOpen, onClose, data}) => {    

  const toggle = () => {
    onClose(false);
  };
  
  return (  
    <>
      <Modal isOpen={isOpen} toggle={toggle} centered>
        <ModalHeader className="mx-auto" toggle={toggle}>Transaction Details</ModalHeader>
        <ModalBody>
            <div>
                <div className="flexCenter">
                    <p>Date</p>
                    <p>{moment(new Date(data?.endDate || data?.updatedAt)).format('lll')}</p>
                </div>
                <div className="flexCenter">
                    <p>Total Rent Amount</p>
                    <p>${data?.rentAmount || data?.totalRent}</p>
                </div>
                {data?.rentAmount && <div className="flexCenter">
                    <p>Net Rent Amount</p>
                    <p>{data?.rentAmount}</p>
                </div>}
                <div className="flexCenter">
                    <p>Towards Maintance Fees</p>
                    <p>${data?.maintenanceFee}</p>
                </div>
                <div className="flexCenter">
                    <p>Towards Vacancy Reserve Fees</p>
                    <p>${data?.vacancyFee || "0.00"}</p>
                </div>
                <div className="flexCenter">
                    <p>To Co-owners</p>
                    <p>${data?.distributableAmount || data?.toCoowners}</p>
                </div>
                {/* <div className="flexCenter">
                    <p>Transaction Hash</p>
                    <p>
                        {data?.transactionHash ? <a rel="noreferrer"  href={`https://mumbai.polygonscan.com/tx/${data?.transactionHash || data?._id}`} target="_blank"> 
                          {data?.transactionHash && typeof (data?.transactionHash) === "string" && `${data?.transactionHash?.substr(0, 6)}`}......
                          {data?.transactionHash?.substr(data?.transactionHash?.length - 4, data?.transactionHash?.length)}
                        </a> : "-"}
                    </p>
                </div> */}
            </div>
        </ModalBody>
      </Modal>
    </>
  )
}

export default CashflowTxnDetails