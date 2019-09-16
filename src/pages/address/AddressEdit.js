import React from 'react';
import { useSetState, useSessionStorage } from 'react-use';
import cs from 'classnames';

import NavBar from 'src/components/Nav/NavBar';
import CityPicker2 from 'src/components/Forms/CityPicker2';

import './AddressEdit.scss';
import Api from 'src/utils/Api';
import { Toast, Modal } from 'antd-mobile';
import Validator from 'src/utils/Validator';

const CityPickChild = props => (
  <div className="address-edit-item" onClick={props.onClick}>
    <div className="address-edit-item__label">所在地区</div>
    <div className="address-edit-item__cont">
      <input
        type="text"
        placeholder="请选择所在地区"
        value={props.extra === '请选择所在地区' ? '' : props.extra}
        readOnly={true}
      />
    </div>
    <i className="address-edit-item__arrow" />
  </div>
);

const AddressEdit = props => {
  const id = props.match.params.id;
  const isEdit = id !== 'add';
  const editData = props.location.state;
  const [address, setAddress] = useSessionStorage('address', null);

  const [state, setState] = useSetState({
    name: '',
    phone: '',
    city: [],
    address: '',
    default: false,
    ...editData,
    canChangeDefault: (editData && !editData.default) || !isEdit
    // ...props.location.state,
  });

  const handleInputChange = evt => {
    const name = evt.target.name;
    const value = evt.target.value;
    setState({ [name]: value });
  };

  const setDefault = () => {
    if (state.canChangeDefault) {
      setState(state => ({ default: !state.default }));
    }
  };

  const selectCity = value => {
    setState({ city: value });
  };

  const handleSubmit = async () => {
    const params = {
      conducts: state.name,
      telphone: state.phone,
      province_id: state.city && state.city[0],
      city_id: state.city && state.city[1],
      area_id: state.city && state.city[2],
      detail: state.address
    };

    if (!params.conducts) return Toast.info('请添加收货人姓名');
    if (!Validator.isMobilePhone(params.telphone)) return Toast.info('请添加正确的手机号码');
    if (!params.area_id) return Toast.info('请选择所在地区');
    if (!params.detail) return Toast.info('请添加详细地址');

    Toast.loading('请求中');

    let res = null;

    if (isEdit) {
      params.type = 2;
      params.address_id = id;
      res = await Api.post('/addresses/updateAddress', params);
    } else {
      res = await Api.post('/addresses/add', params);
    }

    if (state.canChangeDefault && state.default) {
      await Api.post('/addresses/updateDefault', { address_id: isEdit ? id : res.new_address_id });
      setAddress(null);
    }

    Toast.info(isEdit ? '修改成功' : '添加成功');
    props.history.goBack();
  };

  const handleDelete = () => {
    Modal.alert('确定要删除吗', null, [
      { text: '取消', onPress: () => {} },
      {
        text: '确定',
        onPress: async () => {
          Toast.loading('删除中');
          await Api.post('/addresses/delete', { address_id: id });
          if (address && address.address_id === id) {
            setAddress(null);
          }
          Toast.info('删除成功');
          props.history.goBack();
        }
      }
    ]);
  };

  return (
    <div className="address-edit">
      <NavBar
        title={isEdit ? '编辑地址' : '添加地址'}
        right={isEdit && <NavBar.Btn onClick={handleDelete}>删除</NavBar.Btn>}
      />
      <div className="address-edit-list">
        <div className="address-edit-item">
          <div className="address-edit-item__label">收货人</div>
          <div className="address-edit-item__cont">
            <input
              type="text"
              placeholder="姓名"
              value={state.name}
              name="name"
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="address-edit-item">
          <div className="address-edit-item__label">联系方式</div>
          <div className="address-edit-item__cont">
            <input
              type="text"
              placeholder="手机号码"
              value={state.phone}
              name="phone"
              onChange={handleInputChange}
            />
          </div>
        </div>

        <CityPicker2 onSelect={selectCity} value={state.city}>
          <CityPickChild />
        </CityPicker2>

        <div className="address-edit-item">
          <div className="address-edit-item__label">详细地址</div>
          <div className="address-edit-item__cont">
            <input
              type="text"
              placeholder="填写具体地址楼栋楼层房间号"
              name="address"
              value={state.address}
              onChange={handleInputChange}
            />
          </div>
        </div>
        {state.canChangeDefault && (
          <div className="address-edit-item" onClick={setDefault}>
            <div className="address-edit-item__label">设为默认地址</div>
            <div className="address-edit-item__cont" />
            <i
              className={cs('address-edit-item__check', {
                'address-edit-item__check--active': state.default
              })}
            />
          </div>
        )}
      </div>

      <div className="address-edit-btn" onClick={handleSubmit}>
        确定
      </div>
    </div>
  );
};

export default AddressEdit;
