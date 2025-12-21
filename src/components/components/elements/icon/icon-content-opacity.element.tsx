import { Box, SxProps, Theme, Typography } from '@mui/material';
import React from 'react';
import { StackRowAlignJustCenter } from '../../styles/stack.style';
import { IconElement } from './icon.element';
import { STYLE } from '@/common/constant';

export interface IconContentOpacityElementProps {
  icon: string;
  isIconImage?: boolean; // Nếu bật cái này thì icon là 1 src của image
  content?: any;
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning' | any;
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  disabled?: boolean;
  sx?: SxProps<Theme>;
}

export const IconContentOpacityElement: React.FC<IconContentOpacityElementProps> = ({
  icon,
  content,
  color = 'inherit',
  onClick,
  disabled = false,
  isIconImage = false,
  sx = {},
}) => {
  return (
    <StackRowAlignJustCenter
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        position: 'relative',
        '& > .material-icons': {
          opacity: content ? 0 : 1,
          position: 'absolute',
          transition: `opacity 0.3s`,
          color,
        },
        '& > .content': {
          position: 'absolute',
          opacity: content ? 1 : 0,
          transition: `opacity 0.3s`,
        },
        ...(disabled
          ? {}
          : {
              '&:hover': {
                '& > .material-icons': {
                  opacity: 1,
                  transition: `opacity 0.3s`,
                },
                '& > .content': {
                  opacity: 0,
                  transition: `opacity 0.3s`,
                },
              },
            }),

        ...sx,
      }}
    >
      {isIconImage ? (
        <Box
          className="material-icons"
          component="img"
          src={icon}
          alt="Icon"
          sx={{
            width: STYLE.FONT_SIZE_ICON.medium,
            height: STYLE.FONT_SIZE_ICON.medium,
            opacity: disabled ? 0.5 : 1,
          }}
        />
      ) : (
        <IconElement className="icon" icon={icon} color={color} />
      )}

      <Typography className="content" color={color}>
        {content}
      </Typography>
    </StackRowAlignJustCenter>
  );
};
