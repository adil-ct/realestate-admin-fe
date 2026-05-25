/* eslint-disable consistent-return */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classnames from 'classnames';

import { Container, Col, Button, TabContent, NavItem, Nav, TabPane, NavLink } from 'reactstrap';

import {
  getListOfTransactions,
  getWalletBalance,
  GetUserProfile,
  getWalletAddress,
  getMoonpayUrl,
  commonSaga,
} from 'store/actions';

import DepositViaStripe from 'components/UI/Model/authenticationmodals/depositViaStripe';
import DepositQRModal from 'components/UI/Model/authenticationmodals/depositQRCode';
import { withdrawColumn, fiatColumn, transferColumn } from 'constants/tableColumn';
import WalletDepositBankModal from 'components/UI/Model/WalletDepositBankModal';
import WalletWithdrawModal from 'components/UI/Model/WalletWithdrawModal';
import WalletDepositModal from 'components/UI/Model/WalletDepositModal';
import CurrencyFormat from 'components/CurrencyFormat/index';
import DatatableTables from 'components/Table/Table';
import Breadcrumb from 'components/BreadCrumb';

import fiatwallet from '../../assets/images/fiatwallet.png';
import './wallet.css';

const WalletCard = () => {
  const [activeTabJustify2, setactiveTabJustify2] = useState('25');
  const [filter, setFilter] = useState({ page: 1, limit: 10 });
  const [paginationConfig, setPaginationConfig] = useState({});
  const [depositConfirm, setDepositConfirm] = useState(false);
  const [withdrawModal2, setWithdrawModal] = useState(false);
  const [depositStripe, setDepositStripe] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedButton, setSelectedButton] = useState('');
  const [depositBank, setDepositBank] = useState(false);
  const [depositQR, setDepositQR] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [withdraw, setWithdraw] = useState(false);
  const [deposit, setDeposit] = useState(false);
  const [usersData, setUserData] = useState([]);
  const [count, setCount] = useState('');

  const dispatch = useDispatch();
  const { commonData } = useSelector(stateObj => ({
    commonData: stateObj.common,
  }));
  const { transactions, loading, walletBalance, isLoading } = useSelector(state => state.account);

  const withdrawModal = () => {
    setWithdraw(false);
  };

  const loadScripts = url => {
    const script = document.createElement('script');
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
  };

  const depositBankModal = () => {
    switch (selectedOption) {
      case 'usdc':
        dispatch(
          getWalletAddress({
            handleSuccess: () => {
              setDeposit(false);
              setDepositQR(true);
            },
          }),
        );
        break;
      case 'card':
        dispatch(
          getMoonpayUrl({
            handleSuccess: () => {
              setDeposit(false);
              setDepositBank(true);
              // window.open(data, '_blank');
            },
          }),
        );
        break;
      case 'ach':
        dispatch(
          commonSaga({
            endPoint: '/payment/stripe-onramp-sessions',
            type: 'get',
            stateObj: 'stripeState',
            baseEP: 'PAYMENT',
          }),
        );
        break;

      default:
        return false;
    }
  };
  const depositConfirmModal = () => {
    setDepositConfirm(true);
  };

  const getDetails = list => {
    const sdetail = list.map(item => ({
      id: item.id,
      _id: item._id,
      registration_date: item.createdAt ? new Date(item.createdAt).toLocaleString() : '-',
      amount: `$${item.amount.amount}`,
      destination: item?.destination,
      source: item?.source,
      transactionHash: item?.transactionHash,
      fees: item?.fees?.amount ? item?.fees?.amount : '- -',
      status: item.status ? item.status : item?.transferType,
      description:
        item.transactionType === 'Deposit'
          ? item.accountInfo?.medium === 'card'
            ? item.accountInfo?.cardNumber
            : item.accountInfo?.description
          : item.transactionType === 'Withdrawal'
            ? item.source
            : item.propertyName,

      to: item.transactionType === 'Withdrawal' ? item?.destination : 'Bricklane Wallet',
    }));
    return sdetail;
  };

  useEffect(() => {
    dispatch(getWalletBalance());
    dispatch(GetUserProfile());
    loadScripts('https://js.stripe.com/v3/');
    loadScripts('https://crypto-js.stripe.com/crypto-onramp-outer.js');
  }, []);

  useEffect(() => {
    if (commonData?.stripeState?.dataObj) {
      setDeposit(false);
      setDepositStripe(true);
    }
  }, [commonData?.stripeState]);

  const depositData =
    transactions.data?.length > 0
      ? transactions.data?.filter(transaction => transaction.transactionType === 'Deposit')
      : [];

  const withdrawData =
    transactions.data?.length > 0
      ? transactions.data?.filter(transaction => transaction.transactionType === 'Withdrawal')
      : [];

  const transfersData =
    transactions.data?.length > 0
      ? transactions.data?.filter(transaction => transaction.transactionType === 'marketplace')
      : [];

  const updateCurrentCountPage = page => {
    setCount(page);
  };

  /* Pagination Config */
  const onPageChange = page => {
    setCurrentPage(page);
    setFilter(prev => ({ ...prev, page }));
  };

  useEffect(() => {
    let sdetail = '';
    if (activeTabJustify2 === '25') {
      sdetail = getDetails(depositData);
      setUserData(sdetail);
    } else if (activeTabJustify2 === '26') {
      sdetail = getDetails(withdrawData);
      setUserData(sdetail);
    } else {
      sdetail = getDetails(transfersData);
      setUserData(sdetail);
    }

    const paginationConfigTemp = {
      currentPage,
      pageCount: Math.ceil(transactions?.totalCount / 10),
      count,
      itemCount: transactions?.totalCount,
      onPageChange,
      updateCurrentCountPage,
    };
    setPaginationConfig(paginationConfigTemp);
  }, [transactions, activeTabJustify2]);

  function toggleCustomJustified2(tab) {
    if (activeTabJustify2 !== tab) {
      onPageChange(1);
      setactiveTabJustify2(tab);
    }
  }

  const onClickMerchantHandler = () => {
    setSelectedButton('merchant');
    setDeposit(true);
  };

  const onClickWithdrawHandler = () => {
    setSelectedButton('');
    setWithdraw(true);
  };

  const onClickDepositHandler = () => {
    setSelectedButton('');
    setDeposit(true);
  };

  const backBtnHandler = () => {
    switch (selectedOption) {
      case 'usdc':
        setDepositQR(false);
        break;
      case 'card':
        setDepositBank(false);
        break;
      case 'ach':
        setDepositStripe(false);
        break;

      default:
        return false;
    }
    setDeposit(true);
  };
  const backBtnHandlerWithdraw = () => {
    setWithdrawModal(false);
    setWithdraw(true);
  };

  const getList = () => {
    if (activeTabJustify2 === '25') {
      dispatch(getListOfTransactions({ type: 'Deposit', currentPage }));
    } else if (activeTabJustify2 === '26') {
      dispatch(getListOfTransactions({ type: 'Withdrawal', currentPage }));
    } else {
      dispatch(getListOfTransactions({ type: 'transfers', currentPage }));
    }
  };

  useEffect(() => {
    getList();
  }, [JSON.stringify(filter)]);

  useEffect(() => {
    getList();
  }, [activeTabJustify2]);

  return (
    <>
      <div className="page-content">
        <Breadcrumb name="Fiat Wallet" />
        <Col
          xl={12}
          md={12}
          sm={12}
          xs={12}
          className="wallet-card d-flex justify-content-between border-wallet p-3"
        >
          <div />
          <div className="flexCenter">
            <div className="balanceBox">
              <div className="euro">
                <img src={fiatwallet} alt="Euro" />
              </div>
              <div className="text-center euro-text">
                <div className="header f600 font-size-14">USD Available</div>
                <div className="primary f600 font-size-24">
                  {isLoading.walletBalance ? (
                    '$0'
                  ) : (
                    <CurrencyFormat prefix="$" value={walletBalance?.availableBalance || 0} />
                  )}
                </div>
              </div>
            </div>
            <div className="balanceBox">
              <div className="euro">
                <img src={fiatwallet} alt="Euro" />
              </div>
              <div className="text-center euro-text">
                <div className="header f600 font-size-14">Platform Rewards</div>
                <div className="primary f600 font-size-24">
                  {isLoading.walletBalance ? (
                    '$0'
                  ) : (
                    <CurrencyFormat prefix="$" value={walletBalance?.credits || 0} />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="fiat-wallet-button p-3">
              <Button
                type="button"
                className="button__secondary w-100 m-1"
                onClick={onClickWithdrawHandler}
              >
                Withdraw
              </Button>
              <Button
                type="button"
                className="button__primary w-100 m-1"
                onClick={onClickDepositHandler}
              >
                Deposit
              </Button>

              <Button
                type="button"
                className="button__primary w-100 m-1"
                onClick={onClickMerchantHandler}
              >
                Deposit Merchant
              </Button>
            </div>
          </div>

          {withdraw && (
            <WalletWithdrawModal
              isOpen={withdraw}
              close={() => setWithdraw(false)}
              modal={() => withdrawModal()}
              setSelectedOption={setSelectedOption}
              selectedOption={selectedOption}
              withdrawModalHandler={() => setWithdrawModal(true)}
              withdrawModal2={withdrawModal2}
            />
          )}

          {withdrawModal2 && (
            <WalletWithdrawModal
              isOpen={false}
              close={() => setWithdrawModal(false)}
              modal={() => withdrawModal()}
              setSelectedOption={setSelectedOption}
              selectedOption={selectedOption}
              withdrawModalHandler={() => setWithdrawModal(true)}
              withdrawModal2={withdrawModal2}
              backBtn={backBtnHandlerWithdraw}
            />
          )}

          {deposit && (
            <WalletDepositModal
              isOpen={deposit}
              close={() => setDeposit(false)}
              modal={() => depositBankModal()}
              selectedOptionHandler={setSelectedOption}
              selectedOption={selectedOption}
            />
          )}
          {depositBank && (
            <WalletDepositBankModal
              isOpen={depositBank}
              close={() => setDepositBank(false)}
              confirm={() => depositConfirmModal()}
              selectedOptionFiat={selectedOption}
              depositConfirm={depositConfirm}
              selectedButton={selectedButton}
              backBtn={backBtnHandler}
            />
          )}
          {<DepositQRModal isOpen={depositQR} onClose={setDepositQR} backBtn={backBtnHandler} />}
          {
            <DepositViaStripe
              isOpen={depositStripe}
              onClose={setDepositStripe}
              backBtn={backBtnHandler}
              clientSecret={commonData?.stripeState?.dataObj?.client_secret}
            />
          }
        </Col>
        <Container fluid>
          <div className="table-background">
            <Nav pills className="nav-justified bg-light p-2">
              <NavItem className="waves-effect waves-light">
                <NavLink
                  className={classnames({
                    active: activeTabJustify2 === '25',
                  })}
                  onClick={() => {
                    toggleCustomJustified2('25');
                  }}
                >
                  <span className="d-sm-block">Deposit</span>
                </NavLink>
              </NavItem>
              <NavItem className="waves-effect waves-light">
                <NavLink
                  className={classnames({
                    active: activeTabJustify2 === '26',
                  })}
                  onClick={() => {
                    toggleCustomJustified2('26');
                  }}
                >
                  <span className="d-sm-block">Withdraw</span>
                </NavLink>
              </NavItem>
              <NavItem className="waves-effect waves-light">
                <NavLink
                  className={classnames({
                    active: activeTabJustify2 === '27',
                  })}
                  onClick={() => {
                    toggleCustomJustified2('27');
                  }}
                >
                  <span className="d-sm-block">Transfers</span>
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={activeTabJustify2} className="p-3 text-muted">
              <TabPane tabId="25">
                <DatatableTables
                  column={fiatColumn}
                  customise
                  row={loading ? 'loading' : usersData}
                  paginationConfig={paginationConfig}
                  paging={false}
                />
              </TabPane>
              <TabPane tabId="26">
                <DatatableTables
                  customise
                  column={withdrawColumn}
                  row={loading ? 'loading' : usersData}
                  paginationConfig={paginationConfig}
                  paging={false}
                />
              </TabPane>
              <TabPane tabId="27">
                <DatatableTables
                  column={transferColumn}
                  row={loading ? 'loading' : usersData}
                  paginationConfig={paginationConfig}
                  paging={false}
                />
              </TabPane>
            </TabContent>
          </div>
        </Container>
      </div>
    </>
  );
};
export default WalletCard;
