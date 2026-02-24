import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, MessageSquareText, Settings, Wallet } from "lucide-react";

interface DrawerNavRailProps {
  currentUserName: string;
  activeTab: "funds" | "wallets";
  onChangeTab: (tab: "funds" | "wallets") => void;
  onOpenSettings: () => void;
  onOpenAgent?: () => void;
  onOpenProfile?: () => void;
  isPillMode?: boolean;
  isAgentMode?: boolean;
}

export function DrawerNavRail({
  currentUserName,
  activeTab,
  onChangeTab,
  onOpenSettings,
  onOpenAgent,
  onOpenProfile,
  isPillMode = false,
  isAgentMode = false,
}: DrawerNavRailProps) {
  const getInitials = (name: string) => name.charAt(0).toUpperCase();
  const navBtnClass = (isActive: boolean) =>
    `cursor-pointer h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
      isActive
        ? "bg-primary/15 text-primary ring-1 ring-primary/20"
        : "text-muted-foreground hover:bg-muted"
    }`;

  return (
    <div className="w-16 h-full shrink-0 flex flex-col items-center py-4">
      <button onClick={onOpenProfile} className="cursor-pointer" title="Profile">
        <Avatar className="h-10 w-10 ring-2 ring-background shadow-sm">
          <AvatarFallback className="bg-primary text-primary-foreground font-bold">
            {getInitials(currentUserName)}
          </AvatarFallback>
        </Avatar>
      </button>

      <div className="h-6" />

      <button
        onClick={onOpenAgent}
        aria-current={isAgentMode ? "page" : undefined}
        aria-pressed={isAgentMode}
        className={navBtnClass(isAgentMode)}
        title="Agent"
      >
        <Bot size={18} />
      </button>

      <div className="h-2" />

      <button
        onClick={() => onChangeTab("funds")}
        aria-current={!isAgentMode && activeTab === "funds" ? "page" : undefined}
        aria-pressed={!isAgentMode && activeTab === "funds"}
        className={navBtnClass(!isAgentMode && activeTab === "funds")}
        title="Quỹ"
      >
        <MessageSquareText size={18} />
      </button>

      <div className="h-2" />

      <button
        onClick={() => onChangeTab("wallets")}
        aria-current={!isAgentMode && activeTab === "wallets" ? "page" : undefined}
        aria-pressed={!isAgentMode && activeTab === "wallets"}
        className={navBtnClass(!isAgentMode && activeTab === "wallets")}
        title="Ví"
      >
        <Wallet size={18} />
      </button>

      <div className="flex-1" />
      <div className="h-2" />
      <div className="h-2" />

      <div>
        <button
          onClick={onOpenSettings}
          className={navBtnClass(false)}
          title="Cài đặt"
        >
          <Settings size={18} />
        </button>
      </div>
    </div>
  );
}
