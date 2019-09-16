import React from 'react';
import './index.scss';

const ListFooter = props => {
  const { empty = false, hasNext = true, emptyContent = '已经没有更多内容啦~' } = props;

  if (empty) {
    return (
      <div className="ks-listview__footer">
        <p className="ks-listview__footer__empty">暂时没有数据哦～</p>
      </div>
    );
  }

  if (hasNext) {
    return (
      <div className="ks-listview__footer">
        <i className="ks-listview__footer__loading" />
        <i className="ks-listview__footer__logo" />
      </div>
    );
  }

  return <div className="ks-listview__footer">{emptyContent}</div>;
};

export default ListFooter;
