import { action, select } from 'easy-peasy';
import store from 'store';
import expirePlugin from 'store/plugins/expire';

store.addPlugin(expirePlugin);

export default {
  // state
  token: store.get('token') || '',
  isLogin: select(state => !!state.token),
  userInfo: store.get('userInfo') || {},

  // 登录
  login: action((state, payload) => {
    state.token = payload.token;
    state.userInfo = payload.userInfo;
    const expire = new Date().getTime() + 1000 * 60 * 60 * 24;
    store.set('token', state.token, expire);
    store.set('userInfo', state.userInfo, expire);
  }),

  // 登出
  logout: action(state => {
    state.token = '';
    state.userInfo = {};
    store.remove('token');
    store.remove('userInfo');
  }),

  // 更新用户信息
  update: action((state, payload) => {
    state.userInfo = { ...state.userInfo, ...payload };
    store.set('userInfo', state.userInfo);
  })
};
