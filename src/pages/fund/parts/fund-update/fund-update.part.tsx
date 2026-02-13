import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { FundType } from "@/common/lib/types.lib";
import { User } from "@/common/lib/auth.lib";
import { Users, User as UserIcon } from "@phosphor-icons/react";
import { Fund } from "@/apis/funds/fund.entities";

interface UpdateFundDialogProps {
  fund?: Fund;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateFund: (
    id: string,
    name: string,
    type: FundType,
    memberIds: string[]
  ) => void;
  currentUserId: string;
  allUsers: User[];
}

export function FundUpdatePart({
  fund,
  open,
  onOpenChange,
  onUpdateFund,
  currentUserId,
  allUsers,
}: UpdateFundDialogProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<FundType>("personal");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([
    currentUserId,
  ]);

  if (!fund) return null;

  useEffect(() => {
    if (open && fund) {
      setName(fund.name);
      setType(fund.type);
      setSelectedMembers(
        fund.memberIds?.length ? fund.memberIds : [fund.ownerId]
      );
    }
  }, [open, fund]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const memberIds = type === "shared" ? selectedMembers : [currentUserId];
    onUpdateFund(fund.id, name.trim(), type, memberIds);
    onOpenChange(false);
  };

  const handleMemberToggle = (userId: string) => {
    if (userId === currentUserId) return;

    setSelectedMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg backdrop-blur-xl bg-card/95 border-border/40 shadow-2xl rounded-2xl">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-lg font-bold text-gray-800">
            Cập nhật quỹ
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground font-medium">
            Cập nhật thông tin quỹ để quản lý thu chi riêng hoặc chung với người
            khác
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-7">
          <div className="space-y-2.5">
            <Label
              htmlFor="fund-name"
              className="text-sm font-semibold text-black"
            >
              Tên quỹ
            </Label>
            <Input
              id="fund-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Quỹ đi chơi, Quỹ sinh nhật..."
              className="text-black text-base h-12 border-border/60 bg-background/50 backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary/50 transition-all shadow-md"
            />
          </div>

          <div className="space-y-4">
            <Label className="text-sm font-semibold text-black">Loại quỹ</Label>
            <RadioGroup
              value={type}
              onValueChange={(v) => setType(v as FundType)}
            >
              <div className="flex items-center space-x-4 p-5 border-2 border-border/50 rounded-2xl hover:bg-muted/40 hover:border-primary/40 transition-all duration-200 cursor-pointer group shadow-md">
                <RadioGroupItem value="personal" id="personal" />
                <Label
                  htmlFor="personal"
                  className="flex-1 cursor-pointer flex items-center gap-4"
                >
                  <div className="p-3 rounded-xl bg-linear-to-br from-secondary/25 to-secondary/15 group-hover:from-secondary/35 group-hover:to-secondary/20 transition-all shadow-lg">
                    <UserIcon
                      weight="bold"
                      className="text-secondary"
                      size={24}
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-black text-base">
                      Quỹ riêng
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">
                      Chỉ bạn có thể sử dụng
                    </div>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-4 p-5 border-2 border-border/50 rounded-2xl hover:bg-muted/40 hover:border-primary/40 transition-all duration-200 cursor-pointer group shadow-md">
                <RadioGroupItem value="shared" id="shared" />
                <Label
                  htmlFor="shared"
                  className="flex-1 cursor-pointer flex items-center gap-4"
                >
                  <div className="p-3 rounded-xl bg-linear-to-br from-primary/25 to-primary/15 group-hover:from-primary/35 group-hover:to-primary/20 transition-all shadow-lg">
                    <Users weight="bold" className="text-primary" size={24} />
                  </div>
                  <div>
                    <div className="font-semibold text-black text-base">
                      Quỹ chung
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">
                      Chia sẻ với nhiều người
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {type === "shared" && (
            <div className="space-y-4">
              <Label className="text-sm font-bold">Thành viên</Label>
              <div className="space-y-2.5 border-2 border-border/50 rounded-2xl p-5 bg-muted/30 backdrop-blur-sm shadow-lg">
                {allUsers.map((user) => {
                  const isCurrentUser = user.id === currentUserId;
                  const isChecked = selectedMembers.includes(user.id);

                  return (
                    <div
                      key={user.id}
                      className="flex items-center space-x-3 p-3 rounded-xl hover:bg-background/60 transition-all"
                    >
                      <Checkbox
                        id={`member-${user.id}`}
                        checked={isChecked}
                        onCheckedChange={() => handleMemberToggle(user.id)}
                        disabled={isCurrentUser}
                      />
                      <Label
                        htmlFor={`member-${user.id}`}
                        className="flex-1 cursor-pointer text-sm font-semibold"
                      >
                        {user.name}
                        {isCurrentUser && (
                          <span className="text-muted-foreground ml-2 font-normal">
                            (Bạn)
                          </span>
                        )}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <DialogFooter className="gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="shadow-md font-semibold"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={!name.trim()}
              className="bg-linear-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-xl hover:shadow-2xl transition-all duration-300 font-semibold"
            >
              Cập nhật quỹ
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
