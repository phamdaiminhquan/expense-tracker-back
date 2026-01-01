import { Button, ButtonProps, Typography } from '@mui/material';
import React from 'react';
import { LoadingComponent } from '../../loading/loading.component';
import { IconElement } from '../icon/icon.element';
import { STYLE } from '@/common/constant';

export interface ButtonIconContentOpacityElementProps extends ButtonProps {
  loading?: boolean;
  icon: string;
  content: any;
}

export const ButtonIconContentOpacityElement: React.FC<ButtonIconContentOpacityElementProps> = ({
  loading,
  icon,
  content,
  variant = 'outlined',
  ...rest
}) => {
  return (
    <Button
      {...rest}
      variant={variant}
      sx={{
        fontWeight: 500,
        fontSize: 15,
        textTransform: 'none',
        borderRadius: STYLE.BORDER_RADIUS_ELEMENT,
        minWidth: 'unset',
        position: 'relative',
        '& > .material-icons': {
          opacity: 0,
          position: 'absolute',
          cursor: 'pointer',
          transition: `opacity 0.3s`,
        },
        '& > .content': {
          position: 'absolute',
          opacity: 1,
          transition: `opacity 0.3s`,
        },
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
      }}
    >
      {loading ? (
        <LoadingComponent color="primary" size="small" sx={{ minHeight: '24.5px' }} />
      ) : (
        <React.Fragment>
          <IconElement className="icon" icon={icon} />
          <Typography className="content">{content}</Typography>
        </React.Fragment>
      )}
    </Button>
  );
};
