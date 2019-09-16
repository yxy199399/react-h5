import React, { useEffect, useRef } from 'react';
import { useActions, useStore } from 'easy-peasy';
import { useSetState, useUnmount } from 'react-use';
import { Toast, Modal } from 'antd-mobile';
import { Link } from 'react-router-dom';
import cs from 'classnames';

import Agreement from 'src/components/Forms/Agreement';
import NavBar from 'src/components/Nav/NavBar';
import useCaptcha from 'src/hooks/useCaptcha';
import Validator from 'src/utils/Validator';
import { PlainApi } from 'src/utils/Api';

import './Login.scss';
// import iconCirCleInfo from 'src/assets/icon_circle_info.png';

const Login = props => {
  const modalRef = useRef();
  const countryCode = useStore(store => store.countryCode);
  const authLogin = useActions(actions => actions.auth.login);
  const [captchaState, captchaActions] = useCaptcha();

  const [state, setState] = useSetState({
    loginType: 'mobile', // 'account' || 'mobile'
    captchaSrc: '',
    agree: false,

    // 冻结状态
    freezeShow: false,
    freezeReason: '',
    freezeTime: 0,

    // 手机登陆
    phone: '',
    captcha: '',
    username: '',
    password: '',
    imgRediskey: ''
  });

  /**
   * 监听文本输入框
   * @param {Event} e
   */
  const handleInputChange = e => {
    let name = e.target.name;
    let value = e.target.value;

    setState({ [name]: value });
  };

  // 获取验证码
  const handleFetchCode = () => {
    captchaActions.fetchCaptcha(state.phone);
  };

  // 切换登录模式
  const toggleLoginType = () => {
    setState(state => ({ loginType: state.loginType === 'mobile' ? 'account' : 'mobile' }));
  };

  // 更新验证码
  const refreshCaptcha = async () => {
    const params = { rediskey: state.imgRediskey };
    const res = await PlainApi.get('/user/imgcaptcha', { params, responseType: 'arraybuffer' });
    const prefix = 'data:' + res.headers['content-type'] + ';base64,';
    const rediskey = res.headers['cache-control'].split(':').pop();
    const src = prefix + Buffer.from(res.data, 'binary').toString('base64');

    setState({ imgRediskey: rediskey, captchaSrc: src });
  };

  /**
   * 登陆
   * @param {Event} e
   */
  const handleSubmit = async e => {
    e.preventDefault();

    // 修复键盘收起之后页面无法回弹，导致弹窗按钮响应区域错误的问题
    window.scrollTo(0, 0);

    try {
      let res = null;

      if (state.loginType === 'mobile') {
        res = await handleLoginByMobile();
      } else {
        res = await handleLoginByAccount();
      }

      // 关闭loading动画
      Toast.hide();

      // 登录成功
      if (res.code === 200) {
        const { uid, token, type, userinfo: userInfo } = res.data;
        uid && (userInfo.uid = uid);
        type && (userInfo.type = type);

        // 保存登录状态
        authLogin({ token, userInfo });

        const state = props.location.state;
        const from = (state && state.from) || '/';
        props.history.replace(from);
      }

      // 账号被封
      else if (res.code === 1625698) {
        modalRef.current = Modal.alert(
          null,
          <div className="page-login-alert">
            <i className="page-login-alert__icon page-login-alert__icon--error" />
            <h4 className="page-login-alert__title">{res.data.disable_type}</h4>
            <p className="page-login-alert__desc">{res.data.msg}</p>
            <p className="page-login-alert__other">
              将被封禁<em>{res.data.disable_end}</em>天
            </p>
          </div>,
          [{ text: '知道了' }]
        );
      }

      // 等待审核
      else if (res.code === 16290414) {
        modalRef.current = Modal.alert(
          null,
          <div className="page-login-alert">
            <i className="page-login-alert__icon page-login-alert__icon--info" />
            <h4 className="page-login-alert__title">账号等待审核</h4>
            <p className="page-login-alert__desc">{res.msg}</p>
          </div>,
          [{ text: '知道了' }]
        );
      }

      // 审核失败
      else if (res.code === 1355) {
        modalRef.current = Modal.alert(
          null,
          <div className="page-login-alert">
            <i className="page-login-alert__icon page-login-alert__icon--error" />
            <h4 className="page-login-alert__title">账号审核失败!</h4>
            <p className="page-login-alert__desc">{res.msg}</p>
          </div>,
          [{ text: '知道了' }]
        );
      }

      // 其他错误
      else {
        Toast.info(res.msg);
      }

      // 刷新验证码
      if (state.loginType === 'account' && res.code !== 200) {
        refreshCaptcha();
      }
    } catch (err) {
      Toast.info((err && err.message) || '登录失败，请重试');

      // 刷新验证码
      if (state.loginType === 'account') {
        refreshCaptcha();
      }
    }
  };

  // 手机号登陆
  const handleLoginByMobile = async () => {
    const params = {
      phone: state.phone,
      captcha: state.captcha,
      country_code: countryCode.value,
      rediskey: captchaState.rediskey,
      platform_type: 3
    };

    if (!Validator.isMobilePhone(params.phone)) throw new Error('请输入有效手机号码');
    if (!params.rediskey) throw new Error('请先获取验证码');
    if (!Validator.isSmsCaptcha(params.captcha)) throw new Error('请输入有效验证码');

    Toast.loading('登录中...');
    const res = await PlainApi.post('/user/h5PhoneLogin', params);

    return res.data;
  };

  // 用户账号登陆
  const handleLoginByAccount = async () => {
    const params = {
      username: state.username,
      password: state.password,
      captcha: state.captcha,
      platform_type: 3, // 3 => h5
      rediskey: state.imgRediskey
    };

    if (!params.username) throw new Error('请输入用户名');
    if (!params.password) throw new Error('请输入密码');
    if (!params.rediskey) throw new Error('请先获取验证码');
    if (!Validator.isImgCaptcha(params.captcha)) throw new Error('请输入有效验证码');

    Toast.loading('登录中...');

    const res = await PlainApi.post('/user/login', params);
    return res.data;
  };

  // 切换协议显示
  const toggleAgreement = (agree = false) => evt => {
    setState({ agree });
  };

  // 刷新验证码
  useEffect(() => {
    if (state.loginType === 'account') {
      refreshCaptcha();
    }
  }, [state.loginType]);

  // 移除modal框
  useUnmount(() => {
    modalRef.current && modalRef.current.close();
  });

  // 用户协议
  if (state.agree) {
    return (
      <Agreement type={state.agree} onConfirm={toggleAgreement()} onBack={toggleAgreement()} />
    );
  }

  return (
    <div className="page-login">
      <NavBar.Icon className="page-login__back" type="back" onClick={props.history.goBack} />
      <h1 className="page-login__title">酷耍</h1>

      <form className="page-login__form" onSubmit={handleSubmit}>
        {/* 手机号登陆 */}
        {state.loginType === 'mobile' && (
          <>
            <div className="page-login__form__group">
              <Link className="page-login__area" to={`/country-code`}>
                + {countryCode.value}
              </Link>
              <input
                type="text"
                className="page-login__form__field"
                name="phone"
                placeholder="请输入手机号"
                onChange={handleInputChange}
                value={state.phone}
              />
            </div>
            <div className="page-login__form__group">
              <input
                type="text"
                className="page-login__form__field"
                name="captcha"
                placeholder="请输入验证码"
                onChange={handleInputChange}
                value={state.captcha}
                autoComplete="off"
                maxLength={6}
              />
              <button
                type="button"
                className="page-login__btn page-login__btn--mini"
                onClick={handleFetchCode}
                disabled={captchaState.delay}
              >
                {captchaState.delay ? `${captchaState.delay}秒后重发` : '获取验证码'}
              </button>
            </div>
          </>
        )}

        {/* 用户名登陆 */}
        {state.loginType === 'account' && (
          <>
            <div className="page-login__form__group">
              <input
                type="text"
                className="page-login__form__field"
                name="username"
                placeholder="请输入账号"
                onChange={handleInputChange}
                value={state.username}
              />
              <i className="page-login__form__icon page-login__form__icon--username" />
            </div>
            <div className="page-login__form__group">
              <input
                type="password"
                className="page-login__form__field"
                name="password"
                placeholder="请输入密码"
                onChange={handleInputChange}
                value={state.password}
              />
              <i className="page-login__form__icon page-login__form__icon--password" />
            </div>
            <div className="page-login__form__group">
              <input
                type="text"
                className="page-login__form__field"
                name="captcha"
                placeholder="验证码"
                onChange={handleInputChange}
                value={state.captcha}
                autoComplete="off"
              />
              <i className="page-login__form__icon page-login__form__icon--captcha" />
              <img
                className="page-login__form__captcha"
                onClick={refreshCaptcha}
                src={state.captchaSrc}
                alt=""
              />
            </div>
          </>
        )}

        <button className="page-login__btn page-login__btn--submit" type="submit">
          登录
        </button>

        <div className="page-login__or">
          <span>Or</span>
        </div>

        <div className="page-login__switch" onClick={toggleLoginType}>
          <i
            className={cs('page-login__switch__icon', {
              'page-login__switch__icon--sel': state.loginType === 'account'
            })}
          />
          {state.loginType === 'mobile' ? '账号登录' : '手机登陆'}
        </div>
      </form>

      <p className="page-login-agree">
        登录表示同意
        <em>
          <span onClick={toggleAgreement('h5_user')}>[ 用户协议]</span>
          {' · '}
          <span onClick={toggleAgreement('privacy_policy')}>[ 隐私政策 ]</span>
        </em>
      </p>
    </div>
  );
};

export default Login;
