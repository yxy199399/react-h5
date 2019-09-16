import { useSetState } from 'react-use';
import { useRef } from 'react';
import { Toast } from 'antd-mobile';

import Qiniu from 'src/utils/Qiniu';
import Tools from 'src/utils/Tools';
import Api from 'src/utils/Api';
import { FileType } from 'src/utils/Constant';

const useUploader = data => {
  const { max = 1, size = 0, type = null, beforeUpload = () => true } = data;
  const idRef = useRef(0);
  const [state, setState] = useSetState({
    files: [],
    max,
    size,
    type
  });

  /**
   * 上传文件列表
   * @member {Object}
   */
  const add = async () => {
    let files = [];

    switch (type) {
      case FileType.VIDEO:
        files = await Qiniu.choseVideos();
        break;
      case FileType.IMAGE:
        files = await Qiniu.choseImages();
        break;
      case FileType.ATTACH:
        files = await Qiniu.choseAttach();
        break;
      default:
        files = await Qiniu.choseFiles();
    }

    files
      // 检查文件大小
      .filter(f => {
        const ok = size ? f.size < size : true;
        !ok && Toast.info('文件太大...');
        return ok;
      })
      // 上传前手动检查文件
      .filter(beforeUpload)
      // 忽略超出数量限制的文件
      .slice(0, max - state.files.length)
      // 逐一上传
      .forEach(upload);
  };

  /**
   * 上传单个文件
   * @param {File} file
   */
  const upload = file => {
    // 初始数据
    const current = {
      id: idRef.current++,
      name: file.name,
      path: '',
      thumb: file._type === FileType.IMAGE ? URL.createObjectURL(file) : '',
      percent: 0,
      subscription: null,
      type: file._type
    };

    // 上传失败
    const error = err => {
      remove(current.id);
      Toast.info('上传失败，请重试');
    };

    // 上传中
    const next = next => {
      const percent = Math.min(parseInt(next.total.percent), 99);

      setState(state => ({
        files: state.files.map(item => {
          if (item.id === current.id) {
            return { ...item, percent };
          } else {
            return item;
          }
        })
      }));
    };

    // 上传成功
    const complete = async res => {
      let path = process.env.REACT_APP_ASSETS_HOST + '/' + res.key;
      let source = path;
      let thumb = Tools.getVideoCover(path);
      let name = current.name;
      let video_type = null;

      // 视频文件需要转码
      if (file._type === FileType.VIDEO) {
        try {
          // 生成短视频 不需要等待返回
          Api.post('/shortVideo', { path, startTime: 1, endTime: 5 });
          // 视频格式转码
          const res = await Api.post('/videoTranscoding', { path, newSuffix: 'mp4' });
          path = process.env.REACT_APP_ASSETS_HOST + '/' + res.url;
          name = res.url.split('/').pop();
          video_type = res.video_ppi || [];
        } catch {
          error();
        }
      }

      // 添加path
      setState(state => ({
        files: state.files.map(item => {
          if (item.id === current.id) {
            const newItem = { ...item, path, name, source };

            // 视频文件添加预览图
            if (item.type === FileType.VIDEO) {
              newItem.thumb = thumb;
              newItem.video_type = video_type;
            }

            return newItem;
          } else {
            return item;
          }
        })
      }));

      // 延迟取消进度动画，防止视觉闪烁
      setTimeout(() => {
        setState(state => ({
          files: state.files.map(item => {
            if (item.id === current.id) {
              return { ...item, percent: 100 };
            } else {
              return item;
            }
          })
        }));
      }, 500);
    };

    const subscription = Qiniu.upload(file).subscribe({ next, error, complete });
    setState(state => ({ files: state.files.concat({ ...current, subscription }) }));
  };

  /**
   * 根据id删除文件
   * @param {Number} id 文件id
   */
  const remove = id => {
    setState(state => ({
      files: state.files.filter(item => {
        if (item.id === id) {
          // 取消上传操作
          item.subscription && item.subscription.unsubscribe();
          return false;
        } else {
          return true;
        }
      })
    }));
  };

  /**
   * 获取已经上传完成的数据
   */
  const get = () => {
    return state.files.filter(f => f.path).map(f => ({ name: f.name, path: f.path }));
  };

  const actions = { add, remove, get };

  return [state, actions];
};

export default useUploader;
