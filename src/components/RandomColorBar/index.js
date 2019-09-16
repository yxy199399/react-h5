import React, { useRef } from 'react';
import cs from 'classnames';

import Tools from '../../utils/Tools';
import './index.scss';

const RandomColorBar = props => {
  let randomRef = useRef(Tools.getRandomInt(1, 8));
  let { type, className, ...rect } = props;
  let idx = type || randomRef.current;

  return <i className={cs(`ks-random-bar ks-random-bar-${idx}`, className)} {...rect} />;
};

export default RandomColorBar;
