import { Button, ButtonProps } from '@mui/material';
import { STYLE } from '../../../common/constant';
import React from 'react';
import { LoadingComponent } from '../../loading/loading.component';
import { IconElement } from '../icon/icon.element';
import { IconImageElement } from '../icon/icon-image.element';

export interface ButtonIconElementProps extends ButtonProps {
  icon?: string;
  src?: string;
}

export const ButtonIconElement: React.FC<ButtonIconElementProps> = ({ loading, icon, src, ...rest }) => {
  if ((icon && src) || (!icon && !src)) throw Error('Vui lòng sử dụng 1 trong 2 icon | src');

  return (
    <Button
      {...rest}
      endIcon={icon ? <IconElement icon={icon} /> : <IconImageElement src={src!} />}
      sx={{
        fontSize: 15,
        textTransform: 'none',
        borderRadius: STYLE.BORDER_RADIUS_ELEMENT,
        width: STYLE.HEIGHT_DEFAULT_TEXT_FIELD_BUTTON,
        minWidth: 'unset',
        '& > .MuiButton-endIcon': {
          margin: 0,
        },
        ...rest.sx,
      }}
    >
      {loading && <LoadingComponent color="primary" size="small" sx={{ minHeight: '24.5px' }} />}
    </Button>
  );
};
