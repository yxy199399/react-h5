import React from 'react';
import { Link } from 'react-router-dom';

import NavBar from 'src/components/Nav/NavBar';
import './QuestionReplySucc.scss';

const QuestionReplySucc = () => {
  return (
    <div className="question-reply-succ">
      <NavBar title="问题" />
      <i className="question-reply-succ__icon" />
      <h3 className="question-reply-succ__title">回答成功</h3>
      <p className="question-reply-succ__info">感谢您的回答，系统会尽快进行审核</p>
      <Link className="question-reply-succ__btn" to="/">
        返回主页
      </Link>
    </div>
  );
};

export default QuestionReplySucc;
