import React from 'react';
import cs from 'classnames';
import { useActions } from 'easy-peasy';
import { useMount, useSetState } from 'react-use';
import { ActionSheet, Toast, Modal } from 'antd-mobile';

import NavBar from 'src/components/Nav/NavBar';
import Avatar from 'src/components/Avatar';
import Api from 'src/utils/Api';
import Qiniu from 'src/utils/Qiniu';
import Tools from 'src/utils/Tools';
import './UserSettings.scss';

const UserSettings = () => {
  // const auth = useStore(store => store.auth);
  const authActions = useActions(actions => actions.auth);
  const [state, setState] = useSetState({
    chars: [],
    uif: {}
  });

  useMount(() => {
    fetchUserInfo();
    fetchCharacters();
  });

  // 获取用户信息
  const fetchUserInfo = async () => {
    const res = await Api.post('/web/user/profile');
    setState({ uif: res.data });
  };

  // 获取角色列表
  const fetchCharacters = async () => {
    const res = await Api.get('/occupation');
    setState({ chars: res.data });
  };

  // 选择头像
  const pickAvatar = async () => {
    const files = await Qiniu.choseImages();
    if (!files || !files.length) return;
    Toast.loading('上传中...', 0);
    const avatar = await Qiniu.uploadAndGetUrl(files[0]);
    await Api.post('/updateAvatar', {
      image: avatar.path,
      type: state.uif.user_type
    });
    setState(state => ({ uif: { ...state.uif, avatar: avatar.path } }));
    authActions.update({ avatar: avatar.path }); // auth.userInfo.avatar 需要同步跟新
    Toast.info('修改成功');
  };

  // 选择昵称
  const pickNickname = () => {
    Modal.prompt(
      '请填写用户昵称',
      '',
      [
        { text: '取消' },
        {
          text: '确定',
          onPress: async value => {
            if (!value) return Toast.info('请填写用户昵称！');
            await Api.post('/user/userInfoUpdate', {
              nickname: value
            });
            setState(state => ({
              uif: { ...state.uif, nickname: value }
            }));
            authActions.update({ nickname: value }); // auth.userInfo.nickname 需要同步跟新
          }
        }
      ],
      null,
      state.uif.nickname
    );
  };

  // 选择说明
  const pickDesc = () => {
    Modal.prompt(
      '请填写描述',
      '',
      [
        { text: '取消' },
        {
          text: '确定',
          onPress: async value => {
            if (!value) return Toast.info('请填写用户昵称！');
            await Api.post('/user/userInfoUpdate', {
              signature: value
            });
            setState(state => ({
              uif: { ...state.uif, signature: value }
            }));
          }
        }
      ],
      null,
      state.uif.signature
    );
  };

  // 选择职业
  const pickCharacter = () => {
    const { chars } = state;
    if (!chars.length) return;

    ActionSheet.showActionSheetWithOptions(
      {
        options: [...chars.map(n => n.name), '取消'],
        cancelButtonIndex: chars.length,
        destructiveButtonIndex: chars.length
      },
      idx => {
        if (idx === chars.length) return;
        const item = chars[idx];
        Api.post(
          '/user/userInfoUpdate',
          {
            occupation_id: item.id,
            occupation: item.name
          },
          { _toast: true }
        );
        setState(state => ({
          uif: { ...state.uif, occupation_id: item.id, occupation: item.name }
        }));
      }
    );
  };

  return (
    <div className="user-setting">
      <NavBar title="基本资料" />

      <div className="user-setting-list">
        <div className="user-setting-list__item" onClick={pickAvatar}>
          <div className="user-setting-list__item__left">头像</div>
          <div className="user-setting-list__item__right">
            <Avatar
              className="user-setting-list-avatar"
              src={Tools.resolveAsset(state.uif.avatar)}
            />
          </div>
          <i className="user-setting-list__item__arrow" />
        </div>
        <div className="user-setting-list__item" onClick={pickNickname}>
          <div className="user-setting-list__item__left">昵称</div>
          <div className="user-setting-list__item__right">{state.uif.nickname}</div>
          <i className="user-setting-list__item__arrow" />
        </div>
        <div className="user-setting-list__item" onClick={pickDesc}>
          <div className="user-setting-list__item__left">一句话描述</div>
          <div
            className={cs('user-setting-list__item__right ', {
              'user-setting-list__item__right--muted': !state.uif.signature
            })}
          >
            {state.uif.signature}
          </div>
          <i className="user-setting-list__item__arrow" />
        </div>
        <div className="user-setting-list__item" onClick={pickCharacter}>
          <div className="user-setting-list__item__left">职业</div>
          <div
            className={cs('user-setting-list__item__right', {
              'user-setting-list__item__right--muted': !state.uif.occupation
            })}
          >
            {state.uif.occupation || '未填写'}
          </div>
          <i className="user-setting-list__item__arrow" />
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
