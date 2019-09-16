import React, { useRef } from 'react';
import { useUnmount } from 'react-use';
import { ActionSheet, Toast, Modal } from 'antd-mobile';
import { Link } from 'react-router-dom';

import KsListView from 'src/components/KsListView';
import Tags from 'src/components/Tags';

import Api from 'src/utils/Api';
import Tools from 'src/utils/Tools';

// 问题卡片
const QuestionCard = props => {
  const {
    likes,
    answers,
    title,
    content,
    tags,
    date,
    status,
    handleAction = null,
    handleAuditing = null,
    handleAuditField = null
  } = props;
  const isStatus = (...args) => args.indexOf(status) >= 0;

  return (
    <div className="upload-question-card">
      <div className="upload-question-card__side">
        <div className="upload-question-card__side__item">{likes}</div>
        <div className="upload-question-card__side__item">{answers}</div>
      </div>
      <div className="upload-question-card__body">
        <div className="upload-question-card__title">{title}</div>
        <div className="upload-question-card__cont">{content}</div>
        <Tags className="upload-question-card__tags" data={tags} />
        <div className="upload-question-card__footer">
          {isStatus(2) && (
            <div
              className="upload-question-card__status upload-question-card__status--2"
              onClick={handleAuditing}
            >
              待审核
            </div>
          )}
          {isStatus(3) && (
            <div
              className="upload-question-card__status upload-question-card__status--3"
              onClick={handleAuditField}
            >
              未通过
            </div>
          )}
          {!isStatus(2, 3) && <div className="upload-question-card__date">{date}</div>}
          <i className="upload-question-card__more" onClick={handleAction} />
        </div>
      </div>
    </div>
  );
};

const QuestionList = props => {
  const modalRef = useRef();
  const listRef = useRef();

  const fetchData = async page => {
    const res = await Api.post('/my/question/list', { page, page_size: 20 });
    res.data.data.forEach(item => {
      item._date = Tools.getTimeAgo(item.created_at);
      item._content = Tools.htmlToText(item.content);
      // item._likes = Tools.getBatteryStr(item.like_num);
      item._answers = (n => (n < 10000 ? n : parseFloat(n / 10000).toFixed(1) + 'w'))(
        item.answers_count
      );
      item._tags = item.label_name.split(',').map(name => ({ name }));
    });
    return res;
  };

  const renderRow = item => {
    const disabled = [2, 3].indexOf(item.status) >= 0;

    return (
      <Link
        key={item.question_id}
        to={`/questions/${item.question_id}`}
        onClick={e => disabled && e.preventDefault()}
      >
        <QuestionCard
          likes={item.like_num}
          answers={item._answers}
          title={item.title}
          content={item._content}
          tags={item._tags}
          date={item._date}
          status={item.status}
          handleAction={openActionSheet({ id: item.question_id })}
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

  const deleteItem = async question_id => {
    await Api.post('/my/question/delete', { question_id });
    const ref = listRef.current;
    ref.data = ref.data.filter(item => item.question_id !== question_id);
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

export default QuestionList;
