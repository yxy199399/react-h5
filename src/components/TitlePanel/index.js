import React from 'react';

import Tilte from '../Title';
import Tags from '../Tags';
import Vote from '../Vote';
import './index.scss';

const TitlePanel = props => {
  const { voteProps, titleProps, tagsProps } = props;

  return (
    <div className="ks-title-panel">
      <div className="ks-title-panel__side">
        <Vote mode="vertical" {...voteProps} />
      </div>
      <div className="ks-title-panel__body">
        <Tilte {...titleProps} />
        <Tags {...tagsProps} warp={true} />
      </div>
    </div>
  );
};

export default TitlePanel;
