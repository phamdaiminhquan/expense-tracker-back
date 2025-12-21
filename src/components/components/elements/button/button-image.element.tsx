import { Button, ButtonProps } from '@mui/material';
import { STYLE } from '../../../common/constant';
import React from 'react';
import { LoadingComponent } from '../../loading/loading.component';
import { ImageElement } from '../image/image.element';

export interface ButtonImageElementProps extends ButtonProps {
  loading?: boolean;
  url: any;
}

export const ButtonImageElement: React.FC<ButtonImageElementProps> = ({ loading, url, ...rest }) => {
  return (
    <Button
      {...rest}
      endIcon={
        <ImageElement
          url={url}
          sx={{
            width: STYLE.FONT_SIZE_ICON.medium,
            height: STYLE.FONT_SIZE_ICON.medium,
            borderRadius: STYLE.BORDER_RADIUS_ELEMENT_TAG,
            opacity: rest.disabled ? 0.6 : 1,
          }}
        />
      }
      sx={{
        fontSize: 15,
        textTransform: 'none',
        borderRadius: STYLE.BORDER_RADIUS_ELEMENT,
        width: STYLE.HEIGHT_DEFAULT_TEXT_FIELD_BUTTON,
        minWidth: 'unset',
        '& > .MuiButton-endIcon': {
          margin: 0,
        },
      }}
    >
      {loading && <LoadingComponent color="primary" size="small" sx={{ minHeight: '24.5px' }} />}
    </Button>
  );
};
