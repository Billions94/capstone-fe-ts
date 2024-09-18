import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { getFileType } from '../../../util/funcs';
import './styles.scss';

export const MediaDetails: React.FC<{
  media: string;
  postContent?: string;
  flag?: boolean;
}> = ({ media, flag, postContent }) => {
  return (
    <div id="mediaDetails">
      <div className={flag ? 'class' : ''}>
        {flag && postContent && <p className="text-dark">{postContent}</p>}

        {getFileType(media) ? (
          <div className="mt-3">
            <LazyLoadImage
              src={media}
              alt=""
              className="rounded-image"
              width="200"
              height="200"
            />
          </div>
        ) : (
          <video
            src={media}
            controls
            autoPlay
            height={350}
            style={{
              width: '-webkit-fill-available ',
            }}
          >
            <track kind="captions" />
          </video>
        )}
      </div>
    </div>
  );
};
