import React, { useEffect } from 'react';

import Image from 'src/components/Image';
import './VideoPicker.scss';
import { FileSize, FileType } from 'src/utils/Constant';
import useUploader from 'src/hooks/useUploader';

const VideoPicker = props => {
  const { size = FileSize.VIDEO_LARGE, beforeUpload, onChange, children } = props;
  const [uploadState, uploadActions] = useUploader({
    max: 1,
    size,
    type: FileType.VIDEO,
    beforeUpload
  });

  const file = uploadState.files && uploadState.files[0];

  useEffect(() => {
    if (onChange) {
      onChange(uploadState);
    }
  }, [uploadState]);

  return (
    <div className="ks-video-picker">
      {file && file.percent >= 100 && (
        <div className="ks-video-picker__preview">
          <Image className="ks-video-picker__preview__cover" src={file.thumb} />
          <i
            className="ks-video-picker__preview__close"
            onClick={() => uploadActions.remove(file.id)}
          />
        </div>
      )}

      {file && file.percent < 100 && (
        <div className="ks-video-picker__upload">
          <span className="ks-video-picker__upload__percent">{file.percent}%</span>
          <span className="ks-video-picker__upload__process">
            <i style={{ width: 100 - file.percent + '%' }} />
          </span>
        </div>
      )}

      {!file && (
        <div className="ks-video-picker__tips" onClick={uploadActions.add}>
          {children || (
            <>
              <i className="ks-video-picker__tips__icon" />
              <span className="ks-video-picker__tips__title">上传视频</span>
              <p className="ks-video-picker__tips__info">视频大小不超过5G，建议比例16:9</p>
              <p className="ks-video-picker__tips__info">
                支持格式：mp4、flv、avi、mov、rmvb、mkv…
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoPicker;
