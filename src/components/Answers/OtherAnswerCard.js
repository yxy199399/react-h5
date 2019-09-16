import React from 'react';
import cs from 'classnames';

import './OtherAnswerCard.scss';

class OtherAnswerCard extends React.PureComponent {
  render() {
    let { title, info, battery, createDate } = this.props;
    return (
      <div className={cs('ks-other-answer-card')}>
        <div className="ks-other-answer-card__title">{title}</div>
        <p className="ks-other-answer-card__info">{info}</p>
        <div className="ks-other-answer-card__footer">
          <span className="ks-other-answer-card__power">{battery}</span>
          <span className="ks-other-answer-card__date">{createDate}</span>
        </div>
      </div>
    );
  }
}

OtherAnswerCard.defaultProps = {
  title: '',
  info: '',
  battery: 0,
  createDate: ''
};

export default OtherAnswerCard;
