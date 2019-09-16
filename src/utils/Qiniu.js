import * as qiniu from 'qiniu-js';
import QiniuUPToken from 'qiniu-uptoken';
import moment from 'moment';
import { Toast } from 'antd-mobile';

import { FileType } from './Constant';
import Tools from './Tools';

/**
 * 七牛上传
 *
 * @example
 * const [file] = await Qiniu.choseFiles()
 * const subscription = Qiniu.upload(file)
 *
 * subscription.subscribe({
 *  next: () => {},
 *  error: () => {},
 *  complete: () => {}
 * })
 */

class Qiniu {
  input = this.createInput();
  qiniu = qiniu;
  token = QiniuUPToken(
    process.env.REACT_APP_QINIU_ACCESS_KEY,
    process.env.REACT_APP_QINIU_SECRET_KEY,
    process.env.REACT_APP_QINIU_BUCKET_NAME
  );

  /**
   * 创建input 用于触发选择文件事件
   */
  createInput() {
    const input = document.createElement('input');
    input.id = 'qiniu-upload-input';
    input.type = 'file';
    input.style.display = 'none';
    input.multiple = true;
    // 部分浏览器（微信）input标签必须插入document才能获取change事件
    document.body.appendChild(input);
    return input;
  }

  /**
   * 选择一组文件
   * @param {String} accept 文件类型 同input的accept属性
   * @example
   * const files = await Qiniu.choseFiles()
   */
  choseFiles = accept => {
    return new Promise(res => {
      this.input.value = '';

      if (!accept) {
        this.input.accept = null;
      } else {
        this.input.accept = accept;
      }

      this.input.onchange = () => {
        const files = [...this.input.files].map(file => {
          file._type = Tools.checkFileType(file.name);
          return file;
        });

        res(files);
      };

      this.input.click();
    });
  };

  /**
   * 选择一组图片
   * @example
   * const files = await Qiniu.choseImages()
   */
  choseImages = async () => {
    // const accept = FileExts.IMAGE.map(s => '.' + s).join(',');
    const files = await this.choseFiles();
    const filterFiles = files.filter(file => file._type === FileType.IMAGE);
    if (filterFiles.length < files.length) Toast.info('文件格式不支持');
    return filterFiles;
  };

  /**
   * 选择一组视频
   * @example
   * const files = await Qiniu.choseVideos()
   */
  choseVideos = async () => {
    // const accept = FileExts.VIDEO.map(s => '.' + s).join(',');
    const files = await this.choseFiles();
    const filterFiles = files.filter(file => file._type === FileType.VIDEO);
    if (filterFiles.length < files.length) Toast.info('文件格式不支持');
    return filterFiles;
  };

  /**
   * 选择一组附件
   */
  choseAttach = async () => {
    // const accept = FileExts.ATTACH.map(s => '.' + s).join(',');
    const files = await this.choseFiles();
    const filterFiles = files.filter(
      file => file._type === FileType.ATTACH || file._type === FileType.IMAGE
    );
    if (filterFiles.length < files.length) Toast.info('文件格式不支持');
    return filterFiles;
  };

  /**
   * 上传文件
   * @param {File} file 文件
   */
  upload = file => {
    return qiniu.upload(file, moment().format('YYYYMMDDHHmmssS') + '/' + file.name, this.token);
  };

  /**
   * 上传单个文件
   * 直接返回文件名称和路径
   * 无法展示进度条
   * @param {String} accept 文件类型 同input的accept属性
   * @return {Object<{ name: string, path: string }>}
   */
  uploadAndGetUrl = async file => {
    // const [file] = await this.choseFiles(accept);
    return new Promise((res, rej) => {
      this.upload(file).subscribe({
        error(err) {
          Toast.info('上传失败，请重试');
          rej(err);
        },
        complete(data) {
          res({ name: file.name, path: process.env.REACT_APP_ASSETS_HOST + '/' + data.key });
        }
      });
    });
  };
}

export default new Qiniu();
