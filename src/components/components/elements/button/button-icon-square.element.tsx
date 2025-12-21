import { Button, ButtonProps, useTheme } from '@mui/material';
import { STYLE } from '@/common/constant';
import React from 'react';
import { LoadingComponent } from '../../loading/loading.component';
import { IconElement } from '../icon/icon.element';

export interface ButtonIconSquareElementProps extends ButtonProps {
  loading?: boolean;
  icon: string;
}

export const ButtonIconSquareElement: React.FC<ButtonIconSquareElementProps> = ({
  loading = false,
  icon,
  variant = 'outlined',
  sx,
  ...rest
}) => {
  const { palette } = useTheme();

  return (
    <Button
      {...rest}
      variant={variant}
      sx={{
        ...sx,
        textTransform: 'none',
        borderRadius: STYLE.BORDER_RADIUS_ELEMENT,
        minWidth: 'unset',
        width: STYLE.HEIGHT_DEFAULT_TEXT_FIELD_BUTTON,
      }}
    >
      {loading ? (
        <LoadingComponent color={palette.primary.contrastText} size="small" sx={{ minHeight: 24.5 }} />
      ) : (
        <IconElement icon={icon} sx={{ cursor: 'pointer', height: 24.5, alignContent: 'center' }} />
      )}
    </Button>
  );
};
