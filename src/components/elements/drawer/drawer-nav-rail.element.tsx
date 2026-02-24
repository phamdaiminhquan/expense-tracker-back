import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, MessageSquareText, Settings, Wallet } from "lucide-react";

interface DrawerNavRailProps {
  currentUserName: string;
  activeTab: "funds" | "wallets";
  onChangeTab: (tab: "funds" | "wallets") => void;
  onOpenSettings: () => void;
  onOpenAgent?: () => void;
  onOpenProfile?: () => void;
}

export function DrawerNavRail({
  currentUserName,
  activeTab,
  onChangeTab,
  onOpenSettings,
  onOpenAgent,
  onOpenProfile,
}: DrawerNavRailProps) {
  const getInitials = (name: string) => name.charAt(0).toUpperCase();

  return (
    <div className="w-16 shrink-0 border-r border-border bg-muted/20 flex flex-col items-center py-4 gap-3">
      <button onClick={onOpenProfile} className="cursor-pointer" title="Profile">
        <Avatar className="h-10 w-10 ring-2 ring-background shadow-sm">
          <AvatarFallback className="bg-primary text-primary-foreground font-bold">
            {getInitials(currentUserName)}
          </AvatarFallback>
        </Avatar>
      </button>

      <button
        onClick={onOpenAgent}
        className="cursor-pointer h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
        title="Agent"
      >
        <Bot size={18} />
      </button>

      <div className="h-px w-8 bg-border" />

      <button
        onClick={() => onChangeTab("funds")}
        className={`cursor-pointer h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${
          activeTab === "funds"
            ? "bg-primary/15 text-primary"
            : "text-muted-foreground hover:bg-muted"
        }`}
        title="Quỹ"
      >
        <MessageSquareText size={18} />
      </button>

      <button
        onClick={() => onChangeTab("wallets")}
        className={`cursor-pointer h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${
          activeTab === "wallets"
            ? "bg-primary/15 text-primary"
            : "text-muted-foreground hover:bg-muted"
        }`}
        title="Ví"
      >
        <Wallet size={18} />
      </button>

      <div className="mt-auto">
        <button
          onClick={onOpenSettings}
          className="cursor-pointer h-10 w-10 rounded-xl text-muted-foreground hover:bg-muted flex items-center justify-center transition-colors"
          title="Cài đặt"
        >
          <Settings size={18} />
        </button>
      </div>
    </div>
  );
}
