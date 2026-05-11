import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getPaymentMethods } from 'store/actions';

const paymentMethodsList = () => {
  const { paymentMethods } = useSelector(state => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPaymentMethods());
  }, []);

  return {
    data: paymentMethods?.data
      ?.slice(0)
      .reverse()
      .filter(item => !item.isHidden)
      .map(payment => ({
        id: payment?._id,
        name: payment?.method,
        subtitle: payment?.subHeading,
        tagline: payment?.description,
        canDeposit: payment?.canDeposit,
        canWithdraw: payment?.canWithdraw,
        status: payment?.isHidden,
        Image: payment?.icon,
        alt: payment?.method,
        key: payment?.type,
        disabled: false,
        disableMsg: 'Coming soon!',
      })),
  };
};

export default paymentMethodsList;
