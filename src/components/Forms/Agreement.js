import React from 'react';
import { useMount, useSetState } from 'react-use';

import NavBar from 'src/components/Nav/NavBar';
import RichTextView from 'src/components/RichTextView';

import history from 'src/history';
import Api from 'src/utils/Api';
import './Agreement.scss';

const Agreement = props => {
  const { type, title, onConfirm, onBack } = props;
  const [state, setState] = useSetState({
    content: ''
  });

  useMount(() => {
    fetchData();
  });

  const fetchData = async () => {
    const res = await Api.post('/admin/tips/getOne', { type });
    const content = res.data.map(f => `<p>${f.content}</p>`).join('<br/>');
    setState({ content });
  };

  // 获取标题
  const getTitle = () => {
    if (title) return title;

    switch (type) {
      case 'h5_user':
        return '用户协议';
      case 'privacy_policy':
        return '隐私政策';
      case 'content_policy':
        return '内容政策';
      case 'video':
        return '酷耍视频协议';
      default:
        return '酷耍用户协议';
    }
  };

  let realTitle = title;

  if (!realTitle) {
  }

  return (
    <div className="ks-agreement">
      <NavBar
        title={getTitle()}
        left={
          <NavBar.Icon
            type="back"
            onClick={evt => {
              onBack ? onBack(evt) : history.goBack();
            }}
          />
        }
      />

      <RichTextView className="ks-agreement__content" html={state.content} />

      <footer className="ks-agreement__footer">
        <button
          className="ks-agreement__footer__btn"
          onClick={evt => {
            onConfirm ? onConfirm(evt) : history.goBack();
          }}
        >
          我知道了
        </button>
      </footer>
    </div>
  );
};

export default Agreement;
