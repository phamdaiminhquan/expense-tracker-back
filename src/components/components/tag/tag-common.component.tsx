import React from 'react';
import { TagElement, TagElementProps } from '../elements/tag/tag.element';
import { COLOR_SYSTEM } from '@/common/constant/color.constant';

export interface TagCommonComponentProps extends Omit<TagElementProps, 'type' | 'content'> {
  content?: any;
}

export const TagCommonComponent: React.FC<TagCommonComponentProps> = ({ content, ...rest }) => {
  const resolvedContent = content || 'Pending';
  const color = COLOR_SYSTEM.tag[content] || 'inherit';
  return <TagElement content={resolvedContent} type={color} {...rest} />;
};
