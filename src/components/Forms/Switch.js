import React, { useEffect } from 'react';
import cs from 'classnames';

import './Switch.scss';
import { useSetState } from 'react-use';

const Switch = props => {
  const { checked = false, checkedText, unCheckedText, onChange = () => {} } = props;
  const [state, setState] = useSetState({
    checked,
    checkedText,
    unCheckedText
  });

  const toggle = () => {
    setState(state => ({ checked: !state.checked }));
  };

  useEffect(() => {
    onChange(state.checked);
  }, [state.checked]);

  return (
    <div className={cs('ks-switch', { 'ks-switch--checked': state.checked })} onClick={toggle}>
      <div className="ks-switch__text">
        {state.checked ? state.checkedText : state.unCheckedText}
      </div>
      <i className="ks-switch__btn" />
    </div>
  );
};

export default Switch;
