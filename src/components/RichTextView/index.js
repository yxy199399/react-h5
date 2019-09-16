import React from 'react';
import cs from 'classnames';

import Gallery from '../Gallery';
import './index.scss';

class RichTextView extends React.PureComponent {
  htmlRef = React.createRef();
  gallery = null;
  imgs = [];

  componentDidMount() {
    this.getImgs();
  }

  componentWillUnmount() {
    this.gallery && this.gallery.close();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.html !== this.props.html) {
      this.getImgs();
    }
  }

  getImgs = () => {
    let html = this.htmlRef.current;
    let doms = [...html.querySelectorAll('img')];
    let idx = 0;
    let imgs = [];

    doms.forEach(img => {
      if (img.src) {
        img.ksImgIndex = idx++;
        imgs.push({ path: img.src });
      }
    });

    this.imgs = imgs;
  };

  handleClick = event => {
    if (this.props.showGallery) {
      let target = event.target;
      if (target.nodeName === 'IMG' && target.src) {
        this.gallery = Gallery.open(this.imgs, target.ksImgIndex);
      }
    }

    this.props.onClick();
  };

  render() {
    let { className, html, showGallery, onClick, ...rest } = this.props;

    return (
      <div className={cs('ql-snow', className)} onClick={this.handleClick} {...rest}>
        <div className="ql-editor" dangerouslySetInnerHTML={{ __html: html }} ref={this.htmlRef} />
      </div>
    );
  }
}

RichTextView.defaultProps = {
  html: '',
  showGallery: true,
  onClick: () => {}
};

export default RichTextView;
