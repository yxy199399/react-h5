import React from 'react';
import { useSetState, useMount, useSessionStorage } from 'react-use';
import Api from 'src/utils/Api';
import { Modal, Toast } from 'antd-mobile';
import cs from 'classnames';

import NavBar from 'src/components/Nav/NavBar';
import ShoppingItem from 'src/components/Mall/ShoppingItem';

import useAccmul from 'src/hooks/useAccmul';
import useAdd from 'src/hooks/useAdd';
import './ShoppingCart.scss';

const ShoppingCart = props => {
  const setAddress = useSessionStorage('address', null)[1];
  const [state, setState] = useSetState({
    data: {},
    source: [],
    selectList: [],
    seller: false,
    AllSeller: false,
    totalPrice: 0,
    totalNum: 0,
    currentEdit: false
  });

  const handleEdit = async () => {
    let arr = [];
    Object.values(state.data).forEach(n => {
      arr.push(n.selected);
    });
    console.log(arr, 3333);
    await setState(state => {
      const data = {};
      Object.keys(state.data).forEach(key => {
        const item = state.data[key];
        item.editSelected = false;
        item.editChecked.forEach((tmp, index) => {
          item.editChecked[index] = false;
        });
        data[key] = { ...item };
      });
      setState({
        data,
        currentEdit: !state.currentEdit,
        AllSeller: state.currentEdit ? arr.indexOf(false) === -1 : false
      });
    });
  };
  const editButton = (
    <div className="edit-button" onClick={handleEdit}>
      {state.currentEdit ? '完成' : '编辑'}
    </div>
  );

  useMount(() => {
    getShoppingList();
  });

  // 获取列表数据
  const getShoppingList = async () => {
    Toast.loading('加载中...');

    let { data } = await Api.get('/shoppingCart/lists');
    Toast.hide();
    let listObj = {};
    data.forEach(item => {
      let keys = Object.keys(listObj);
      if (keys.indexOf(item.company_name) !== -1) {
        listObj[item.company_name].list.push(item);
        listObj[item.company_name].checked.push(false);
        listObj[item.company_name].editChecked.push(false);
      } else {
        listObj[item.company_name] = {
          list: [item],
          selected: false, // 商家是否被选择
          checked: [false], // 商品是否被选择
          type: item.user_type, // 商家类型
          editSelected: false, // 编辑时商家是否被选择
          editChecked: [false] // 编辑时商品是否被选择
        };
      }
    });
    // console.log(listObj);
    setState({ data: listObj, source: data });
  };

  // 全选
  const selectAll = async () => {
    await setState({ AllSeller: !state.AllSeller });

    await setState(state => {
      const data = {};
      const outKey = state.currentEdit ? 'editSelected' : 'selected';
      const innerKey = state.currentEdit ? 'editChecked' : 'checked';
      Object.keys(state.data).forEach(key => {
        const item = state.data[key];
        item[outKey] = state.AllSeller;
        item[innerKey].forEach((tmp, index) => {
          item[innerKey][index] = state.AllSeller;
        });
        data[key] = { ...item };
      });
      return { data };
    });
    // console.log(state.data);
    calcState();
  };
  // 选择卖家
  const selectSeller = async item => {
    const key = state.currentEdit ? 'editSelected' : 'selected';
    const innerKey = state.currentEdit ? 'editChecked' : 'checked';
    await setState(state => {
      const data = state.data;
      data[item][key] = !data[item][key];
      data[item][innerKey].forEach((tmp, index) => {
        data[item][innerKey][index] = data[item][key];
      });
      return { data };
    });
    // console.log(state.data);
    let arr = [];
    Object.values(state.data).forEach(n => {
      arr.push(n[key]);
    });
    setState({ AllSeller: arr.indexOf(false) === -1 });
    calcState();
  };
  // 选择商品
  const selectProduct = (bool, name, index) => {
    const key = state.currentEdit ? 'editSelected' : 'selected';
    const innerKey = state.currentEdit ? 'editChecked' : 'checked';
    setState(state => {
      let data = state.data;
      data[name][innerKey][index] = bool;
      return { data };
    });
    setState(state => {
      let data = state.data;
      data[name][key] = data[name][innerKey].indexOf(false) === -1;
      return { data: data };
    });
    let arr = [];
    Object.values(state.data).forEach(n => {
      arr.push(n[key]);
    });
    setState({ AllSeller: arr.indexOf(false) === -1 });
    calcState();
  };
  // 计算参数
  const calcState = () => {
    let totalPrice = 0,
      totalNum = 0;
    const innerKey = state.currentEdit ? 'editChecked' : 'checked';
    Object.values(state.data).forEach(item => {
      // console.log(item.checked);
      item.list.forEach((tmp, index) => {
        if (item[innerKey][index] && tmp.stock) {
          totalNum += Number(tmp.quantity);
          totalPrice = useAdd(
            totalPrice,
            Number(useAccmul(tmp.quantity, Number(tmp.price)).toFixed(2))
          ).toFixed(2);
        }
      });
    });
    // if(state.AllSeller){
    //     Object.values(state.data).forEach(item=>{
    //         totalNum+=item.list.length;
    //         item.list.forEach(tmp=>{
    //             totalPrice+=Number((tmp.quantity*Number(tmp.price)).toFixed(2));
    //         })
    //     });
    //     setState({ totalNum, totalPrice})
    // }
    setState({ totalNum, totalPrice });
  };
  // 数量变化
  const changeQuantity = async (quantity, name, index) => {
    if (!quantity) {
      return;
    }
    await setState(state => {
      let data = state.data;
      data[name].list[index].quantity = quantity;
      return { data };
    });
    // console.log(state.data);
    calcState();
  };
  // 删除警告框
  const showDelete = () => {
    Modal.alert('删除', '确定删除该商品吗?', [
      { text: '取消', onPress: () => {}, style: 'default' },
      {
        text: '确定',
        onPress: () => {
          removeCurrent();
        }
      }
    ]);
  };
  // 删除选中项
  const removeCurrent = async () => {
    let arr = [];
    let delIndex = [];
    Object.keys(state.data).forEach(item => {
      state.data[item].list.forEach((tmp, index) => {
        if (state.data[item].editChecked[index]) {
          arr.push(tmp.cart_id);
          delIndex.push({ key: item, index });
        }
      });
    });
    arr.length === 1 && (arr = arr[0]);
    await Api.post('/shoppingCart/delete', { cart_id: arr });
    for (let i = 1; i < delIndex.length; i++) {
      // 按index从大到小排序
      for (let j = 0; j < delIndex.length - i; j++) {
        if (delIndex[j].index <= delIndex[j + 1].index) {
          let obj = delIndex[j];
          delIndex[j] = delIndex[j + 1];
          delIndex[j + 1] = obj;
        }
      }
    }
    await setState(state => {
      let data = state.data;
      delIndex.forEach(item => {
        data[item.key].list.splice(item.index, 1);
        data[item.key].editChecked.splice(item.index, 1);
        if (data[item.key].list.length <= 0) {
          delete data[item.key];
        }
      });
      return { data };
    });
    Object.keys(state.data).length <= 0 && setState({ AllSeller: false });
    calcState();
    handleEdit();
  };
  // 结算
  const closeCount = async () => {
    if (state.totalNum <= 0) {
      return;
    }

    let arr = [];

    Object.keys(state.data).forEach(item => {
      state.data[item].list.forEach((tmp, index) => {
        if (state.data[item].checked[index] && tmp.stock) {
          arr.push(tmp.cart_id);
        }
      });
    });

    const res = await Api.get('/shoppingCart/balance', { params: { cart_id: arr } });
    Toast.info(res.msg);

    const address = res.addresses.find(n => !!n.default) || null;
    setAddress(address);

    props.history.push({
      pathname: '/pay/settlement'
      // state: { goods, amount: res.settlementAmount }
    });
  };
  console.log(state, 6666);
  return (
    <div className="shopping-cart">
      <NavBar title="购物车" right={editButton} />
      {Object.keys(state.data).length <= 0 ? (
        <div className="shopping-cart__list__empty">
          <div className="shopping-cart__list__empty__icon" />
          <p className="shopping-cart__list__empty__txt">购物车空空如也，快去逛逛吧~</p>
        </div>
      ) : (
        <div className="shopping-cart__list">
          {Object.keys(state.data).map((item, index) => {
            // 店铺商品是否均失效或下架
            const isShopEnable = state.data[item].list.every(it => {
              return it.is_down || !it.stock;
            });
            return (
              <div className="shopping-item" key={index}>
                <div className="shopping-item__header">
                  {!state.currentEdit && isShopEnable ? (
                    <span
                      className="shopping-item__header__select"
                      style={{ backgroundColor: '#EBEDF0' }}
                    />
                  ) : (
                    <span
                      className={cs('shopping-item__header__select', {
                        selected: state.data[item].selected || state.data[item].editSelected
                      })}
                      onClick={() => selectSeller(item)}
                    />
                  )}
                  <span className="shopping-item__header__txt">{item}</span>
                  <span
                    className={cs(
                      'shopping-item__header__symbol',
                      { 'shopping-item__header__normal': state.data[item].type >= 3 },
                      { 'shopping-item__header__specialty': state.data[item].type === 2 }
                    )}
                  />
                  <img
                    src={require('../../assets/icon_right.png')}
                    alt=""
                    className="shopping-item__header__icon"
                  />
                </div>
                {state.data[item].list.map((tmp, i) => {
                  return (
                    <ShoppingItem
                      item={tmp}
                      select={selectProduct}
                      quantity={changeQuantity}
                      name={item}
                      index={i}
                      currentEdit={state.currentEdit}
                      checked={state.data[item].checked[i]}
                      editChecked={state.data[item].editChecked[i]}
                      key={i}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
      <div className="shopping-cart__overview">
        <span className="shopping-cart__overview__left">
          <span
            className={cs('shopping-cart__overview__left__select', { selected: state.AllSeller })}
            onClick={selectAll}
          />
          <span className="shopping-cart__overview__left__txt" onClick={selectAll}>
            全选
          </span>
        </span>
        {state.currentEdit ? (
          <div className="shopping-cart__overview__right">
            <div
              className={cs('shopping-cart__overview__right__button', {
                active: state.totalNum > 0
              })}
              onClick={state.totalNum > 0 ? showDelete : () => {}}
            >
              删除
            </div>
          </div>
        ) : (
          <div className="shopping-cart__overview__right">
            <div className="shopping-cart__overview__right__total">
              <span className="shopping-cart__overview__right__total__txt">总计:</span>
              <span className="shopping-cart__overview__right__total__price">
                <span className="price_symbol">&yen;</span>
                {state.totalPrice}
              </span>
            </div>
            <div
              className={cs('shopping-cart__overview__right__button', {
                active: state.totalNum > 0
              })}
              onClick={closeCount}
            >
              结算({state.totalNum})
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;
