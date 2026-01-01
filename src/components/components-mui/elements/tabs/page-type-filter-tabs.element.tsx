import React from 'react';
import { TabsComponent } from '../../tabs/tabs.component';
import { TabComponent } from '../../tabs/tabs.component';
import { StackRowAlignCenter } from '../../styles/stack.style';

export interface PageTypeOption {
  value: string | undefined;
  label: string;
  icon: string;
}

export interface PageTypeFilterTabsElementProps {
  options: PageTypeOption[];

  selectedPageType?: string;

  onChange: (pageType: string | undefined) => void;

  size?: 'large' | 'small' | 'medium';

  direction?: 'column' | 'row';
}

export const PageTypeFilterTabsElement: React.FC<PageTypeFilterTabsElementProps> = ({
  options,
  selectedPageType,
  onChange,
  direction = 'row',
}) => {
  const tabs: TabComponent[] = options.map((option) => ({
    id: option.value || 'ALL',
    icon: option.icon,
    name: option.label,
    onClick: () => {
      onChange(option.value);
    },
  }));

  const selectedTabId = selectedPageType || 'ALL';

  return (
    <StackRowAlignCenter>
      <TabsComponent tabs={tabs} idSelect={selectedTabId} direction={direction} />
    </StackRowAlignCenter>
  );
};
