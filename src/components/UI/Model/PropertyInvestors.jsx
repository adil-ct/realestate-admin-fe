import React from 'react';

import { Modal, ModalHeader, ModalBody} from 'reactstrap';
import { PropertyInvestorsList } from 'constants/tableColumn';
import DatatableTables from 'components/Table/Table';
import { useDispatch } from 'react-redux';
import { commonClear } from 'store/actions';

const PropertyInvestors = ({ isOpen, onClose, data}) => {    
  const dispatch = useDispatch()
  const toggle = () => {
    onClose(false);
    dispatch(commonClear({stateObj:"propertyInvestorList"}))
  };
  
  return (
    <>
      <Modal isOpen={isOpen} toggle={toggle} centered>
        <ModalHeader className="mx-auto" toggle={toggle}>Property Investors List</ModalHeader>
        <ModalBody>
            <div className="investor-background">
                <DatatableTables
                    paging={false} 
                    column={PropertyInvestorsList} 
                    row={data} 
                />
            </div>
        </ModalBody>
      </Modal>
    </>
  )
}

export default PropertyInvestors