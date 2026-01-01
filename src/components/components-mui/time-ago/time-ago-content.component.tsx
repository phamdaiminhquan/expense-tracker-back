import React from 'react';
import { Stack } from '@mui/system';
import { TimeAgoComponent, TimeAgoComponentProps } from './time-ago.component';
import { STYLE } from '@/common/constant';
import { TypographyOneLine } from '../elements/typography/typography-limit-one-line.component';

export interface TimeAgoContentComponentProps extends TimeAgoComponentProps {
  content: string;
  height?: number | string;
}

export const TimeAgoContentComponent: React.FC<TimeAgoContentComponentProps> = ({
  content,
  height = STYLE.HEIGHT_IMAGE_DEFAULT,
  ...rest
}) => {
  return (
    <Stack sx={{ height, gap: 0, justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <TypographyOneLine content={content} />
      <TimeAgoComponent {...rest} />
    </Stack>
  );
};
