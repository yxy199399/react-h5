import React from 'react';
import { useSetState } from 'react-use';
import FixedTab from 'src/components/FixedTab';

import NavBar from 'src/components/Nav/NavBar';
import KsListView from 'src/components/KsListView';
import OrderCard from 'src/components/Order/OrderCard';

import './UserOrder.scss';
import Api from 'src/utils/Api';
import Tools from 'src/utils/Tools';

const tabs = [{ title: '待收货' }, { title: '已完成' }];

const UserOrder = props => {
  const [state, setState] = useSetState({
    curtab: 1 //当前tab：1-待完成，2-已完成
  });
  const { curtab } = state;
  //渲染待收货订单
  const renderOrderWait = item => {
    return (
      <div>
        <OrderCard
          index={item.index}
          orderid={item.order_id}
          nickname={item.product_nickname}
          image={Tools.resolveAsset(item.product_picture)}
          usertype={item.user_type}
          status={item.status}
          title={item.product_title}
          price={Number(item.price)}
          num={item.quantity}
          totalprice={Number(item.total_price)}
          iscomment={item.is_comment}
          refund={item.refund}
          iscomplete={item._iscomplete}
        />
      </div>
    );
  };
  //渲染已完成订单
  const renderOrderAlready = item => {
    return (
      <div>
        <OrderCard
          orderid={item.order_id}
          nickname={item.product_nickname}
          image={Tools.resolveAsset(item.product_picture)}
          usertype={item.user_type}
          status={item.status}
          title={item.product_title}
          price={Number(item.price)}
          num={item.quantity}
          totalprice={Number(item.total_price)}
          iscomment={item.is_comment}
          refund={item.refund}
          iscomplete={item._iscomplete}
        />
      </div>
    );
  };
  //获取待收货订单
  const fetchOrderWait = async page => {
    const data = await Api.post('/web/shopCart/lists', { page });
    data.data.data.forEach(item => {
      item._iscomplete = false;
    });
    // console.log('待收货订单', data);
    return data;
  };
  //获取已完成订单
  const fetchOrderAlready = async page => {
    const data = await Api.post('/web/shopCart/lists', { finish: true, page });
    data.data.data.forEach(item => {
      item._iscomplete = true;
    });
    // console.log('已完成订单', data);
    return data;
  };
  const changeTab = () => {
    if (curtab === 1) {
      setState({ curtab: 2 });
    } else {
      setState({ curtab: 1 });
    }
  };
  return (
    <div className="user-order">
      <NavBar title="我的订单" />
      <FixedTab tabs={tabs} onChange={changeTab}>
        {/* 待收货 */}
        {curtab === 1 && (
          <KsListView fetchData={fetchOrderWait} renderRow={renderOrderWait} useBodyScroll={true} />
        )}
        {/* 已完成 */}
        {curtab === 2 && (
          <KsListView
            fetchData={fetchOrderAlready}
            renderRow={renderOrderAlready}
            useBodyScroll={true}
          />
        )}
      </FixedTab>
    </div>
  );
};

export default UserOrder;
