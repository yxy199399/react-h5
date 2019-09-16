import React from 'react';

import HeaderBar from 'src/components/HeaderBar';

import './AddressList.scss';
import { useActions } from 'easy-peasy';
import { useMount } from 'react-use';

const AddressList = props => {
  const addressActions = useActions(actions => actions.address);

  useMount(() => {
    addressActions.fetchList();
  });

  return (
    <div className="address-picker">
      <HeaderBar title="收货信息" />
      <div className="address-picker__list">
        <div className="address-picker__item">
          <i className="address-picker__item__check" />
          <div className="address-picker__item__info">
            <div className="address-picker__item__title">章三 123123123</div>
            <div className="address-picker__item__desc">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Perferendis nulla veniam
              quibusdam ea animi veritatis velit aut, aperiam inventore, reprehenderit ipsa eius ad
              id atque nobis quidem est ab tempora.
            </div>
          </div>
          <div className="address-picker__item__side">编辑</div>
        </div>
      </div>

      <div className="address-picker__btn">+ 添加收货地址</div>
    </div>
  );
};

export default AddressList;
