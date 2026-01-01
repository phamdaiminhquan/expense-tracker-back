import { Stack, SxProps, Theme, Typography, useTheme } from '@mui/material';
import React from 'react';
import { STYLE } from '@/common/constant';
import { IconElement } from '../elements/icon/icon.element';
import { StackRowAlignCenter } from '../styles/stack.style';

export interface PriceComponentProps {
  isLineHeight1?: boolean;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  size?: 'small' | 'medium' | 'large';
  sameSize?: boolean;
  color?: string;
  sx?: SxProps<Theme>;
}

export const PriceComponent: React.FC<PriceComponentProps> = ({
  isLineHeight1,
  price,
  originalPrice,
  discountPercent,
  onClick,
  color,
  size = 'small',
  sameSize = false,
  sx = {},
}) => {
  const { palette } = useTheme();

  const variantData: any = { small: 'subtitle1', medium: 'h6', large: 'h5' };

  if (onClick) sx = { ...sx, cursor: 'pointer' };

  return (
    <Stack sx={sx}>
      <StackRowAlignCenter sx={{ color: color || palette.error.main, gap: STYLE.PADDING_GAP_ITEM }}>
        <IconElement icon="attach_money" size={size} sx={{ marginRight: '-5px', marginLeft: '-4px' }} />
        <Typography lineHeight={isLineHeight1 ? 1 : undefined} variant={variantData[size]}>
          {+price.toFixed(1)}
        </Typography>
      </StackRowAlignCenter>

      {originalPrice && price !== originalPrice && (
        <StackRowAlignCenter sx={{ gap: STYLE.PADDING_GAP_ITEM }}>
          <StackRowAlignCenter
            sx={{
              color: palette.text.disabled,
              gap: STYLE.PADDING_GAP_ITEM,
              position: 'relative',
              '&:after': {
                position: 'absolute',
                content: "''",
                borderTop: `1px solid ${palette.text.disabled}`,
                width: '100%',
                backgroundColor: 'blue',
              },
            }}
          >
            <IconElement
              icon="attach_money"
              size={sameSize ? size : 'small'}
              sx={{ marginRight: '-5px', marginLeft: '-4px' }}
            />
            <Typography lineHeight={isLineHeight1 ? 1 : undefined} variant={sameSize ? variantData[size] : 'body1'}>
              {originalPrice}
            </Typography>
          </StackRowAlignCenter>

          {discountPercent && (
            <Typography
              lineHeight={isLineHeight1 ? 1 : undefined}
              color={discountPercent! < 0 ? 'success.main' : 'error'}
              variant={sameSize ? variantData[size] : 'body1'}
            >
              {(discountPercent! < 0 ? '+' : '-') + Math.abs(discountPercent!)! + '%'}
            </Typography>
          )}
        </StackRowAlignCenter>
      )}
    </Stack>
  );
};
