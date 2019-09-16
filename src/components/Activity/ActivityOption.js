import React from 'react';

import iconOther from 'src/assets/icon_option_other.png';

import Api from '../../utils/Api';
import { useMount, useSetState } from 'react-use';

import './ActivityOption.scss';
import Tools from '../../utils/Tools';

const ActivityOption = props => {
  const { onChange = () => {} } = props;

  useMount(() => {
    optionList();
  });

  const [state, setState] = useSetState({
    data: []
  });

  const optionList = async () => {
    const { data } = await Api.post('/category/list', { type: 4, level: 1 });

    data.forEach(item => {
      item._name = item.name;
      item._icon = Tools.resolveAsset(item.images_h5, '?imageView2/2/w/38/h/38');
    });

    setState({ data });
  };

  const choseOtion = (item = null) => evt => {
    onChange(item);
  };

  return (
    <div className="activity-option">
      <div className="activity-option__card" onClick={choseOtion(null)}>
        <img className="activity-option__card-icon" src={iconOther} alt="" />
        <p className="activity-option__card-text">全部</p>
      </div>
      {state.data.map((item, index) => {
        return (
          <div className="activity-option__card" key={index} onClick={choseOtion(item)}>
            <img className="activity-option__card-icon" src={item._icon} alt="" />
            <p className="activity-option__card-text">{item._name}</p>
          </div>
        );
      })}
    </div>
  );
};

export default ActivityOption;
