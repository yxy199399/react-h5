import React from 'react';
import './index.scss';

const CustomTitle = props => {
  let { isCourse = false, title } = props;

  return (
    <h2 className="ks-title">
      {isCourse && <small className="ks-title__tag">教程</small>}
      <span className="ks-title__txt">{title}</span>
    </h2>
  );
};

export default CustomTitle;
