import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  PencilSimple,
  Trash,
  ArrowClockwise,
  NotePencil,
} from "@phosphor-icons/react";
import { Message, Category } from "@/lib/types.lib";
import { formatCurrency } from "@/lib/currency.lib";
import { DialogPromptEditPending } from "../dialog/dialog-prompt-edit-pending.element";
import React from "react";

interface MessageListProps {
  messages: Message[];
  categories?: Category[];
  wallets?: any[];
  onUpdate: (message: Message) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function ListMessage({
  messages,
  categories = [],
  wallets = [],
  onUpdate,
  onDelete,
}: MessageListProps) {
  const [editingPendingPrompt, setEditingPendingPrompt] =
    useState<Message | null>(null);

  const sortedMessages = [...messages].sort(
    (a, b) => b.timestamp - a.timestamp
  );

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (messages.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg">Chưa có giao dịch nào</p>
        <p className="text-sm mt-2">Thêm giao dịch đầu tiên của bạn ở trên</p>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Người</TableHead>
              <TableHead>Nội dung</TableHead>
              <TableHead className="text-right">Chi tiêu</TableHead>
              <TableHead className="text-right">Thu nhập</TableHead>
              <TableHead className="hidden sm:table-cell">Thời gian</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedMessages.map((message) => {
              const isPending = message.isPendingPrompt === true;

              return (
                <TableRow
                  key={message.id}
                  className={isPending ? "bg-muted/30" : ""}
                >
                  <TableCell className="font-medium">
                    {message.userName}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {isPending && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-yellow-50 text-yellow-700 border-yellow-300"
                        >
                          <NotePencil className="mr-1" size={12} />
                          Ghi chú
                        </Badge>
                      )}
                      <span
                        className={
                          isPending ? "text-muted-foreground italic" : ""
                        }
                      >
                        {message.message}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {!isPending && message.spend !== null ? (
                      <Badge variant="destructive" className="font-mono">
                        {formatCurrency(message.spend)}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {!isPending && message.earn !== null ? (
                      <Badge className="font-mono bg-accent text-accent-foreground hover:bg-accent/90">
                        {formatCurrency(message.earn)}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm hidden sm:table-cell">
                    {formatDate(message.promptCreatedAt || message.timestamp)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingPendingPrompt(message)}
                        className="h-8 w-8"
                      >
                        <PencilSimple />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(message.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <DialogPromptEditPending
        message={editingPendingPrompt}
        categories={categories || []}
        wallets={wallets || []}
        open={editingPendingPrompt !== null}
        onOpenChange={(open) => !open && setEditingPendingPrompt(null)}
        onSave={onUpdate}
        onDelete={async (id) => {
          if (id) onDelete(id);
        }}
      />
    </React.Fragment>
  );
}
