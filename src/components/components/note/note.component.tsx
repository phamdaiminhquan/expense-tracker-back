import { STYLE } from '@/common/constant';
import { Stack, SxProps, Theme, Typography, useTheme } from '@mui/material';
import React, { Fragment, ReactNode, useState } from 'react';
import { IconElement } from '../elements/icon/icon.element';
import { LinkElement } from '../elements/link/link.element';
import { StackRowAlignCenter, StackRowAlignCenterJustBetween } from '../styles/stack.style';
import { ButtonIconCircleElement } from '../elements/button/button-icon-circle.element';
import { GAP_ICON_CONTENT_BY_SIZE } from '@/common/constant/style.constant';

export interface NoteComponentProps {
  content: string | ReactNode;
  title?: string;
  contentHref?: string;
  href?: string;
  type?: 'info' | 'recommend' | 'warning' | 'error';
  sx?: SxProps<Theme>;
  sxContent?: SxProps<Theme>;
  isCanClose?: boolean;
}

export const NoteComponent: React.FC<NoteComponentProps> = ({
  content,
  title,
  contentHref,
  href,
  type = 'info',
  sx,
  sxContent,
  isCanClose = false,
}) => {
  const { palette } = useTheme();

  const [open, setOpen] = useState(true);

  const tempData = {
    info: {
      icon: 'error',
      title: title || 'Thông tin',
      color: palette.success.dark,
    },
    recommend: {
      icon: 'gpp_maybe',
      title: title || 'Khuyến nghị',
      color: palette.info.dark,
    },
    warning: {
      icon: 'report',
      title: title || 'Cảnh báo',
      color: palette.warning.dark,
    },
    error: {
      icon: 'emergency_home',
      title: title || 'Hạn chế',
      color: palette.error.dark,
    },
  };

  if (!open) return null;

  return (
    <Stack
      sx={{
        gap: GAP_ICON_CONTENT_BY_SIZE.medium,
        borderRadius: STYLE.BORDER_RADIUS_ELEMENT,
        borderColor: tempData[type].color,
        borderStyle: 'solid',
        borderWidth: '1px 1px 1px 3px',
        padding: 1.5,
        ...sx,
      }}
    >
      <StackRowAlignCenterJustBetween>
        <StackRowAlignCenter sx={{ gap: STYLE.PADDING_GAP_ITEM_SMALL }}>
          <IconElement icon={tempData[type].icon} sx={{ color: tempData[type].color }} />

          <Typography sx={{ color: tempData[type].color }} variant="subtitle1">
            {tempData[type].title}
          </Typography>
        </StackRowAlignCenter>

        {isCanClose && <ButtonIconCircleElement icon="close_small" size="small" onClick={() => setOpen(false)} />}
      </StackRowAlignCenterJustBetween>

      <Stack sx={{ color: tempData[type].color, ...sxContent, '& > div >  li': { marginLeft: 2 } }}>
        {content}
        {href && contentHref && (
          <Fragment>
            &nbsp;
            <LinkElement href={href}>{contentHref}</LinkElement>
          </Fragment>
        )}
      </Stack>
    </Stack>
  );
};
