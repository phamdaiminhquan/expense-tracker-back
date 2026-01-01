import React from 'react';
import { ImageElement } from './image.element';
import { StackRow } from '../../styles/stack.style';
import { TypographyContentCaption } from '../typography/typography-content-caption.component';
import { ImageSizeType } from './image.enum';
import { TimeAgoContentComponent } from '../../time-ago/time-ago-content.component';

export interface ImageContentCaptionComponentProps {
  url?: string;
  content?: string;
  caption?: string | Date;
  captionIsTime?: boolean;
  sizeType?: ImageSizeType;
}

export const ImageContentCaptionComponent: React.FC<ImageContentCaptionComponentProps> = ({
  url,
  content,
  caption,
  captionIsTime = false,
  sizeType = ImageSizeType.SQUARE,
}) => {
  return (
    <StackRow>
      <ImageElement
        url={url || '/images/avatar-default.png'}
        isBorder
        isWrap
        sizeType={sizeType}
        sx={{ backgroundColor: 'background.default' }}
      />
      {captionIsTime ? (
        <TimeAgoContentComponent content={content || '#'} time={caption as Date} />
      ) : (
        <TypographyContentCaption content={content || '#'} caption={(caption as string) || '#'} />
      )}
    </StackRow>
  );
};
