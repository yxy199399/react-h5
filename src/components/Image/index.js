import React, { useRef } from 'react';
import { useSetState } from 'react-use';
import cs from 'classnames';

import './index.scss';

class ImageStatus {
  static LOADING = 0;
  static SUCCESS = 1;
  static ERROR = 2;
}

const Image = props => {
  const imgRef = useRef();
  const { src, mode = 'cover', onLoad = () => {}, className, style, ...rest } = props;
  const [state, setState] = useSetState({
    status: ImageStatus.LOADING
  });

  const handleLoad = () => {
    setState({ status: ImageStatus.SUCCESS });
    onLoad(imgRef.current);
  };

  const handleError = () => {
    setState({ status: ImageStatus.ERROR });
  };

  const css = state.status === ImageStatus.SUCCESS ? { backgroundImage: `url("${src}")` } : null;

  return (
    <div
      className={cs(
        'ks-image',
        {
          'ks-image--box': mode === 'box',
          'ks-image--cover': mode === 'cover',
          'ks-image--contain': mode === 'contain',
          'ks-image--contain-left': mode === 'contain-left',
          'ks-image--loading': state.status === ImageStatus.LOADING,
          'ks-image--error': state.status === ImageStatus.ERROR,
          'ks-image--success': state.status === ImageStatus.SUCCESS
        },
        className
      )}
      style={{ ...style, ...css }}
      {...rest}
    >
      <img ref={imgRef} src={src} alt="" onLoad={handleLoad} onError={handleError} />
    </div>
  );
};

export default Image;
