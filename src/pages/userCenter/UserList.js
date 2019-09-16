import React from 'react';
import {Link} from 'react-router-dom';
import NavBar from 'src/components/Nav/NavBar';
// import { useStoreActions } from 'easy-peasy';
import {Toast} from 'antd-mobile';
import './UserList.scss';
import rightUrl from '../../assets/icon_right.png';
import Api from 'src/utils/Api';

const UserList = () => {
  // const out = useStoreActions(actions => actions.auth.logout);
  const checkout = async () => {
    const res = await loginout ();
    Toast.hide ();
    if (res.code === 200) {
      // out()
    }
  };
  const loginout = async () => {
    Toast.loading ('退出中...');
    const res = await Api.post ('/user/loginOut', {});
    return res;
  };
  return (
    <div className="user-list">
      <NavBar title="账号管理" />
      <ul className="user-list-ul">
        <Link to="/mine/settings">
          <li>
            <span>基本资料</span>
            <img src={rightUrl} alt="" />
          </li>
        </Link>
      </ul>
      <button className="loginout" onClick={checkout}>
        退出登陆
      </button>
    </div>
  );
};

export default UserList;
