import React from 'react';
import './Spinner.scss';

const Loader = props => {
  const { withoutMargin } = props;
  return <div className={`loader ${withoutMargin ? 'without-margin' : ''}`} />;
};

export default Loader;
