import React from 'react';
import { IconContentElement, IconContentElementProps } from './icon-content.element';
import { formatNumber } from '../../../common/utils/number.utils';
import { Typography, TypographyVariant } from '@mui/material';
import { StackRowAlignCenter } from '../../styles/stack.style';

export interface IconContentNumberElementProps extends IconContentElementProps {
  number?: number;
  numberVariant?: TypographyVariant;
  numberColor?: string;
  fixed?: number;
}

export const IconContentNumberElement: React.FC<IconContentNumberElementProps> = ({
  number = 0,
  fixed = 0,
  numberVariant = 'body1',
  numberColor,
  content,
  ...rest
}) => {
  return (
    <StackRowAlignCenter gap={1}>
      <IconContentElement {...rest} content={content + ':'} />
      <Typography variant={numberVariant} color={numberColor}>
        {formatNumber((number || 0).toFixed(fixed))}
      </Typography>
    </StackRowAlignCenter>
  );
};
