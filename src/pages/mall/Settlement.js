import React, { useRef } from 'react';
import cs from 'classnames';
import { useSetState, useSessionStorage, useMount } from 'react-use';
import { Link } from 'react-router-dom';
import { Toast } from 'antd-mobile';

import Image from 'src/components/Image';
import NavBar from 'src/components/Nav/NavBar';
import CheckOpenId from 'src/components/CheckOpenId';

import './Settlement.scss';
import { UserType } from 'src/utils/Constant';
import Tools from 'src/utils/Tools';
import Api from 'src/utils/Api';

const Settlement = props => {
  const divRef = useRef();
  const [address] = useSessionStorage('address', null);
  const [state, setState] = useSetState({
    payment: '',
    amount: 0,
    goods: []
  });

  const fetchData = async () => {
    Toast.loading('载入中');
    const res = await Api.get('/shoppingCart/balanceDetail');
    Toast.hide();
    let amount = 0;
    const goods = [];
    res.data
      .sort((a, b) => (a.user_id < b.user_id ? -1 : 1))
      .forEach((item, idx) => {
        let last = goods[goods.length - 1];

        if (!last || last.id !== item.user_id) {
          goods.push({
            id: item.user_id,
            name: item.nickname,
            type: item.user_type,
            children: []
          });
        }

        last = goods[goods.length - 1];

        last.children.push({
          id: idx,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          cover: Tools.resolveAsset(
            item.show_picture && item.show_picture[0] && item.show_picture[0].path,
            '?imageView2/2/w/180/h/180'
          )
        });

        amount += item.price * item.quantity;
      });

    setState({ goods, amount });
  };

  // 获取可用支付方式
  const getPayments = () => {
    const payments = [];
    if (!Tools.isAlipayBrowser()) {
      payments.push({ key: 'wechat', name: '微信支付' });
    }

    if (!Tools.isWxBrowser()) {
      payments.push({ key: 'alipay', name: '支付宝支付' });
    }

    return payments;
  };

  // 选择支付方式
  const chosePayType = payment => evt => {
    setState({ payment });
  };

  // 支付操作
  const handlePay = async () => {
    const origin = window.location.origin;
    const referrer = encodeURIComponent('/goods');
    const isWx = Tools.isWxBrowser();
    const returnUrl = `/pay-success?referrer=${referrer}&type=goods`;

    if (!state.payment) return Toast.info('请选择支付方式');

    if (state.payment === 'wechat') {
      if (isWx) {
        const params = {
          h5: 2,
          return_url: returnUrl,
          address: address.address_id,
          openid: sessionStorage.getItem('openid')
        };
        Toast.loading('支付中...');
        const res = await Api.post('/pay/weChatUrl', params);
        Toast.hide();
        window.WeixinJSBridge.invoke('getBrandWCPayRequest', res.result, res => {
          if (res.err_msg === 'get_brand_wcpay_request:ok') {
            props.history.push(returnUrl);
          } else {
            Toast.info('支付失败');
          }
        });
      } else {
        const params = {
          h5: 1,
          return_url: origin + returnUrl + '&confirm=true',
          address: address.address_id
        };
        const res = await Api.post('/pay/weChatUrl', params);
        window.location.href = res.url;
      }
    } else if (state.payment === 'alipay') {
      const params = {
        pay_type: 1,
        return_url: origin + returnUrl,
        address: address.address_id
      };
      const res = await Api.post('/pay/alipay', params);
      // 跳转支付页面
      divRef.current.innerHTML = res.url;
      // eslint-disable-next-line
      eval(`document.forms['alipaysubmit'].submit();`);
    }
  };

  useMount(() => {
    fetchData();
  });

  return (
    <CheckOpenId>
      <div className="sett-page">
        <NavBar title="结算" />

        {/* 地址 */}
        <Link
          className="sett-addr"
          to={{
            pathname: '/address',
            state: { pick: address ? address.address_id : false }
          }}
        >
          <i className="sett-addr__icon" />
          <div className="sett-addr__info">
            {address ? (
              <>
                <div className="sett-addr__title">
                  {address.conducts} {address.telphone}
                </div>
                <p className="sett-addr__desc">
                  {address.province}
                  {address.city}
                  {address.area}
                  {address.detail}
                </p>
              </>
            ) : (
              <div className="sett-addr__empty">选择收货地址</div>
            )}
          </div>
          <b className="sett-addr__arrow" />
        </Link>

        {/* 商品列表 */}
        <div className="sett-goods">
          {state.goods.map(company => (
            <React.Fragment key={company.id}>
              <div className="sett-goods__seller">
                <span>{company.name}</span>
                {company.type === UserType.BUSINESS && <i className="kip" />}
                {company.type === UserType.PROFESSIONAL && <i className="kip kip-sel" />}
              </div>

              {company.children.map(item => (
                <div className="sett-goods-item" key={item.id}>
                  <Image className="sett-goods-item__cover" src={item.cover} />
                  <div className="sett-goods-item__info">
                    <div className="sett-goods-item__title">{item.title}</div>
                    <div className="sett-goods-item__meta">
                      <div className="sett-goods-item__num">x{item.quantity}</div>
                      <div className="sett-goods-item__price">
                        <small>单价：</small>
                        <span>&yen;{item.price}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))}

          <div className="sett-goods__footer">
            <span>应付总额</span>
            <span>&yen;{state.amount}</span>
          </div>
        </div>

        <div className="sett-pay">
          {getPayments().map(item => (
            <div
              className={cs('sett-pay__item', {
                'sett-pay__item--active': state.payment === item.key
              })}
              key={item.key}
              onClick={chosePayType(item.key)}
            >
              <i className={cs('sett-pay__icon', `sett-pay__icon--${item.key}`)} />
              <div className="sett-pay__name">{item.name}</div>
              <i className="sett-pay__check" />
            </div>
          ))}
        </div>

        <div className="sett-pay-btn" onClick={handlePay}>
          立即支付
        </div>

        <div ref={divRef} style={{ width: 0, height: 0, overflow: 'hidden' }} />
      </div>
    </CheckOpenId>
  );
};

export default Settlement;
