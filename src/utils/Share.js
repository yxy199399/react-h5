import Api from './Api';
import Tools from './Tools';

class Share {
  isWxInit = false;

  /**
   * 初始化微信分享config
   */
  initWxConfig = async url => {
    const wx = window.wx;
    url = url || window.location.href.split('#')[0];

    if (!Tools.isWxBrowser() || !wx) return;
    if (Tools.isIOS() && this.isWxInit) return;

    const res = await Api.post('/weChatH5Share', { url }, { _toast: false });
    this.isWxInit = true;

    wx.config({
      ...res.data,
      debug: false,
      jsApiList: [
        'onMenuShareAppMessage',
        'onMenuShareTimeline',
        'onMenuShareQQ',
        'onMenuShareQZone',
        'onMenuShareWeibo'
      ]
    });
  };

  /**
   * 更新分享内容
   */
  updateShareInfo = (data = {}) => {
    const wx = window.wx;
    const shareLogo = 'https://cdn.kushualab.com/icon/icon_wx_share.png';
    const shareData = {
      ...data,
      title: data.title || process.env.REACT_APP_TITLE,
      desc: data.desc || process.env.REACT_APP_DESCRIPTION,
      link: data.url || window.location.href,
      imgUrl: data.imgUrl || shareLogo
    };

    // 微信分享
    if (Tools.isWxBrowser() && wx) {
      wx.ready(() => {
        wx.onMenuShareAppMessage(shareData);
        wx.onMenuShareTimeline(shareData);
        wx.onMenuShareQQ(shareData);
        wx.onMenuShareQZone(shareData);
        wx.onMenuShareWeibo(shareData);
      });
    }

    // qq分享
    window.setShareInfo &&
      window.setShareInfo({
        title: shareData.title,
        summary: shareData.desc,
        pic: shareData.imgUrl,
        url: shareData.link
      });
  };
}

export default new Share();
