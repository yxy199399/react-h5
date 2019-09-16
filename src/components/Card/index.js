import React from 'react';
import cs from 'classnames';
import './index.scss';

class Card extends React.PureComponent {
  render() {
    let { title, empty, emptyStr, children, className, ...rest } = this.props;

    return (
      <div className={cs('ks-card', className)} {...rest}>
        {title !== null && <h3 className="ks-card__title">{title}</h3>}
        {empty ? (
          <div className="ks-card__empty">
            <i className="ks-card__empty__icon" />
            <p className="ks-card__empty__info">{emptyStr}</p>
          </div>
        ) : (
          <div className="ks-card__content">{children}</div>
        )}
      </div>
    );
  }
}

// 暂时没有数据哦～
Card.defaultProps = {
  title: null,
  empty: false,
  emptyStr: '暂时没有数据哦～'
};

export default Card;
