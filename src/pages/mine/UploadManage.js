import React from 'react';
import qs from 'qs';

import NavBar from 'src/components/Nav/NavBar';
import StickyTabs from 'src/components/Nav/StickyTabs';

import UploadManageVideo from './UploadManageVideo';
import UploadManageArticle from './UploadManageArticle';
// import UploadManageEncyc from './UploadManageEncyc';
import UploadManageQuestion from './UploadManageQuestion';
import UploadManageAnswer from './UploadManageAnswer';

import './UploadManage.scss';

const tabs = [
  { title: '视频' },
  { title: '文章' },
  // { title: '百科' },
  { title: '问题' },
  { title: '回答' }
];

const UploadManage = props => {
  const query = qs.parse(props.location.search, { ignoreQueryPrefix: true });
  const tabIdx = +query.index || 0;

  const handleTabChange = (tab, index) => {
    props.history.replace('/mine/upload?index=' + index);
  };

  return (
    <div className="upload-manage">
      <NavBar title="上传管理" />
      <StickyTabs page={tabIdx} tabs={tabs} onChange={handleTabChange}>
        <UploadManageVideo />
        <UploadManageArticle />
        {/* <UploadManageEncyc /> */}
        <UploadManageQuestion />
        <UploadManageAnswer />
      </StickyTabs>
    </div>
  );
};

export default UploadManage;
