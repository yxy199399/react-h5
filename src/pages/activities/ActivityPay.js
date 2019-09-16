import React, { useRef } from 'react';
import { useStore, useActions } from 'easy-peasy';
import { useMount, useSetState } from 'react-use';
import { Toast } from 'antd-mobile';
import { Link } from 'react-router-dom';
import cs from 'classnames';
import qs from 'qs';

import Counter from 'src/components/Counter';
import NavBar from 'src/components/Nav/NavBar';
import CheckOpenId from 'src/components/CheckOpenId';

import useCaptcha from 'src/hooks/useCaptcha';
import Api from 'src/utils/Api';
import Validator from 'src/utils/Validator';
import Tools from 'src/utils/Tools';
import './ActivityPay.scss';

const ActivityPay = props => {
  useMount(() => {
    fetchData(active_id);
  });

  const query = qs.parse(props.location.search, { ignoreQueryPrefix: true });
  const active_id = query.id;
  const divRef = useRef();
  const login = useActions(actions => actions.auth.login);
  const auth = useStore(store => store.auth);
  const countryCode = useStore(store => store.countryCode);
  const [captchaState, captchaActions] = useCaptcha();
  const [state, setState] = useSetState({
    data: {},
    isReady: false,
    isPaying: false,
    payType: '',
    phone: '',
    captcha: '',
    quantity: 1
  });

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

  // 获取获取详情
  const fetchData = async active_id => {
    const { data } = await Api.get('/actives/detail', { params: { active_id } });
    setState({ data, isReady: true });
  };

  // 获取验证码
  const handleFetchCode = () => {
    captchaActions.fetchCaptcha(state.phone);
  };

  // 监听数量修改
  const handleQuantityChange = quantity => {
    setState({ quantity });
  };

  // 监听输入框变化
  const handleInputChange = evt => {
    const name = evt.target.name;
    const value = evt.target.value;
    setState({ [name]: value });
  };

  // 修改支付类型
  const changePayType = payType => evt => {
    setState({ payType });
  };

  const createOrder = async () => {
    const params = {
      phone: state.phone,
      rediskey: captchaState.rediskey,
      captcha: state.captcha,
      quantity: state.quantity,
      active_id,
      country_code: countryCode.value
    };

    if (!state.payType) return Toast.info('请选择支付类型');
    if (!Validator.isMobilePhone(params.phone)) return Toast.info('请输入正确的手机号码');
    if (!params.rediskey) return Toast.info('请先获取验证码');
    if (!Validator.isSmsCaptcha(params.captcha)) return Toast.info('请输入正确的验证码');

    const res = await Api.post('/bill/activeNoLoginOrder', params);

    // 登录用户信息
    if (!auth.isLogin && res.token) {
      const token = res.token;
      const userInfo = res.userinfo;
      userInfo.uid = res.uid;
      userInfo.type = res.type;
      login({ token, userInfo });
    }

    return res;
  };

  const handlePay = async () => {
    setState({ isPaying: true });

    try {
      const order = await createOrder();
      const origin = window.location.origin;
      const referrer = encodeURIComponent('/activities/' + active_id);
      const isWx = Tools.isWxBrowser();
      const returnUrl = `/pay-success?referrer=${referrer}&order=${order.order_no}&type=activity`;

      // 免费订单 不需要支付
      if (order.free) {
        props.history.push(returnUrl);
      }

      // 使用支付宝支付
      else if (state.payType === 'alipay') {
        const params = {
          order_no: order.order_no,
          pay_type: 1, // h5支付
          return_url: origin + returnUrl
        };
        const res = await Api.post('/bill/alipay', params);
        // 跳转支付页面
        divRef.current.innerHTML = res.url;
        // eslint-disable-next-line
        eval(`document.forms['alipaysubmit'].submit();`);
      }

      // 微信内部支付
      else if (state.payType === 'wechat') {
        const params = {
          order_no: order.order_no,
          pay_type: isWx ? 2 : 1, // 1: h5 2: jsapi
          openid: sessionStorage.getItem('openid'),
          return_url: origin + returnUrl + '&confirm=true'
        };

        const res = await Api.post('/bill/weChat', params);

        // 微信内部支付
        if (isWx) {
          window.WeixinJSBridge.invoke('getBrandWCPayRequest', res.result, res => {
            if (res.err_msg === 'get_brand_wcpay_request:ok') {
              props.history.push(returnUrl);
            } else {
              Toast.info('支付失败');
              setState({ isPaying: false });
            }
          });
        }

        // 微信外部支付
        else {
          window.location.href = res.url;
        }
      }
    } catch {
      setState({ isPaying: false });
    }
  };

  return (
    <CheckOpenId>
      <div className="activity-pay">
        <NavBar title="报名结算" />

        <h3 className="activity-pay-gutter">
          {state.isReady ? state.data.title : '获取数据中...'}
        </h3>

        <div className="activity-pay-list">
          <div className="activity-pay-list__item">
            <div className="activity-pay-list__label">单价：</div>
            {state.isReady && (
              <div className="activity-pay-list__cont">{state.data.price * 1}元</div>
            )}
          </div>
          <div className="activity-pay-list__item">
            <div className="activity-pay-list__label">数量：{state.quantity}</div>
            <div className="activity-pay-list__cont">
              <Counter
                onChange={handleQuantityChange}
                disabled={!state.isReady}
                max={Math.max(state.data.stock, 1)}
              />
            </div>
          </div>
          <div className="activity-pay-list__item">
            <div className="activity-pay-list__label">应付总价：</div>
            {state.isReady && (
              <div className="activity-pay-list__cont" style={{ color: '#1A97FF' }}>
                {+(state.quantity * state.data.price).toFixed(2)}元
              </div>
            )}
          </div>
        </div>

        <h3 className="activity-pay-gutter">输入手机接收活动码</h3>

        <div className="activity-pay-list">
          <div className="activity-pay-list__item">
            <Link to="/country-code" className="activity-pay-list__country">
              + {countryCode.value}
            </Link>
            <input
              className="activity-pay-list__input"
              type="text"
              placeholder="请输入手机号"
              name="phone"
              value={state.phone}
              onChange={handleInputChange}
            />
            <button
              type="button"
              className="activity-pay-btn activity-pay-btn--code"
              disabled={captchaState.delay}
              onClick={handleFetchCode}
            >
              {captchaState.delay ? `${captchaState.delay}s后重发` : '获取验证码'}
            </button>
          </div>
          <div className="activity-pay-list__item">
            <input
              className="activity-pay-list__input"
              type="text"
              placeholder="请输入短信中的验证码"
              name="captcha"
              value={state.captcha}
              onChange={handleInputChange}
              maxLength={6}
              autoComplete="off"
            />
          </div>
        </div>

        <div className="activity-pay-gutter" />

        <div className="activity-pay-list">
          {getPayments().map(item => (
            <div
              className="activity-pay-list__item"
              key={item.key}
              onClick={changePayType(item.key)}
            >
              <div className="activity-pay-payment">
                <i
                  className={`activity-pay-payment__icon activity-pay-payment__icon--${item.key}`}
                />
                <span className="activity-pay-payment__cont">{item.name}</span>
                <i
                  className={cs('activity-pay-payment__radio', {
                    'activity-pay-payment__radio--sel': state.payType === item.key
                  })}
                />
              </div>
            </div>
          ))}

          {/* <div className="activity-pay-list__item" onClick={changePayType('wechat')}>
            <div className="activity-pay-payment">
              <i className="activity-pay-payment__icon activity-pay-payment__icon--wechat" />
              <span className="activity-pay-payment__cont">微信支付</span>
              <i
                className={cs('activity-pay-payment__radio', {
                  'activity-pay-payment__radio--sel': state.payType === 'wechat'
                })}
              />
            </div>
          </div>

          
          {!Tools.isWxBrowser() && (
            <div className="activity-pay-list__item" onClick={changePayType('alipay')}>
              <div className="activity-pay-payment">
                <i className="activity-pay-payment__icon activity-pay-payment__icon--alipay" />
                <span className="activity-pay-payment__cont">支付宝支付</span>
                <i
                  className={cs('activity-pay-payment__radio', {
                    'activity-pay-payment__radio--sel': state.payType === 'alipay'
                  })}
                />
              </div>
            </div>
          )} */}
        </div>

        <div className="activity-pay-gutter" />

        <button
          type="button"
          className="activity-pay-btn activity-pay-btn--pay"
          onClick={handlePay}
          disabled={!state.isReady || state.isPaying}
        >
          {state.isReady ? (state.isPaying ? '支付中...' : '立即支付') : '加载数据中...'}
        </button>

        <div ref={divRef} style={{ width: 0, height: 0, overflow: 'hidden' }} />
      </div>
    </CheckOpenId>
  );
};

export default ActivityPay;
