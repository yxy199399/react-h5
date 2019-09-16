import React, { useRef } from 'react';
import { useSetState } from 'react-use';
import { Toast } from 'antd-mobile';

import NavBar from 'src/components/Nav/NavBar';
import Textarea from 'src/components/Forms/Textarea';
import FilePicker from 'src/components/Forms/FilePicker';
import LocalCity from 'src/components/Forms/LocalCity';

import { FileType, FileSize } from 'src/utils/Constant';
import Api from 'src/utils/Api';
import './ForumAdd.scss';

const ForumAdd = props => {
  const contentMax = 200;
  const videoRef = useRef();
  const imageRef = useRef();
  const [state, setState] = useSetState({
    content: '',
    videos: [],
    images: [],
    city: null
  });

  const handleContentChange = content => {
    setState({ content });
  };

  const handleFileChange = key => state => {
    setState({ [key]: state.files });
  };

  const handleFileAdd = ref => () => {
    ref.current && ref.current.add();
  };

  const handleCityChange = city => {
    setState({ city });
  };

  const getFiles = files => {
    return files
      .filter(f => f.path)
      .map(f => {
        const item = { name: f.name, path: f.path };
        if (f.video_type) {
          item.video_type = f.video_type;
        }
        return item;
      });
  };

  const handleSubmit = async () => {
    const images = getFiles(state.images);
    const videos = getFiles(state.videos);

    const params = {
      content: state.content,
      images,
      videos,
      city: state.city && state.city.id,
      source_type: 4
    };

    if (!params.content.length) return Toast.info('评论内容不能为空');
    if (params.content.length > contentMax) return Toast.info('评论内容字数过多');

    Toast.loading('发布中...');
    await Api.post('/web/cool/h5Create', params);
    Toast.info('发布成功');
    props.history.goBack();
  };

  const noFile = !(state.videos.length || state.images.length);

  return (
    <div className="forum-add">
      <NavBar title="写酷圈" right={<NavBar.Btn onClick={handleSubmit}>发布</NavBar.Btn>} />

      <Textarea
        placeholder="这一刻的想法..."
        max={contentMax}
        onChange={handleContentChange}
        extra={
          noFile && (
            <>
              <Textarea.Btn type="video" onClick={handleFileAdd(videoRef)} />
              <Textarea.Btn type="image" onClick={handleFileAdd(imageRef)} />
            </>
          )
        }
      />

      <div className="forum-add-files" hidden={noFile}>
        <FilePicker
          ref={videoRef}
          max={1}
          type={FileType.VIDEO}
          size={FileSize.VIDEO}
          btnText="视频"
          onChange={handleFileChange('videos')}
        />
        <i className="forum-add-files__bar" />
        <FilePicker
          ref={imageRef}
          max={4}
          type={FileType.IMAGE}
          size={FileSize.IAMGE}
          btnText="图片"
          onChange={handleFileChange('images')}
        />
      </div>

      <LocalCity onChange={handleCityChange} />
    </div>
  );
};

export default ForumAdd;
