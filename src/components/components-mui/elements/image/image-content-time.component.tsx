import React from 'react';
import { ImageElement } from './image.element';
import { StackRow } from '../../styles/stack.style';
import { TimeAgoContentComponent } from '../../time-ago/time-ago-content.component';
import { ImageSizeType } from './image.enum';

export interface ImageContentTimeComponentProps {
  url: string;
  content?: string;
  time?: Date;
  sizeType?: ImageSizeType;
  isZoom?: boolean;
}

export const ImageContentTimeComponent: React.FC<ImageContentTimeComponentProps> = ({
  url,
  content,
  time,
  sizeType = ImageSizeType.CIRCLE,
  isZoom = false,
}) => {
  return (
    <StackRow>
      <ImageElement url={url} isBorder isWrap sizeType={sizeType} isZoom={isZoom} />
      <TimeAgoContentComponent content={content || '#'} time={time || new Date()} />
    </StackRow>
  );
};
