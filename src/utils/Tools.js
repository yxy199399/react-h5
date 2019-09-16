import React from 'react';
import Clipboard from 'src/components/Clipboard';
import { Modal } from 'antd-mobile';
import moment from 'moment';
import Api from 'src/utils/Api';
import { FileExts, FileType } from './Constant';

const Tools = {};

// 判断是否是图片
Tools.isImg = name => /\.(jpe?g|png|gif|bmp)$/i.test(name);

// 是否是微信浏览器
Tools.isWxBrowser = () => {
  const ua = window.navigator.userAgent;
  return ua.toLowerCase().indexOf('micromessenger') >= 0;
};

// 是否是支付宝浏览器
Tools.isAlipayBrowser = () => {
  const ua = window.navigator.userAgent;
  return /Alipay/i.test(ua);
};

// 是否是ios设备
Tools.isIOS = () => {
  const ua = window.navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
};

// 是否是uc浏览器
Tools.isUcBrowser = () => {
  const ua = window.navigator.userAgent;
  return /UCBrowser/.test(ua);
};

/**
 * 补全资源链接
 * @param {String} path 原始路径
 *
 * ?imageView2/2/w/100/h/100
 *
 * @example
 * Tools.resolveAsset('foo.png') // 'https://cdn.kushualab.com/foo.png'
 */
Tools.resolveAsset = (path, suffix) => {
  if (!path) {
    return '';
  } else if (/^(https?|ftp):\/\//.test(path)) {
    return path;
  } else {
    let fullPath = process.env.REACT_APP_ASSETS_HOST + '/' + path;

    if (Tools.checkFileType(path) === FileType.IMAGE) {
      if (suffix === undefined) {
        suffix = '?imageslim';
      } else if (!suffix || typeof suffix !== 'string') {
        suffix = '';
      }
      return fullPath + suffix;
    }
    // else if (Tools.checkFileType(path) === FileType.VIDEO) {
    //   return Tools.choseVideoQuality(path, suffix);
    // }
    else {
      return fullPath;
    }
  }
};

/**
 * 选择默认视频清晰度
 */
Tools.choseVideoQuality = (path, types, quality) => {
  if (!path) return '';
  const toNum = s => (s ? +s.split('x').pop() : 0);

  types = types || [];
  quality = quality || '1280x720';
  let target = toNum(quality);
  let result = '';
  types.forEach(str => {
    let num = toNum(str);
    let prev = toNum(result);
    if (num <= target && num >= prev) {
      result = str;
    }
  });
  result = result ? '_' + result : '';

  return path.replace(/^(.*)(\.)/, '$1' + result + '$2');
};

/**
 * 计算给予的时间距离现在过去多久了
 * @example
 * Tools.getTimeAgo(new Date()) // "刚刚"
 */
Tools.getTimeAgo = date => {
  if (!date) return '';

  let diff = moment().diff(date);
  let duration = moment.duration(diff);

  let str = '';
  let arr = [];

  arr.push({ unit: ' 年前', number: duration.years() });
  arr.push({ unit: ' 个月前', number: duration.months() });
  arr.push({ unit: ' 天前', number: duration.days() });
  arr.push({ unit: ' 小时前', number: duration.hours() });
  arr.push({ unit: ' 分钟前', number: duration.minutes() });

  arr.forEach(item => {
    if (!str && item.number) {
      str = item.number + item.unit;
    }
  });

  if (diff < 0) return '刚刚';
  return str || '刚刚';
};

/**
 * 将秒转化为视频长度
 *
 * @param {Number} sec 视频长度（秒）
 * @returns {String}
 *
 * @example
 * Tools.getVideoLenStr(75) // '1:15'
 */
Tools.getVideoLenStr = (sec = 0) => {
  let hours = moment.duration(sec, 'seconds').hours();
  let str = moment
    .utc()
    .startOf('day')
    .add(sec, 's')
    .format('mm:ss');

  return hours ? hours + ':' + str : str;
};

/**
 * 获取视频截图 默认取第五帧
 *
 * @param {String} videoSrc 视频地址
 * @param {Number} index 第几帧
 * @returns {String} 截图的图片地址
 */
Tools.getVideoCover = (videoSrc, index = 5) => {
  return videoSrc + '?vframe/jpg/offset/' + index;
};

/**
 * 获取充电电量
 *
 * @param {Number} battery 原始电量
 * @returns {String}
 *
 * @example
 * Tools.getBatteryStr(55) // 55mAh
 * Tools.getBatteryStr(1323) // 1.3Ah
 */
Tools.getBatteryStr = (battery = 0) => {
  let number = battery;
  let unit = ' mAh';

  if (battery >= 1000) {
    number = parseFloat((battery / 1000).toFixed(1));
    unit = ' Ah';
  }

  return number + unit;
};

/**
 * 获取一个随机整数
 *
 * @param {Number} min 最小值
 * @param {Number} max 最大值
 * @returns {Number} 随机证书
 *
 * @example
 * Tools.getRandomInt(10, 20) // 13
 */
Tools.getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * 富文本转纯文本
 *
 * @param {String} htmlStr html文本
 * @param {Number} htmlStr 截取长度
 * @returns {String} 返回纯文本
 *
 * @example
 * Tools.htmlToText('<p>hello </p><b>world</b>!') // hello world!
 */
Tools.htmlToText = (htmlStr, length) => {
  let div = document.createElement('div');
  div.innerHTML = htmlStr;
  let text = div.innerText;
  return length ? text.substring(0, length) : text;
};

/**
 * rem 转 px
 *
 * @param {Number} rem
 * @returns {Number}
 *
 * @example
 * Tools.remToPx(7.5) // 375
 */
Tools.remToPx = rem => {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
};

/**
 * h5端还未实现的功能提示去电脑端操作
 *
 * @returns {Object}
 *
 * @example
 * const modal = Tools.alertMissingFeatures() // 打开提示窗口
 * modal.close() // 关闭提示窗口
 */
Tools.alertMissingFeatures = () => {
  const text = 'www.kooshua.com';

  const copyBtn = (
    <Clipboard copyText={text} successText="复制成功!" errorText="复制失败">
      <span>复制链接</span>
    </Clipboard>
  );

  const link = <div style={{ color: '#1a97ff' }}>{text}</div>;

  return Modal.alert('该功能只能在电脑网页端进行操作', link, [{ text: '取消' }, { text: copyBtn }]);
};

/**
 * 获取城市数据
 */
let city = [];
Tools.getCity = async () => {
  if (city.length) {
    return city;
  } else {
    const res = await Api.get('/city/getAllCities');
    city = res.data;
    return city;
  }
};

/**
 * 是否是图片
 */
Tools.imgReg = new RegExp('(' + FileExts.IMAGE.map(s => '.' + s).join('|') + ')$', 'i');
Tools.videoReg = new RegExp('(' + FileExts.VIDEO.map(s => '.' + s).join('|') + ')$', 'i');
Tools.attachReg = new RegExp('(' + FileExts.ATTACH.map(s => '.' + s).join('|') + ')$', 'i');
Tools.checkFileType = name => {
  if (Tools.imgReg.test(name)) {
    return FileType.IMAGE;
  } else if (Tools.videoReg.test(name)) {
    return FileType.VIDEO;
  } else if (Tools.attachReg.test(name)) {
    return FileType.ATTACH;
  } else {
    return FileType.ALL;
  }
};

export default Tools;
