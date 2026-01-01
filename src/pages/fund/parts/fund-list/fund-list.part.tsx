import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Wallet,
  Users,
  CaretRight,
  SignOut,
} from "@phosphor-icons/react";
import { useState } from "react";
import { Fund } from "@/apis/funds/fund.entities";

interface FundListScreenProps {
  funds: Fund[];
  currentUserName: string;
  onSelectFund: (fundId: string) => void;
  onCreateFund: () => void;
  isLoading?: boolean;
  onRefresh?: () => void;
  onLogout: () => void;
}

export function FundListPart({
  funds,
  currentUserName,
  onSelectFund,
  onCreateFund,
  isLoading = false,
  onRefresh,
  onLogout,
}: FundListScreenProps) {
  const [fundNameInput, setFundNameInput] = useState("");

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const handleCreateFund = () => {
    onCreateFund();
    setFundNameInput("");
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-linear-to-br from-background via-primary/1.5 to-accent/1.5" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(120,119,198,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(255,200,100,0.08),transparent_50%)]" />

      <div className="relative z-10 container max-w-md mx-auto px-5 py-10 space-y-10">
        <header className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 bg-linear-to-br from-primary/30 to-primary/15 ring-2 ring-primary/20 shadow-lg">
                <AvatarFallback className="bg-linear-to-br from-primary/30 to-primary/15 text-primary font-bold text-xl">
                  {getInitials(currentUserName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1">
                  XIN CHÀO
                </p>
                <p className="font-bold text-xl text-foreground">
                  {currentUserName}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onLogout}
              className="text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all rounded-xl h-10 w-10"
            >
              <SignOut size={20} weight="bold" />
            </Button>
          </div>

          <div className="space-y-2">
            <h1 className="text-6xl font-extrabold leading-tight bg-linear-to-r from-primary via-primary/95 to-primary bg-clip-text text-transparent tracking-tight">
              FinCap
            </h1>
            <p className="text-sm text-muted-foreground font-medium">
              Chat App Quản Lý Chi Tiêu
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Input
              placeholder="Tên quỹ mới..."
              value={fundNameInput}
              onChange={(e) => setFundNameInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && fundNameInput.trim()) {
                  handleCreateFund();
                }
              }}
              className="flex-1 bg-background/60 backdrop-blur-xl border-border/60 h-12 text-base shadow-md focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary/50 transition-all"
            />
            <Button
              onClick={handleCreateFund}
              size="icon"
              className="shrink-0 h-12 w-12 bg-linear-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
            >
              <Plus size={22} weight="bold" />
            </Button>
          </div>
        </header>

        <div className="space-y-5">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-2">
            DANH SÁCH QUỸ
          </h2>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card
                  key={i}
                  className="p-6 border-border/40 bg-card/60 backdrop-blur-xl shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5 flex-1">
                      <Skeleton className="w-14 h-14 rounded-2xl shrink-0" />
                      <div className="flex-1 min-w-0 space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                    <Skeleton className="w-6 h-6 rounded shrink-0" />
                  </div>
                </Card>
              ))}
            </div>
          ) : funds.length === 0 ? (
            <Card className="p-16 text-center border-2 border-dashed border-border/40 space-y-5 bg-card/40 backdrop-blur-xl shadow-lg">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">
                  Chưa có quỹ nào
                </p>
                <p className="text-xs text-muted-foreground">
                  Tạo quỹ đầu tiên để bắt đầu!
                </p>
              </div>
              {onRefresh && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRefresh}
                  className="shadow-md"
                >
                  Tải lại
                </Button>
              )}
            </Card>
          ) : (
            <div className="space-y-4">
              {funds.map((fund, index) => (
                <Card
                  key={fund.id}
                  className="p-6 cursor-pointer hover:bg-card/90 hover:shadow-2xl hover:border-primary/30 hover:scale-[1.02] transition-all duration-300 group border-border/40 bg-card/60 backdrop-blur-xl shadow-lg animate-in fade-in slide-in-from-bottom-3"
                  style={{ animationDelay: `${index * 60}ms` }}
                  onClick={() => onSelectFund(fund.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5 flex-1">
                      <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-primary/25 to-primary/15 flex items-center justify-center shrink-0 shadow-lg ring-2 ring-primary/15 group-hover:scale-110 group-hover:ring-primary/30 transition-all duration-300">
                        {fund.type === "shared" ? (
                          <Users
                            size={28}
                            className="text-primary"
                            weight="duotone"
                          />
                        ) : (
                          <Wallet
                            size={28}
                            className="text-primary"
                            weight="duotone"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-foreground mb-1.5 group-hover:text-primary transition-colors">
                          {fund.name}
                        </h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-2 font-medium">
                          <Users size={14} weight="fill" />
                          {fund.memberIds.length} thành viên
                        </p>
                      </div>
                    </div>
                    <CaretRight
                      size={22}
                      className="text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-1.5 transition-all shrink-0"
                      weight="bold"
                    />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
