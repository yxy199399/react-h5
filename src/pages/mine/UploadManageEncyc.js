import React, { useRef } from 'react';
import { useUnmount } from 'react-use';
import { ActionSheet, Toast, Modal } from 'antd-mobile';
import { Link } from 'react-router-dom';

import KsListView from 'src/components/KsListView';
import Image from 'src/components/Image';

import Api from 'src/utils/Api';
import Tools from 'src/utils/Tools';

// 百科卡片
const EncycCard = props => {
  const {
    title,
    cover,
    content,
    status,
    views,
    date,
    handleAction = null,
    handleAuditing = null,
    handleAuditField = null,
    handleUnfinish = null
  } = props;

  const isStatus = (...args) => args.indexOf(status) >= 0;

  return (
    <div className="upload-ency-card">
      <div className="upload-ency-card__title">{title}</div>
      <div className="upload-ency-card__body">
        <Image className="upload-ency-card__cover" src={cover} />
        <div className="upload-ency-card__info">
          <div className="upload-ency-card__cont">{content}</div>
          <div className="upload-ency-card__meta">
            {isStatus(2) && (
              <div
                className="upload-ency-card__status upload-ency-card__status--2"
                onClick={handleAuditing}
              >
                待审核
              </div>
            )}
            {isStatus(3) && (
              <div
                className="upload-ency-card__status upload-ency-card__status--3"
                onClick={handleAuditField}
              >
                未通过
              </div>
            )}
            {isStatus(4) && (
              <div className="upload-ency-card__status upload-ency-card__status--4">被修改</div>
            )}
            {isStatus(5) && (
              <div
                className="upload-ency-card__status upload-ency-card__status--5"
                onClick={handleUnfinish}
              >
                待完善
              </div>
            )}
            {!isStatus(2, 3, 4, 5) && (
              <>
                <div className="upload-ency-card__views">{views}</div>
                <div className="upload-ency-card__date">{date}</div>
              </>
            )}
            <i className="upload-ency-card__more" onClick={handleAction} />
          </div>
        </div>
      </div>
    </div>
  );
};

const EncycList = props => {
  const modalRef = useRef();
  const listRef = useRef();

  const fetchData = async page => {
    const res = await Api.post('/my/encyclopedias/list', { page, page_size: 20 });
    res.data.data.forEach(item => {
      item._cover = Tools.resolveAsset(item.cover, '?imageView2/2/w/224/h/140');
      item._date = Tools.getTimeAgo(item.created_at);
    });
    return res;
  };

  const renderRow = item => {
    const disabled = [2, 3, 5].indexOf(item.status) >= 0;

    return (
      <Link
        key={item.source_id}
        to={`/encyclopedias/${item.source_id}`}
        onClick={e => disabled && e.preventDefault()}
      >
        <EncycCard
          cover={item._cover}
          title={item.title}
          content={item.content}
          status={item.status}
          views={item.view_num}
          date={item._date}
          handleAction={openActionSheet({ id: item.source_id })}
          handleAuditing={alertStatusAuditing}
          handleAuditField={alertStatusAuditField(item.refuse)}
          handleUnfinish={alertUnFinish}
        />
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

  const deleteItem = async encyclopedia_id => {
    await Api.post('/my/encyclopedias/delete', { encyclopedia_id });
    const ref = listRef.current;
    ref.data = ref.data.filter(item => item.source_id !== encyclopedia_id);
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

  const alertUnFinish = evt => {
    evt.stopPropagation();
    evt.preventDefault();
    Tools.alertMissingFeatures();
  };

  useUnmount(() => {
    ActionSheet.close();
    modalRef.current && modalRef.current.close();
  });

  return (
    <KsListView ref={listRef} useBodyScroll={true} fetchData={fetchData} renderRow={renderRow} />
  );
};

export default EncycList;
