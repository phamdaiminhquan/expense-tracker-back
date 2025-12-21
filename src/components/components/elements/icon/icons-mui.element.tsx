import { Stack, SxProps, Theme, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { STYLE } from '@/common/constant';
import { IconElement } from './icon.element';
import { iconsMui } from '@/common/constant/icons-mui.constant';
import { TextFieldElement } from '../text-field/text-field.element';
import { EmptyComponent } from '../../empty/empty.component';
import { StackRow, StackWrap } from '../../styles/stack.style';
import { ChangeEventCustom } from '../../../common/interfaces/change-event-custom.interface';

export interface IconsMuiElementProps {
  value: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  onChange?: (event: ChangeEventCustom<string>) => void;
  sx?: SxProps<Theme>;
}

export const IconsMuiElement: React.FC<IconsMuiElementProps> = ({
  value,
  error = '',
  helperText,
  required,
  onChange,
  sx = {},
}) => {
  const { palette } = useTheme();

  const [search, setSearch] = useState('');

  const [icons, setIcons] = useState(iconsMui.slice(0, 50));

  const clickIcon = (icon: string) => {
    onChange?.({ target: { name: 'icon', value: icon } });
  };

  const searchIcons = (event: React.ChangeEvent<HTMLInputElement> | any) => {
    setSearch(event.target.value);

    setIcons(iconsMui.filter((icon) => icon.includes(event.target.value || '')));
  };

  return (
    <Stack>
      <StackRow>
        <TextFieldElement
          name="icon"
          error={error}
          helperText={helperText}
          required={required}
          label="Icon"
          iconLabel="emoticon"
          value={search}
          onChange={searchIcons}
          sx={{ flex: 1 }}
        />
        <Stack
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
            width: '38.56px', // Cái này height default của input chưa biết xử lí sao
            height: '38.56px', // Cái này height default của input chưa biết xử lí sao
            borderRadius: STYLE.BORDER_RADIUS_ELEMENT,
            border: `1px solid ${palette.divider}`,
          }}
        >
          <IconElement icon={value} />
        </Stack>
      </StackRow>
      <StackWrap
        sx={{
          height: 90,
          borderRadius: STYLE.BORDER_RADIUS_ELEMENT,
          border: `1px solid ${palette.divider}`,
          padding: STYLE.PADDING_GAP_ITEM,
          overflowY: 'auto',
          alignContent: 'flex-start',
          gap: STYLE.PADDING_GAP_ITEM,
          ...sx,
        }}
      >
        {icons.length === 0 ? (
          <EmptyComponent />
        ) : (
          icons.map((icon, index) => <IconElement icon={icon} onClick={() => clickIcon(icon)} key={index} />)
        )}
      </StackWrap>
    </Stack>
  );
};
