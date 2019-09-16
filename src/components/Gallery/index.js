import React from 'react';
import ReactDOM from 'react-dom';
import cs from 'classnames';
import { Carousel } from 'antd-mobile';
import './index.scss';

class Gallery extends React.PureComponent {
  lastClick = 0;
  timer = null;
  state = {
    index: this.props.initIndex,
    enlargeIndex: null
  };

  componentDidMount() {
    document.body.classList.add('prevent-scroll--gallery');
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    document.body.classList.remove('prevent-scroll--gallery');
  }

  singleClick = evt => {
    this.props.onClick();
  };

  doubleClick = evt => {
    let { enlargeIndex, index } = this.state;
    let next = enlargeIndex === null ? index : null;
    this.setState({ enlargeIndex: next });
  };

  handleClick = evt => {
    let delay = 300;
    let now = new Date().getTime();
    let last = this.lastClick;

    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      if (now - last < delay) {
        this.doubleClick(evt);
      } else {
        this.singleClick(evt);
      }
    }, delay);

    this.lastClick = now;
  };

  handleAfterChange = next => {
    let { index } = this.state;
    if (index !== next) {
      this.setState({ enlargeIndex: null, index: next });
    }
  };

  render() {
    let { enlargeIndex, index } = this.state;
    let { data, initIndex, onClick, className, ...rest } = this.props;

    return (
      <div className={cs('ks-img-preview', className)} onClick={this.handleClick} {...rest}>
        <div className="ks-img-preview__inner">
          <span className="ks-img-preview__indicator">
            {index + 1}/{data.length}
          </span>
          <Carousel dots={false} selectedIndex={index} afterChange={this.handleAfterChange}>
            {data.map((item, key) => (
              <div
                key={key}
                className={cs('ks-img-preview__item', {
                  'ks-img-preview__item--enlarge': enlargeIndex === key
                })}
              >
                <img className="ks-img-preview__img" src={item.path} alt="" />
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    );
  }
}

Gallery.defaultProps = {
  initIndex: 0,
  data: [],
  onClick: () => {}
};

Gallery.open = (data, initIndex = 0) => {
  const div = document.createElement('div');
  document.body.appendChild(div);

  const close = () => {
    ReactDOM.unmountComponentAtNode(div);
    if (div && div.parentNode) {
      div.parentNode.removeChild(div);
    }
  };

  ReactDOM.render(<Gallery initIndex={initIndex} data={data} onClick={close} />, div);

  return { close };
};

export default Gallery;
