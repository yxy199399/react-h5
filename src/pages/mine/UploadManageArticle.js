import React, { useRef } from 'react';
import { useUnmount } from 'react-use';
import { ActionSheet, Toast, Modal } from 'antd-mobile';
import { Link } from 'react-router-dom';

import KsListView from 'src/components/KsListView';
import Image from 'src/components/Image';

import Api from 'src/utils/Api';
import Tools from 'src/utils/Tools';

// 文章卡片
const ArticleCard = props => {
  const {
    cover,
    course,
    video,
    title,
    status,
    views,
    date,
    handleAction = null,
    handleAuditing = null,
    handleAuditField = null
  } = props;

  return (
    <div className="upload-article-card">
      <div className="upload-article-card__cover">
        <Image className="upload-article-card__cover__img" src={cover} />
        {course && <span className="upload-article-card__cover__tag">教程</span>}
        {video && <i className="upload-article-card__cover__play" />}
      </div>
      <div className="upload-article-card__info">
        <div className="upload-article-card__title">{title}</div>
        <div className="upload-article-card__meta">
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
              <span className="upload-article-card__views">{views}</span>
              <span className="upload-article-card__date">{date}</span>
            </>
          )}
          <i className="upload-article-card__more" onClick={handleAction} />
        </div>
      </div>
    </div>
  );
};

const ArticleList = props => {
  const modalRef = useRef();
  const listRef = useRef();

  const fetchData = async page => {
    const res = await Api.post('/my/article/list', { page, page_size: 20 });
    res.data.data.forEach(item => {
      item._date = Tools.getTimeAgo(item.created_at);
      item._cover = Tools.resolveAsset(item.image_path, '?imageView2/2/w/224/h/140');
    });
    return res;
  };

  const renderRow = item => {
    const disabled = [2, 3].indexOf(item.status) >= 0;
    const card = (
      <ArticleCard
        cover={item._cover}
        course={!!item.is_course}
        video={!!item.video_url}
        title={item.title}
        status={item.status}
        views={item.view_num}
        date={item._date}
        handleAction={openActionSheet({ id: item.article_id })}
        handleAuditField={alertStatusAuditField(item.refuse)}
        handleAuditing={alertStatusAuditing}
      />
    );

    return item.is_link ? (
      <a key={item.article_id} href={item.content} onClick={e => disabled && e.preventDefault()}>
        {card}
      </a>
    ) : (
      <Link
        key={item.article_id}
        to={`/articles/${item.article_id}`}
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

  const deleteItem = async article_id => {
    await Api.post('/my/article/delete', { article_id });
    const ref = listRef.current;
    ref.data = ref.data.filter(item => item.article_id !== article_id);
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
    <KsListView ref={listRef} useBodyScroll={true} fetchData={fetchData} renderRow={renderRow} />
  );
};

export default ArticleList;
