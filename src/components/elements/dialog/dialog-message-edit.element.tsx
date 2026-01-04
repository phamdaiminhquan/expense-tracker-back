import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Message } from "@/lib/types.lib";

export interface DialogMessageEditProps {
  message: Message | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (message: Message) => void;
  onDelete?: (id: string) => Promise<void>;
}

export function DialogMessageEdit({
  message,
  open,
  onOpenChange,
  onSave,
  onDelete,
}: DialogMessageEditProps) {
  const [messages, setMessages] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (message) {
      setMessages(message.message);
    }
  }, [message]);

  const handleSave = async () => {
    if (!message || !messages.trim()) return;
    setLoading(true);
    try {
      await onSave({
        ...message,
        message: messages.trim(),
      });

      onOpenChange(false);
    } catch (error) {
      console.log("Error updating message:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Chỉnh sửa giao dịch
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-5 py-4">
          {/* <div className="space-y-2">
            <Label htmlFor="edit-user" className="text-sm font-semibold">Người</Label>
            <Input
              id="edit-user"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Tên người"
              className="h-11 transition-all focus-visible:ring-2 focus-visible:ring-primary/20"
            />
          </div> */}

          {/* <div className="space-y-3">
            <Label className="text-sm font-semibold">Loại giao dịch</Label>
            <RadioGroup
              value={type}
              onValueChange={(v) => setType(v as "spend" | "earn")}
            >
              <div className="flex items-center space-x-3 p-3 border border-border/50 rounded-lg hover:bg-muted/30 transition-colors">
                <RadioGroupItem value="spend" id="edit-spend" />
                <Label
                  htmlFor="edit-spend"
                  className="font-medium cursor-pointer flex items-center gap-2"
                >
                  <TrendDown
                    size={18}
                    className="text-destructive"
                    weight="bold"
                  />
                  Chi tiêu
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 border border-border/50 rounded-lg hover:bg-muted/30 transition-colors">
                <RadioGroupItem value="earn" id="edit-earn" />
                <Label
                  htmlFor="edit-earn"
                  className="font-medium cursor-pointer flex items-center gap-2"
                >
                  <TrendUp size={18} className="text-accent" weight="bold" />
                  Thu nhập
                </Label>
              </div>
            </RadioGroup>
          </div> */}

          {/* <div className="space-y-2">
            <Label htmlFor="edit-amount" className="text-sm font-semibold">
              Số tiền (ngàn đồng)
            </Label>
            <Input
              id="edit-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="số tiền"
              className="h-11 transition-all focus-visible:ring-2 focus-visible:ring-primary/20"
            />
          </div> */}

          <div className="space-y-2">
            <Label htmlFor="edit-message" className="text-sm font-semibold">
              Nội dung
            </Label>
            <Input
              id="edit-message"
              value={messages}
              onChange={(e) => setMessages(e.target.value)}
              placeholder="Mô tả giao dịch"
              className="h-11 transition-all focus-visible:ring-2 focus-visible:ring-primary/20"
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <div className="flex w-full items-center justify-between gap-2">
            <div>
              {onDelete && message && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={async () => {
                    try {
                      await onDelete(message.id);
                    } finally {
                      onOpenChange(false);
                    }
                  }}
                  className="shadow-sm"
                >
                  Xóa
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="shadow-sm"
              >
                Hủy
              </Button>
              <Button
                disabled={
                  messages === message?.message || messages.trim() === ""
                }
                loading={loading}
                onClick={handleSave}
                className="shadow-md hover:shadow-lg transition-all"
              >
                Lưu
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
