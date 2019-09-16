import React, { useRef } from 'react';
import { useUnmount } from 'react-use';
import { ActionSheet, Toast, Modal } from 'antd-mobile';
import { Link } from 'react-router-dom';

import KsListView from 'src/components/KsListView';

import Api from 'src/utils/Api';
import Tools from 'src/utils/Tools';

// 回答卡片
const AnswerCard = props => {
  const {
    title,
    content,
    status,
    likes,
    date,
    handleAction = null,
    handleAuditing = null,
    handleAuditField = null
  } = props;

  const isStatus = (...args) => args.indexOf(status) >= 0;

  return (
    <div className="upload-answer-card">
      <div className="upload-answer-card__title">{title}</div>
      <div className="upload-answer-card__body">
        <div className="upload-answer-card__cont">{content}</div>
        <div className="upload-answer-card__meta">
          {isStatus(2) && (
            <div
              className="upload-answer-card__status upload-answer-card__status--2"
              onClick={handleAuditing}
            >
              待审核
            </div>
          )}
          {isStatus(3) && (
            <div
              className="upload-answer-card__status upload-answer-card__status--3"
              onClick={handleAuditField}
            >
              未通过
            </div>
          )}
          {!isStatus(2, 3) && (
            <>
              <div className="upload-answer-card__likes">{likes}</div>
              <div className="upload-answer-card__date">{date}</div>
            </>
          )}
          <i className="upload-answer-card__more" onClick={handleAction} />
        </div>
      </div>
    </div>
  );
};

const AnswerList = props => {
  const modalRef = useRef();
  const listRef = useRef();

  const fetchData = async page => {
    const res = await Api.post('/my/answer/list', { page, page_size: 20 });
    res.data.data.forEach(item => {
      item._content = Tools.htmlToText(item.answer_content);
      item._date = Tools.getTimeAgo(item.created_at);
      item._likes = Tools.getBatteryStr(item.like_num);
    });
    return res;
  };

  const renderRow = item => {
    const disabled = [2, 3].indexOf(item.status) >= 0;

    return (
      <Link
        key={item.explain_id}
        to={`/answers/${item.explain_id}`}
        onClick={e => disabled && e.preventDefault()}
      >
        <AnswerCard
          title={item.title}
          content={item._content}
          status={item.status}
          likes={item._likes}
          date={item._date}
          handleAction={openActionSheet({ id: item.explain_id })}
          handleAuditField={alertStatusAuditField(item.refuse)}
          handleAuditing={alertStatusAuditing}
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

  const deleteItem = async explain_id => {
    await Api.post('/my/answer/delete', { explain_id });
    const ref = listRef.current;
    ref.data = ref.data.filter(item => item.explain_id !== explain_id);
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

export default AnswerList;
