import React from 'react';
import cs from 'classnames';

import './DropMenu.scss';

const DropMenu = props => {
  const {
    data = [],
    show = false,
    mode = 'bottom-left',
    onSelect = () => {},
    className,
    ...rest
  } = props;

  return (
    <div
      className={cs(
        {
          'ks-drop': true,
          'ks-drop--show': show,
          [`ks-drop--${mode}`]: mode
        },
        className
      )}
      {...rest}
    >
      {data.map((item, key) => (
        <div className="ks-drop__item" key={key} onClick={() => onSelect(item)}>
          {!!item.icon && (
            <i className="ks-drop__icon" style={{ backgroundImage: `url("${item.icon}")` }} />
          )}
          <span className="ks-drop__text">{item.name}</span>
        </div>
      ))}
    </div>
  );
};

export default DropMenu;
