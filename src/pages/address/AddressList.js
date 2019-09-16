import React from 'react';
import { useMount, useSetState, useSessionStorage } from 'react-use';
import { Link } from 'react-router-dom';
import { Toast } from 'antd-mobile';

import NavBar from 'src/components/Nav/NavBar';
import './AddressList.scss';

import Api from 'src/utils/Api';

const AddressList = props => {
  const setAddress = useSessionStorage('address', null)[1];
  const [state, setState] = useSetState({
    list: []
  });
  const fetchList = async () => {
    Toast.loading('加载中');
    const res = await Api.get('/addresses/list');
    setState({ list: res.data });
    Toast.hide();
  };

  useMount(() => {
    fetchList();
  });

  const handlePick = item => evt => {
    setAddress(item);
    props.history.goBack();
  };

  const isSelected = item => {
    const pick = props.location.state && props.location.state.pick;
    if (pick) {
      return item.address_id === pick;
    } else {
      return !!item.default;
    }
  };

  return (
    <div className="address-picker">
      <NavBar title="收货信息" />
      <div className="address-picker__list">
        {state.list.map(item => (
          <div className="address-picker__item" key={item.address_id} onClick={handlePick(item)}>
            {isSelected(item) && <i className="address-picker__item__check" />}
            <div className="address-picker__item__info">
              <div className="address-picker__item__title">
                {item.conducts} {item.telphone}
              </div>
              <div className="address-picker__item__desc">
                {item.province + item.city + item.area + item.detail}
              </div>
            </div>
            <Link
              onClick={evt => evt.stopPropagation()}
              to={{
                pathname: `/address/${item.address_id}`,
                state: {
                  name: item.conducts,
                  phone: item.telphone,
                  city: [item.province_id, item.city_id, item.area_id],
                  address: item.detail,
                  default: !!item.default
                }
              }}
              className="address-picker__item__side"
            >
              编辑
            </Link>
          </div>
        ))}
      </div>

      <Link to="/address/add" className="address-picker__btn">
        + 添加收货地址
      </Link>
    </div>
  );
};

export default AddressList;
