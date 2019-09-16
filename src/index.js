import 'react-app-polyfill/ie9';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import { Toast } from 'antd-mobile';
import qs from 'qs';
import * as serviceWorker from './serviceWorker';

/**
 * 将Toast.info的默认持续时间修改为1.5秒
 */
Toast.info = (info => (content, duration = 1.5, mask) => info(content, duration, mask))(Toast.info);

/**
 * 如果url的参数中带有vconsole
 * 则动态得创建vconsole调试窗口
 */
const query = qs.parse(window.location.search, { ignoreQueryPrefix: true });
if (query.vconsole) {
  import('vconsole').then(VConsole => {
    new VConsole.default();
  });
}

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
