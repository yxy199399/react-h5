import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

/**
 * 如果微信中打开没有上一页
 * 返回按钮将会返回首页
 */
history.goBack = (goBack => () => {
  if (history.length <= 1) {
    history.push('/');
  } else {
    goBack();
  }
})(history.goBack);

export default history;
