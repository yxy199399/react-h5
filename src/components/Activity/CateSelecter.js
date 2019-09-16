import React, { useEffect } from 'react';
import { useSetState } from 'react-use';
import cs from 'classnames';

import './CateSelecter.scss';
import iconOther from 'src/assets/icon_option_other.png';

export default props => {
  const { data, onChange = () => {} } = props;
  const [state, setState] = useSetState({
    lv1: null,
    lv2: null
  });

  const handleLv1Change = value => evt => {
    setState({ lv1: value, lv2: null });
  };

  const handleLv2Change = value => evt => {
    setState({ lv2: value });
  };

  useEffect(() => {
    onChange(state.lv1, state.lv2);
  }, [state.lv1, state.lv2]);

  let activeLv1 = data.find(item => item.value === state.lv1);
  let lv1Children = (activeLv1 && activeLv1.children) || [];

  return (
    <div className="cate-selecter">
      <div className="cate-selecter__lv1">
        <div
          className={cs('cate-selecter__lv1__item', {
            'cate-selecter__lv1__item--active': state.active === null
          })}
          onClick={handleLv1Change(null)}
        >
          <img src={iconOther} alt="" />
          <span>全部</span>
        </div>
        {data.map(item => (
          <div
            className={cs({
              'cate-selecter__lv1__item': true,
              'cate-selecter__lv1__item--active': state.lv1 === item.value
            })}
            key={item.key}
            onClick={handleLv1Change(item.value)}
          >
            <img src={item.icon} alt="" />
            <span>{item.name}</span>
          </div>
        ))}
      </div>
      {lv1Children.length > 0 && (
        <div className="cate-selecter__lv2">
          {lv1Children.map(lv2 => (
            <div
              key={lv2.key}
              className={cs({
                'cate-selecter__lv2__item': true,
                'cate-selecter__lv2__item--active': state.lv2 === lv2.value
              })}
              onClick={handleLv2Change(lv2.value)}
            >
              {lv2.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
