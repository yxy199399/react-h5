import React from 'react';
import { Link } from 'react-router-dom';
import qs from 'qs';

import NavBar from 'src/components/Nav/NavBar';

import './PublishSuccess.scss';

const PublishSuccess = props => {
  const { title } = qs.parse(props.location.search, { ignoreQueryPrefix: true });
  const _title = title ? decodeURIComponent(title) : '发布结果';

  return (
    <div className="publish-success">
      <NavBar title={_title} />
      <i className="publish-success__icon" />
      <h4 className="publish-success__title">上传成功</h4>
      <p className="publish-success__info">感谢您的上传，系统会尽快进行审核</p>
      <Link to="/" className="publish-success__btn">
        返回主页
      </Link>
    </div>
  );
};

export default PublishSuccess;
