import React from 'react';
import cs from 'classnames';
import './index.scss';

const StarLevel = props => {
  let { score = 0, size = 'normal', className, ...rest } = props;
  let arr = [1, 2, 3, 4, 5];
  let css = { fontSize: '.24rem' };

  score = parseInt(score);
  score = Math.max(0, score);
  score = Math.min(10, score);

  if (size === 'mini') {
    css = { fontSize: '.18rem' };
  }

  return (
    <div className={cs('ks-star-lv', className)} style={css} {...rest}>
      {arr.map(i => (
        <i
          key={i}
          className={cs('ks-star-lv__item', {
            'ks-star-lv__item--half': i - 0.5 === score / 2,
            'ks-star-lv__item--empty': i > Math.ceil(score / 2)
          })}
        />
      ))}
    </div>
  );
};

export default StarLevel;
