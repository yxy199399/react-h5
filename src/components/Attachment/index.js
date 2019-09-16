import React from 'react';
import cs from 'classnames';
import { Modal } from 'antd-mobile';

import Image from '../Image';
import Gallery from '../Gallery';
import Tools from '../../utils/Tools';
import iconArticle from '../../assets/icon_article.png';
import './index.scss';

class Attachment extends React.PureComponent {
  modal = null;
  gallery = null;

  componentWillUnmount() {
    this.modal && this.modal.close();
    this.gallery && this.gallery.close();
  }

  handlePreview = (data, item) => evt => {
    let imgs = data.filter(item => item.img).map(item => ({ path: item.url + '?imageslim' }));
    Gallery.open(imgs, item.imgIndex);
  };

  handleDownload = item => evt => {
    this.modal = Modal.alert('文件下载', `确定下载 ${item.name} ?`, [
      { text: '取消', onPress: () => {} },
      { text: '确定', onPress: () => window.open(item.url, '_blank') }
    ]);
  };

  formatData = data => {
    var index = 0;
    return data.map(item => {
      let img = Tools.isImg(item.name);
      let url = Tools.resolveAsset(item.path);
      let thumb = Tools.resolveAsset(item.path, '?imageView2/2/w/200/h/200');

      return {
        ...item,
        url,
        img,
        thumb,
        imgIndex: img ? index++ : 0
      };
    });
  };

  render() {
    let { className, data, ...rest } = this.props;
    let formatData = this.formatData(data);

    return (
      <div className={cs('ks-attachment clearfix', className)} {...rest}>
        <ul className="ks-attachment__list">
          {formatData.map((item, key) => (
            <li className="ks-attachment__item" key={key}>
              <div
                className="ks-attachment__rect"
                onClick={
                  item.img ? this.handlePreview(formatData, item) : this.handleDownload(item)
                }
              >
                <div className="ks-attachment__inner">
                  {item.img ? (
                    <Image className="ks-attachment__img" src={item.thumb} />
                  ) : (
                    <div className="ks-attachment__file">
                      <img src={iconArticle} alt="" />
                      <span>{item.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

Attachment.defaultProps = {
  data: []
};

export default Attachment;
