/**
 * 用户类型
 */
export const UserType = {
  NORMAL: 1,
  PROFESSIONAL: 2,
  BUSINESS: 3
};

/**
 * 点赞状态
 */
export const VoteStatus = {
  HATE: 0,
  LIKE: 1,
  NORMAL: 2
};

/**
 * 点赞类型
 */
export const VoteType = {
  ARTICLE: 1,
  COMMENT: 2,
  REPLY: 3,
  ENCYCLOPEDIA: 4,
  VIDEO: 5,
  QUESTION: 6,
  MALL: 7,
  FORUM: 8,
  ANSWER: 9
};

/**
 * 评论类型
 */

export const ReplyType = {
  ARTICLE: 1,
  VIDEO: 2,
  QUESTION: 3,
  ACTIVITY: 4,
  GOODS: 5,
  SERVICE: 6,
  MALL: 7,
  ORDER: 8
};

/**
 * 文件类型
 */
export const FileType = {
  ALL: 0,
  IMAGE: 1,
  VIDEO: 2,
  ATTACH: 3
};

/**
 * 常用文件大小
 * 图片 5M
 * 文件 10M
 * 视频 500M
 * 大视频 2G
 */
export const FileSize = {
  ATTACH: 30 * 1024 * 1024,
  IAMGE: 20 * 1024 * 1024,
  VIDEO: 2 * 1024 * 1024 * 1024,
  VIDEO_LARGE: 5 * 1024 * 1024 * 1024
};

/**
 * 文件后缀
 */
// prettier-ignore
export const FileExts = {
  IMAGE: ['jpg', 'png', 'jpeg', 'tiff', 'tif'],
  VIDEO: ['mp4','flv','avi','wmv','mov','webm','mpeg4','ts','mpg','rm','rmvb','mkv','lrv'],
  ATTACH_WHITOUT_IMAGE: [
    'text','pdf','dwg','prt','stl','cgm','stp','ply',
    'model','dxf','igs','x_t','ino','m','mlx','slx',
    'mat','fig','docx','xlsx','zip','rar','pptx','bags',
    'rtm','tdm','vi','vim','vit','xctl','xnode','gbr','doc','xls'
  ],
  ATTACH: []
};

FileExts.ATTACH = [...FileExts.ATTACH_WHITOUT_IMAGE, ...FileExts.IMAGE];
