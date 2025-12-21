import { Checkbox, CheckboxProps, FormControlLabel, SxProps, Theme } from '@mui/material';
import React from 'react';
import { STYLE } from '../../../common/constant';

export interface CheckboxElementProps extends CheckboxProps {
  label?: any;
  isSameButton?: boolean;
  sx?: SxProps<Theme>;
}

export const CheckboxElement: React.FC<CheckboxElementProps> = ({
  label,
  name,
  size = 'small',
  isSameButton = false,
  sx,
  ...rest
}) => {
  return (
    <FormControlLabel
      sx={{ marginRight: 0, ...(isSameButton ? { marginLeft: 0 } : {}) }}
      name={name}
      control={
        <Checkbox
          size={size}
          {...rest}
          sx={{
            paddingTop: 0,
            paddingBottom: 0,
            paddingRight: STYLE.PADDING_GAP_ITEM,
            borderRadius: STYLE.BORDER_RADIUS_ELEMENT,
            ...(isSameButton
              ? {
                  width: STYLE.HEIGHT_DEFAULT_TEXT_FIELD_BUTTON,
                  height: STYLE.HEIGHT_DEFAULT_TEXT_FIELD_BUTTON,
                }
              : {
                  '&:hover': {
                    backgroundColor: 'unset',
                  },
                }),
            ...sx,
          }}
        />
      }
      label={label}
    />
  );
};
