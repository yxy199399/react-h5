import React, { useRef } from 'react';
import { useSetState } from 'react-use';

import NavBar from 'src/components/Nav/NavBar';
import Textarea from 'src/components/Forms/Textarea';
import FilePicker from 'src/components/Forms/FilePicker';

import { FileType, FileSize } from 'src/utils/Constant';

const CommentReply = props => {
  const {
    title = '写评论',
    btnText = '发布',
    exBtnType = 'attach',
    exBtnText = '添加附件',
    contentMax = 200,
    placeholder = '写下您的评论...',
    fileMax = 5,
    fileType = FileType.ATTACH,
    fileSize = FileSize.ATTACH,
    onSubmit
  } = props;

  const fileRef = useRef();
  const [state, setState] = useSetState({
    content: '',
    files: []
  });

  const handleContentChange = content => {
    setState({ content });
  };

  const getFiles = files => {
    return files.filter(f => f.path).map(f => ({ name: f.name, path: f.path }));
  };

  const handleSubmit = () => {
    const files = getFiles(state.files);
    const params = {
      content: state.content,
      files: files.length ? files : null
    };

    onSubmit(params);
  };

  const handleFileChange = state => {
    setState({ files: state.files });
  };

  const add = () => {
    fileRef.current && fileRef.current.add();
  };

  return (
    <div>
      <NavBar title={title} right={<NavBar.Btn onClick={handleSubmit}>{btnText}</NavBar.Btn>} />

      <Textarea
        max={contentMax}
        placeholder={placeholder}
        onChange={handleContentChange}
        extra={
          !state.files.length && (
            <Textarea.Btn type={exBtnType} onClick={add}>
              {exBtnText}
            </Textarea.Btn>
          )
        }
      />

      <FilePicker
        max={fileMax}
        type={fileType}
        size={fileSize}
        hidden={state.files.length <= 0}
        ref={fileRef}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default CommentReply;
