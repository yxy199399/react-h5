import React, { useRef } from 'react';
import { useUnmount } from 'react-use';
import { ActionSheet, Toast, Modal } from 'antd-mobile';
import { Link } from 'react-router-dom';

import KsListView from 'src/components/KsListView';
import Image from 'src/components/Image';

import Api from 'src/utils/Api';
import Tools from 'src/utils/Tools';

// 视频卡片
const VideoCard = props => {
  const {
    cover,
    course,
    length,
    title,
    status,
    views,
    date,
    handleAction = null,
    handleAuditing = null,
    handleAuditField = null
  } = props;

  return (
    <div className="upload-video-card">
      <div className="upload-video-card__cover">
        <Image className="upload-video-card__cover__img" src={cover} />
        {course && <span className="upload-video-card__cover__tag">教程</span>}
        <span className="upload-video-card__cover__len">{length}</span>
      </div>

      <div className="upload-video-card__info">
        <div className="upload-video-card__title">{title}</div>
        <div className="upload-video-card__meta">
          {status === 2 && (
            <div
              className="upload-video-card__status upload-video-card__status--2"
              onClick={handleAuditing}
            >
              待审核
            </div>
          )}
          {status === 3 && (
            <div
              className="upload-video-card__status upload-video-card__status--3"
              onClick={handleAuditField}
            >
              未通过
            </div>
          )}
          {status !== 2 && status !== 3 && (
            <>
              <div className="upload-video-card__views">{views}</div>
              <div className="upload-video-card__date">{date}</div>
            </>
          )}

          <div className="upload-video-card__more" onClick={handleAction} />
        </div>
      </div>
    </div>
  );
};

const VideoList = props => {
  const modalRef = useRef();
  const listRef = useRef();

  const fetchVideos = async page => {
    const res = await Api.post('/my/video/list', { page, page_size: 20 });
    res.data.data.forEach(item => {
      item._date = Tools.getTimeAgo(item.created_at);
      item._cover = Tools.resolveAsset(item.cover, '?imageView2/2/w/284/h/160');
      item._video = Tools.resolveAsset(Tools.choseVideoQuality(item.video_url, item.video_type));
      if (!item._cover && item._video) {
        item._cover = Tools.getVideoCover(item._video);
      }

      item._length = Tools.getVideoLenStr(item.video_length);
    });
    return res;
  };

  const renderVideo = item => {
    const disabled = [2, 3].indexOf(item.status) >= 0;
    const card = (
      <VideoCard
        cover={item._cover}
        course={!!item.is_course}
        length={item._length}
        title={item.title}
        status={item.status}
        views={item.view_num}
        date={item._date}
        handleAction={openActionSheet({ id: item.video_id })}
        handleAuditing={alertStatusAuditing}
        handleAuditField={alertStatusAuditField(item.refuse)}
      />
    );

    return item.is_link ? (
      <a href={item.link} key={item.video_id}>
        {card}
      </a>
    ) : (
      <Link
        to={`/videos/${item.video_id}`}
        key={item.video_id}
        onClick={e => disabled && e.preventDefault()}
      >
        {card}
      </Link>
    );
  };

  const openActionSheet = data => evt => {
    evt.stopPropagation();
    evt.preventDefault();

    ActionSheet.showActionSheetWithOptions(
      {
        options: [<div style={{ color: '#1A97FF' }}>删除</div>, '取消'],
        cancelButtonIndex: 1,
        maskClosable: true
      },
      index => {
        if (index === 0) {
          modalRef.current = Modal.alert('确定要删除吗？', null, [
            { text: '取消' },
            {
              text: '删除',
              onPress: () => {
                deleteItem(data.id);
              }
            }
          ]);
        }
      }
    );
  };

  const deleteItem = async video_id => {
    await Api.post('/my/video/delete', { video_id });
    const ref = listRef.current;
    ref.data = ref.data.filter(item => item.video_id !== video_id);
    let dataSource = ref.state.dataSource.cloneWithRows(ref.data);
    ref.setState({ dataSource });

    Toast.info('删除成功');
  };

  const alertStatusAuditing = evt => {
    evt.stopPropagation();
    evt.preventDefault();
    modalRef.current = Modal.alert('正在审核中', '内容还有待审核，系统会尽快处理, 请稍后查看', [
      { text: '知道了' }
    ]);
  };

  const alertStatusAuditField = refuse => evt => {
    evt.stopPropagation();
    evt.preventDefault();
    modalRef.current = Modal.alert('审核未通过', refuse, [{ text: '知道了' }]);
  };

  useUnmount(() => {
    ActionSheet.close();
    modalRef.current && modalRef.current.close();
  });

  return (
    <KsListView
      ref={listRef}
      useBodyScroll={true}
      fetchData={fetchVideos}
      renderRow={renderVideo}
    />
  );
};

export default VideoList;
