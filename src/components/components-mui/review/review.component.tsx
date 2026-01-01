import { SxProps, Theme, Typography } from '@mui/material';
import React from 'react';
import { STYLE } from '@/common/constant';
import { IconElement } from '../elements/icon/icon.element';
import { StackRow, StackRowAlignCenter } from '../styles/stack.style';

export interface ReviewComponentProps {
  averageRating: number;
  reviewCount: number;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  sx?: SxProps<Theme>;
}

export const ReviewComponent: React.FC<ReviewComponentProps> = ({ averageRating, reviewCount, onClick, sx = {} }) => {
  if (onClick)
    sx = {
      ...sx,
      cursor: 'pointer',
    };

  return (
    <StackRowAlignCenter sx={{ gap: STYLE.PADDING_GAP_ITEM, cursor: 'inherit', ...sx }} onClick={onClick}>
      <IconElement icon="star" size="large" fill={1} color="warning" sx={{ margin: `-5px` }} />

      <StackRow sx={{ gap: STYLE.PADDING_GAP_ITEM }}>
        <Typography lineHeight={1}>{averageRating}</Typography>
        <Typography lineHeight={1}>{`(${reviewCount})`}</Typography>
      </StackRow>
    </StackRowAlignCenter>
  );
};
