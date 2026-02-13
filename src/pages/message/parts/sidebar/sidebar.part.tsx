import { DrawerNavigation } from "@/components/elements/drawer/drawer-navigation.element";
import React from 'react';

type DrawerNavigationProps = React.ComponentProps<typeof DrawerNavigation>;

export function SidebarPart(props: DrawerNavigationProps) {
    return (
        <aside className="hidden lg:flex w-[350px] bg-white flex-col shrink-0 rounded-2xl shadow-sm overflow-hidden border border-gray-100">
            <DrawerNavigation {...props} isPermanent={true} open={true} />
        </aside>
    );
}
