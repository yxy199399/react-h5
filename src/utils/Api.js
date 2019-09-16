import axios from 'axios';
import { Toast } from 'antd-mobile';
import history from 'src/history';
import store from 'src/store';

/**
 * 用于标记res.code === 200的错误
 */
class ApiError extends Error {
  constructor(data, config) {
    super(data.msg);
    this.data = data;
    this.config = config;
    this.name = ApiError.name;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * 全局ajax封装
 * 使用文档参考 {@link https://github.com/axios/axios}
 * `config._toast` 为 `false` 时禁止弹出提示框
 *
 * @example
 * const res = await Api.post('/foo', { size: 10, page: 2 })
 */
const Api = axios.create({
  baseURL: process.env.REACT_APP_API_HOST,
  timeout: +process.env.REACT_APP_API_TIMEOUT
});

Api.interceptors.request.use(config => {
  let token = store.getState().auth.token;
  if (token) config.headers.Authorization = 'Bearer ' + token;
  return config;
});

Api.interceptors.response.use(resp => {
  let data = resp.data;

  // 打印后台返回的数据
  if (process.env.NODE_ENV !== 'production') {
    let method = resp.config.method.toUpperCase();
    let url = resp.config.url.split('/api/').pop();
    console.groupCollapsed(`%c${method}:`, 'color: green', '/api/' + url);
    console.log(data);
    console.groupEnd();
  }

  if (data.code === 200) {
    return data;
  } else {
    throw new ApiError(data, resp.config);
  }
});

Api.interceptors.response.use(null, err => {
  let msg = '';
  let showToast = (err && err.config && err.config._toast) !== false;

  // res.code !== 200
  if (err instanceof ApiError) {
    msg = err.message || '服务器错误，请重试';

    // token无效跳转到登陆页面
    const code = err.data.code;
    if ((code === 1345 || code === 1346) && history.location.pathname !== '/login') {
      history.push({
        pathname: '/login',
        state: { from: history.location }
      });
    }
  }

  // axios 请求错误
  else if (err && err.request instanceof XMLHttpRequest) {
    if (err.code === 'ECONNABORTED') {
      msg = '请求超时，请重试';
    } else if (!err.response && !err.status) {
      msg = '请检查网络设置';
    } else if (err.response && err.response.status === 500) {
      msg = '服务器错误，请重试';
    } else {
      msg = '发生错误，请重试';
    }
  }

  // axios取消请求
  else if (err instanceof axios.Cancel) {
    msg = '请求已取消';
    showToast = false;
  }

  // 其他错误信息
  else {
    msg = '发生错误，请重试';
  }

  // 弹出错误提示信息
  if (showToast) {
    Toast.info(msg);
  }

  return Promise.reject(msg);
});

const PlainApi = axios.create({
  baseURL: process.env.REACT_APP_API_HOST,
  timeout: +process.env.REACT_APP_API_TIMEOUT
});

export { ApiError, PlainApi };
export default Api;
