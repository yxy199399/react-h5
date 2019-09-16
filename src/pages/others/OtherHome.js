import React from 'react';
import { useMount, useSetState } from 'react-use';

import NormalHome from 'src/pages/others/other/OtherHome';
import BusinessHome from 'src/pages/others/businessOther/BusinessHome';

import Api from 'src/utils/Api';
import { Toast } from 'antd-mobile';
import { UserType } from 'src/utils/Constant';

const OtherHome = props => {
  const uid = props.match.params.uid;
  const [state, setState] = useSetState({
    data: null
  });

  const fetchUserInfo = async () => {
    Toast.loading('加载中...');
    const res = await Api.post('/other/user/info', { uid });
    setState({ data: res.data });
    Toast.hide();
    return res;
  };

  useMount(() => {
    fetchUserInfo();
  });

  if (!state.data) {
    return null;
  } else if (state.data.user_type === UserType.NORMAL) {
    return <NormalHome uid={uid} data={state.data} />;
  } else {
    return <BusinessHome history={props.history} uid={uid} data={state.data} />;
  }
};

export default OtherHome;
