import React from 'react';
import cs from 'classnames';
import { useSetState } from 'react-use';
import { Toast } from 'antd-mobile';

import Api from 'src/utils/Api';
import './index.scss';
import { useStore } from 'easy-peasy';

const FollowBtn = props => {
  const { isFollow, uid, className, ...rest } = props;
  const auth = useStore(store => store.auth);
  const [state, setState] = useSetState({
    isFollow,
    busy: false
  });

  const handleFollow = async evt => {
    evt.stopPropagation();
    evt.preventDefault();

    if (!uid || state.busy) return;

    try {
      setState({ busy: true });
      const res = await Api.post('/other/changefollow', { uid });
      setState({ isFollow: !state.isFollow, busy: false });
      Toast.info(res.msg);
    } catch {
      setState({ busy: false });
    }
  };

  if (auth.isLogin && auth.userInfo.uid === uid) {
    return null;
  }

  return (
    <div
      className={cs(
        'ks-follow-btn',
        {
          'ks-follow-btn--active': state.isFollow
        },
        className
      )}
      onClick={handleFollow}
      {...rest}
    >
      + {state.isFollow ? '已关注' : '关注'}
    </div>
  );
};

export default FollowBtn;
