import { Stack, SxProps, Theme, Typography } from '@mui/material';
import React from 'react';
import DOMPurify from 'dompurify';
import '../../../../public/css/ckeditor.css';

export interface EditorContentElementProps {
  content: string;
  sx?: SxProps<Theme>;
  label?: string;
  onClick?: (e: any) => void;
}

export const EditorContentElement: React.FC<EditorContentElementProps> = ({ content, sx = {}, label, onClick }) => {
  return (
    <Stack onClick={onClick} gap="6px">
      {label && <Typography variant="subtitle1">{label}</Typography>}
      <Stack
        className="ck-content"
        sx={{
          ...sx,
          '& > div': { '& > :first-of-type': { marginTop: 0 }, '& > :last-child': { marginBottom: 0 } },
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />
      </Stack>
    </Stack>
  );
};
