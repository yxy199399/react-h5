import React from 'react';
import cs from 'classnames';

import Image from '../Image';
import Tags from '../Tags';
// import RichTextView from '../RichTextView';

import './EncyclopediaCard.scss';

class EncyclopediaCard extends React.PureComponent {
  render() {
    let { title, cover, tags, battery, content, className, ...rest } = this.props;

    return (
      <div className={cs('ks-encyc-card', className)} {...rest}>
        <h4 className="ks-encyc-card__title">{title}</h4>
        <div className="ks-encyc-card__body">
          <Image className="ks-encyc-card__cover" src={cover} />
          {/* <RichTextView className="ks-encyc-card__content" html={content} /> */}
          <div className="ks-encyc-card__content">{content}</div>
        </div>
        <footer className="ks-encyc-card__footer">
          <Tags className="ks-encyc-card__tags" data={tags} />
          {battery !== null && <div className="ks-encyc-card__like">{battery} mAh</div>}
        </footer>
      </div>
    );
  }
}

export default EncyclopediaCard;
