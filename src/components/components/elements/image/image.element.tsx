import React, { useState } from 'react';
import { Box, BoxProps, Skeleton, useTheme } from '@mui/material';
import { STYLE } from '../../../common/constant';
import { ImageSizeType } from './image.enum';
import { WrapperCenterElement } from '../wrapper/wrapper-center.element';
import { DialogElement } from '../dialog/dialog.element';
import { FileWithPreviewOrUrl } from '../../../common/interfaces/file.interface';

export interface ImageElementProps extends BoxProps {
  url: FileWithPreviewOrUrl;
  isBorder?: boolean;
  isWrap?: boolean;
  sizeType?: ImageSizeType;
  isZoom?: boolean;
  fit?: 'cover' | 'contain';
}

export const ImageElement: React.FC<ImageElementProps> = ({
  url,
  onClick,
  sx = {},
  isBorder = false,
  isWrap = false,
  sizeType = ImageSizeType.CIRCLE,
  isZoom = false,
  fit = 'cover',
  ...rest
}) => {
  const { palette } = useTheme();
  const [loaded, setLoaded] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  if (isZoom) {
    if (onClick) throw new Error('Không thể sử dụng onClick khi sử dụng isZoom');
    onClick = () => setZoomed(true);
  }

  if (onClick) sx = { ...sx, cursor: 'pointer' };

  const height = rest.height || STYLE.HEIGHT_IMAGE_DEFAULT;
  // Nếu không FULL_WIDTH, chiều rộng lấy theo width prop hoặc theo height để giữ tỉ lệ vuông
  const width = sizeType === ImageSizeType.FULL_WIDTH ? '100%' : (rest.width as any) || height;

  const borderRadius =
    sizeType === ImageSizeType.CIRCLE
      ? '50%'
      : sizeType === ImageSizeType.SQUARE
        ? STYLE.BORDER_RADIUS_ELEMENT_SMALL
        : 0;

  return (
    <WrapperCenterElement isWrap={isWrap}>
      {!loaded && (
        <Skeleton
          variant="rectangular"
          sx={{
            height,
            width,
            borderRadius,
          }}
        />
      )}
      <Box
        {...rest}
        component="img"
        src={url as string}
        onClick={onClick}
        onLoad={() => setLoaded(true)}
        // onError={(e) => {
        //   (e.currentTarget as HTMLImageElement).src = '/images/diamond.png';
        // }}
        sx={{
          display: loaded ? 'block' : 'none',
          height,
          width,
          objectFit: fit,
          borderRadius,
          border: isBorder ? `1px solid ${palette.divider}` : 'none',
          ...sx,
        }}
      />

      {isZoom && zoomed && (
        <DialogElement
          open={zoomed}
          onClose={() => setZoomed(false)}
          sx={{ width: 600, maxWidth: 'unset' }}
          iconLabel="app_registration"
          label={`HÌNH ẢNH SẢN PHẨM`}
          nodeContent={
            <ImageElement
              url={url}
              sx={{ width: '100%', height: '100%', borderRadius: STYLE.BORDER_RADIUS_ELEMENT, boxShadow: 1 }}
            />
          }
        />
      )}
    </WrapperCenterElement>
  );
};
