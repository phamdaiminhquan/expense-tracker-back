import { useTheme } from '@mui/material';
import React from 'react';
import { motion, MotionConfig } from 'framer-motion';

export interface SwitchElementProps {
  name?: string;
  value: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement> | any) => void;
}

export const SwitchElement: React.FC<SwitchElementProps> = ({ name, value = false, onChange }) => {
  const { palette } = useTheme();

  const change = () => {
    onChange?.({ target: { name, value: !value } });
  };

  return (
    <MotionConfig transition={{ duration: 0.2, ease: 'easeOut' }}>
      <motion.div
        className="switch"
        initial={false}
        animate={{
          backgroundColor: value ? palette.primary.main : palette.text.disabled,
        }}
        onClick={change}
        style={{
          display: 'flex',
          justifyContent: value ? 'flex-end' : 'flex-start',
          alignItems: 'center',
          width: '30px',
          height: '14px',
          padding: '3px',
          borderRadius: '10px',
          boxSizing: 'content-box',
          cursor: 'pointer',
        }}
      >
        <motion.div
          layout
          className="handle"
          style={{ background: '#fdfdfd', aspectRatio: 1, height: '100%', borderRadius: '50%' }}
        />
      </motion.div>
    </MotionConfig>
  );
};
