import React from 'react';

import Tags from '../Tags';
// import RichTextView from '../RichTextView';
import './QuestionCard.scss';

class QuestionCard extends React.PureComponent {
  render() {
    let { title, info, battery, comments, tags, date } = this.props;

    return (
      <div className="ks-question-card">
        <aside className="ks-question-card__side">
          <div className="ks-question-card__side__battery">{battery}</div>
          <div className="ks-question-card__side__views">{comments}</div>
        </aside>
        <div className="ks-question-card__body">
          <h4 className="ks-question-card__title">{title}</h4>
          {/* <RichTextView className="ks-question-card__info" html={info} /> */}
          <div className="ks-question-card__info">{info}</div>
          <footer className="ks-question-card__footer">
            <Tags className="ks-question-card__tags" data={tags} />
            <div className="ks-question-card__date">{date}</div>
          </footer>
        </div>
      </div>
    );
  }
}

QuestionCard.defaultProps = {
  title: '',
  info: '',
  battery: 0,
  views: 0,
  tags: [],
  date: ''
};

export default QuestionCard;
