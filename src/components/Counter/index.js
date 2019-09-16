import React, { useEffect } from 'react';
import { useSetState } from 'react-use';
import './index.scss';

const Counter = props => {
  let { number = 1, min = 1, max = null, disabled, onChange = () => {} } = props;
  let [state, setState] = useSetState({
    number
  });

  useEffect(() => {
    onChange(state.number);
  }, [state.number]);

  const set = number => {
    if (min !== null) {
      number = Math.max(min, number);
    }

    if (max !== null) {
      number = Math.min(max, number);
    }

    setState({ number });
  };

  const inc = () => {
    set(state.number + 1);
  };

  const dec = () => {
    set(state.number - 1);
  };

  let incDisabled = disabled || (max !== null && state.number >= max);
  let decDisabled = disabled || (min !== null && state.number <= min);

  return (
    <div className="ks-counter">
      <button className="ks-counter__btn" disabled={decDisabled} onClick={dec} />
      <span className="ks-counter__number">{state.number}</span>
      <button className="ks-counter__btn" disabled={incDisabled} onClick={inc} />
    </div>
  );
};

export default Counter;
