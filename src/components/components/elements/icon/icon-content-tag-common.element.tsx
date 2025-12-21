import React from 'react';
import { StackRowAlignCenter } from '../../styles/stack.style';
import { IconContentElement, IconContentElementProps } from './icon-content.element';
import { TagCommonComponent, TagCommonComponentProps } from '../../tag/tag-common.component';

export interface IconContentTagCommonElementProps {
  iconContentProps: IconContentElementProps;
  tagCommonProps: TagCommonComponentProps;
}

export const IconContentTagCommonElement: React.FC<IconContentTagCommonElementProps> = ({
  iconContentProps,
  tagCommonProps,
}) => {
  return (
    <StackRowAlignCenter>
      <IconContentElement {...iconContentProps} content={iconContentProps.content + ':'} />
      <TagCommonComponent {...tagCommonProps} />
    </StackRowAlignCenter>
  );
};
