import { Button, ButtonProps, Typography, useTheme } from '@mui/material';
import { STYLE } from '../../../common/constant';
import React from 'react';
import { LoadingComponent } from '../../loading/loading.component';
import { IconElement } from '../icon/icon.element';

export interface ButtonElementProps extends ButtonProps {
  content?: string;
  loading?: boolean;
  startIcon?: string;
  endIcon?: string;
}

export const ButtonElement: React.FC<ButtonElementProps> = ({
  content,
  loading = false,
  startIcon,
  endIcon,
  variant = 'contained',
  sx,
  ...rest
}) => {
  const { palette } = useTheme();

  return (
    <Button
      {...rest}
      variant={variant}
      startIcon={startIcon && !loading && <IconElement icon={startIcon} sx={{ cursor: 'pointer' }} />}
      endIcon={endIcon && !loading && <IconElement icon={endIcon} sx={{ cursor: 'pointer' }} />}
      sx={{
        minWidth: 100,
        ...sx,
        textTransform: 'none',
        borderRadius: STYLE.BORDER_RADIUS_ELEMENT,
      }}
    >
      {loading ? (
        <LoadingComponent color={palette.primary.contrastText} size="small" sx={{ minHeight: '24.5px' }} />
      ) : (
        <Typography sx={{ transform: `translateY(0.5px)`, whiteSpace: 'nowrap' }}>{content}</Typography>
      )}
    </Button>
  );
};
