import React, { useEffect, useState } from 'react';
import {
  useStripe,
  useElements,
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
} from '@stripe/react-stripe-js';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Col, FormGroup, Input, Label, Modal, ModalBody, Row, Spinner } from 'reactstrap';
import { addCardSaga, getListOfCards } from 'store/actions';

// static imports
import './addCard.css';

const AddCard = ({ modal, handelAddCard }) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);
  const [saveCard, setSaveCard] = useState(false);
  const [errorMessage, setErrorMessage] = useState({
    cardNumber: '',
    cardExpiry: '',
    cvv: '',
  });

  const toggle = () => {
    handelAddCard(false);
  };

  const handleSubmit = async event => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }
    setLoading(true);
    const card = elements.getElement(CardCvcElement, CardExpiryElement, CardNumberElement);
    const result = await stripe.createToken(card);
    if (result.error) {
      toast.error(result.error.message);
    } else {
      dispatch(
        addCardSaga({
          requestBody: {
            sourceToken: result.token.id,
            saveCard,
          },
          handleSuccess: () => {
            toggle();
            dispatch(getListOfCards());
          },
          loader: () => {
            setLoading(false);
          },
        }),
      );
    }
  };

  const cardStyle = {
    style: {
      base: {
        color: '#303238',
        fontSize: '16px',
        '::placeholder': {
          color: '#CFD7DF',
          fontWeight: 400,
        },
      },
      invalid: {
        color: '#e5424d',
        ':focus': {
          color: '#303238',
        },
      },
    },
  };

  useEffect(() => {
    if (!modal) {
      setErrorMessage({
        cardNumber: '',
        cardExpiry: '',
        cvv: '',
      });
    }
  }, [modal]);
  return (
    <>
      <Modal isOpen={modal} toggle={toggle} scrollable>
        <ModalBody className="add-card-modal-body">
          <div>
            <div className="add-card-modal-header-class">
              <button
                type="button"
                onClick={toggle}
                className="modal-colse-btn-black"
                data-dismiss="modal"
                aria-label="Close"
                disabled={isLoading}
              >
                <span aria-hidden="true">&times;</span>
              </button>{' '}
            </div>
            <div>
              <h2 className="add-card-modal-title">Add Card Details</h2>
            </div>
            <div>
              <Row>
                <Col lg="12">
                  <FormGroup className="add-bank-modal-form-label-container">
                    <Label>Card Number</Label>
                    <CardNumberElement
                      id="card-element"
                      className={`form-control ${errorMessage?.cardNumber && 'is-invalid'}`}
                      options={{ ...cardStyle, placeholder: 'Card Number', showIcon: true }}
                      // onChange={e => setErrorMessage({ ...errorMessage, cardNumber: e?.error?.message })}
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup className="add-bank-modal-form-label-container">
                    <Label>Expiry Date</Label>

                    <CardExpiryElement
                      id="card-element"
                      className={`form-control ${errorMessage?.cardExpiry && 'is-invalid'}`}
                      options={cardStyle}
                      // onChange={e => setErrorMessage({ ...errorMessage, cardExpiry: e?.error?.message })}
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup className="add-bank-modal-form-label-container">
                    <Label>CVV</Label>
                    <CardCvcElement
                      id="card-element"
                      className={`form-control ${errorMessage?.cvv && 'is-invalid'}`}
                      options={cardStyle}
                      // onChange={e => setErrorMessage({ ...errorMessage, cvv: e?.error?.message })}
                    />
                  </FormGroup>
                </Col>
                <Col lg="12">
                  <FormGroup className="add-bank-modal-form-label-container">
                    <Input
                      type="checkbox"
                      name="saveCard"
                      className="me-2"
                      onClick={e => {
                        setSaveCard(e.target.checked);
                      }}
                    />
                    I agree to save my debit/credit card information for future use.
                  </FormGroup>
                </Col>

                <div className="add-card-modal-bottom-btn-container">
                  <button
                    type="button"
                    className="add-card-modal-bottom-btn"
                    onClick={toggle}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="add-card-modal-bottom-btn add-card-electric-blue"
                    onClick={handleSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? <Spinner size="sm" /> : 'Add Card'}
                  </button>
                </div>
              </Row>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default AddCard;
