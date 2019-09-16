import { useRef } from 'react';
import { useSetState, useUnmount } from 'react-use';
import { Toast } from 'antd-mobile';

import Validator from '../utils/Validator';
import Api from '../utils/Api';

/**
 * 获取验证码
 * @param {Number} max 请求短信间隔时间（秒）
 *
 * 属性:
 * state.delay        请求间隔倒计时
 * state.rediskey     服务器rediskey
 *
 * 方法:
 * actions.fetchCaptcha  请求验证码
 *
 */
const useCaptcha = (max = 60) => {
  const timerRef = useRef();
  const [state, setState] = useSetState({ delay: 0, rediskey: '' });

  useUnmount(() => {
    clearInterval(timerRef.current);
  });

  // 获取验证码
  const fetchCaptcha = async phone => {
    if (state.delay > 0) return;
    if (!Validator.isMobilePhone(phone)) return Toast.info('请输入有效手机号码');

    let crt = max;
    setState({ delay: crt });
    timerRef.current = setInterval(() => {
      setState({ delay: --crt });
      if (crt <= 0) return clearInterval(timerRef.current);
    }, 1000);

    try {
      let res = await Api.post('/user/h5PhoneCaptcha', { phone });
      setState({ rediskey: res.rediskey });
    } catch {
      clearInterval(timerRef.current);
      setState({ delay: 0 });
    }
  };

  if (max < 0) throw new Error('间隔时间不能小于0');

  return [state, { fetchCaptcha }];
};

export default useCaptcha;
