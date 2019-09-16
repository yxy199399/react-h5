import React, { useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useStore } from 'easy-peasy';

import Share from 'src/utils/Share';

const CustomRoute = props => {
  const { keys = '', needLogin = false, scrollBack = true, component: Component, ...rest } = props;
  const auth = useStore(store => store.auth);

  useEffect(() => {
    // 跳转页面后自动滚动到顶部
    if (scrollBack) {
      window.scrollTo(0, 0);
    }

    // 更新分享配置信息
    Share.initWxConfig();
    Share.updateShareInfo();
  }, [props.location.pathname]);

  // 私有页面需要登陆之后才能访问
  if (needLogin && !auth.isLogin) {
    return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />;
  }

  return (
    <Route
      render={props => {
        let key = keys.split(',');
        key = key.length ? key.map(k => props.match.params[k] || '').join(',') : '';
        return <Component key={key} {...props} />;
      }}
      {...rest}
    />
  );
};

export default CustomRoute;
