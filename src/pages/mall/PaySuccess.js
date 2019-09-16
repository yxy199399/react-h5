import React from 'react';
import { Link } from 'react-router-dom';
import { Modal } from 'antd-mobile';
import { useSetState } from 'react-use';
import qs from 'qs';

import NavBar from 'src/components/Nav/NavBar';
import Api from 'src/utils/Api';
import './PaySuccess.scss';

const PaySuccess = props => {
  const query = qs.parse(props.location.search, { ignoreQueryPrefix: true });
  // 来源页
  const referrer = query.referrer ? decodeURIComponent(query.referrer) : '/';
  // 订单类型
  const type = query.type;
  // 是否需要手动确认支付结果
  const confirm = query.confirm;
  // 订单ID
  const order = query.order;

  const [state, setState] = useSetState({
    finish: false,
    busy: false
  });

  /**
   * 跳转页面
   * @param {String} url
   */
  const goTo = url => () => {
    props.history.push(url);
  };

  /**
   * 根据订单ID检查是否已经支付完成
   */
  const checkOrderStatus = async () => {
    if (state.busy) return;

    try {
      setState({ busy: true });
      await Api.get('/pay/status', { params: { order_no: order } });
      setState({ finish: true, busy: false });
    } catch {
      setState({ busy: false });
    }
  };

  /**
   * 如果location.search.confirm有值
   * 说明需要手动确认支付是否完成
   * 确认完毕之后才会显示成功页面
   */
  if (confirm && !state.finish) {
    return (
      <div className="pay-confirm">
        <Modal
          visible={true}
          transparent
          maskClosable={false}
          title="请确认支付是否已经完成"
          footer={[
            { text: '重新下单', onPress: goTo(referrer) },
            { text: state.busy ? '确认中...' : '已完成支付', onPress: checkOrderStatus }
          ]}
        />
      </div>
    );
  }

  return (
    <div className="pay-success">
      <NavBar title="支付成功" left={<NavBar.Icon type="back" onClick={goTo('/')} />} />
      <i className="pay-success__icon" />
      <h3 className="pay-success__title">支付成功</h3>
      {type === 'activity' && <p className="pay-success__info">请注意查收短信中的活动码</p>}
      <Link to={referrer} className="pay-success__btn">
        确定
      </Link>
    </div>
  );
};

export default PaySuccess;
