import { DrawerNavigation } from "@/components/elements/drawer/drawer-navigation.element";
import { DrawerNavRail } from "@/components/elements/drawer/drawer-nav-rail.element";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import React, { useState } from "react";

type DrawerNavigationProps = React.ComponentProps<typeof DrawerNavigation>;

export function SidebarPart(props: DrawerNavigationProps) {
  const isAgentMode = Boolean(props.isAgentMode);
  const [activeTab, setActiveTab] = useState<"funds" | "wallets">("funds");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleChangeTab = (tab: "funds" | "wallets") => {
    if (isAgentMode) {
      props.onExitAgentToTab?.(tab);
    }
    setActiveTab(tab);
  };

  return (
    <aside className="hidden lg:flex items-stretch shrink-0 py-3 pl-3 gap-3">
      {/* Layer 1: NavRail — always visible, always pill, "home" of the app */}
      <div className="w-16 rounded-full border border-border bg-background shadow-sm overflow-hidden flex-shrink-0">
        <DrawerNavRail
          currentUserName={props.currentUserName}
          activeTab={activeTab}
          onChangeTab={handleChangeTab}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenAgent={props.onOpenAgent}
          onOpenProfile={props.onOpenProfile}
          isAgentMode={isAgentMode}
        />
      </div>

      {/* Layer 2: List panel — slides in/out based on agent mode */}
      <div
        className={`overflow-hidden rounded-2xl bg-background border border-border shadow-sm transition-[width,opacity] duration-300 ease-in-out ${
          isAgentMode
            ? "w-0 opacity-0 pointer-events-none border-transparent shadow-none"
            : "w-[284px] opacity-100"
        }`}
      >
        <DrawerNavigation
          {...props}
          isPermanent={true}
          open={true}
          onOpenChange={() => {}}
          activeTabControlled={activeTab}
          onChangeTabControlled={setActiveTab}
        />
      </div>

      {/* Settings Dialog — owned here when in permanent/desktop mode */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Cài đặt</DialogTitle>
            <DialogDescription>Tạm thời chỉ hỗ trợ đăng xuất.</DialogDescription>
          </DialogHeader>
          <Button
            onClick={props.onLogout}
            className="w-full mt-2"
            variant="destructive"
          >
            <LogOut size={16} className="mr-2" />
            Đăng xuất
          </Button>
        </DialogContent>
      </Dialog>
    </aside>
  );
}
