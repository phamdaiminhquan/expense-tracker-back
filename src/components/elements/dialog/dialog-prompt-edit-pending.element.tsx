import { useState, useEffect, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Message, Category } from "@/lib/types.lib";
import { Check, Trash2, AlertCircle, Loader2 } from "lucide-react";
import { Wallet } from "@/apis/wallets/wallet.entities";
import { WALLET_TEMPLATES } from "@/pages/message/message.constant";
import { formatCurrency } from "@/lib/currency.lib";
import { Button } from "@/components/ui/button";
import useSWR from "swr";
import { getListCategoriesDefault } from "@/apis/categories/category.api";

interface DialogPromptEditPendingProps {
  message: Message | null;
  categories: Category[];
  wallets: Wallet[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (message: Message) => Promise<void>;
  onDelete: (id: string | null) => Promise<void>;
}

export function DialogPromptEditPending({
  message,
  categories,
  wallets,
  open,
  onOpenChange,
  onSave,
  onDelete,
}: DialogPromptEditPendingProps) {
  const [formData, setFormData] = useState({
    text: "",
    amount: 0,
    categoryId: "",
    walletId: "",
    type: "expense" as "expense" | "income",
  });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");

  // function
  // Chỉ fetch khi dialog mở
  const { data: categoriesDefault } = useSWR<Category[] | undefined>(
    open ? "categories-default" : null,
    async () => (await getListCategoriesDefault()) as unknown as Category[],
    { keepPreviousData: true, revalidateOnFocus: false }
  );

  useEffect(() => {
    if (message && open) {
      // Ưu tiên lấy dữ liệu từ transaction nếu có, fallback về message level
      const transaction = message.transaction;

      const earnValue = transaction?.earnValue ?? message.earn;
      const spendValue = transaction?.spendValue ?? message.spend;
      const isIncome = earnValue !== null && earnValue > 0;

      const initialType = isIncome ? "income" : "expense";
      const initialData = {
        text:
          transaction?.content ||
          message.message ||
          message.originalPrompt ||
          "",
        amount: isIncome ? earnValue || 0 : spendValue || 0,
        categoryId: transaction?.categoryId || message.categoryId || "",
        walletId: transaction?.walletId || message.walletId || "",
        type: initialType as "expense" | "income",
      };

      setFormData(initialData);
      setConfirmDelete(false);
      setSaveStatus("idle");
      setConfirmDelete(false);
    }
  }, [message, open]);

  const handleSave = useCallback(
    async (data: typeof formData, isManual = false) => {
      if (!message) return;
      setSaveStatus("saving");
      try {
        await onSave({
          ...message,
          message: data.text,
          spend: data.type === "expense" ? data.amount : null,
          earn: data.type === "income" ? data.amount : null,
          categoryId: data.categoryId || null,
          walletId: data.walletId || null,
        });
        setSaveStatus("saved");
        onOpenChange(false);
      } catch (error) {
        setSaveStatus("error");
      }
    },
    [message, onSave]
  );

  // useEffect(() => {
  //   if (!message || !open || isInitialMount.current) {
  //     isInitialMount.current = false;
  //     return;
  //   }

  //   if (retryCount > 0 && retryCount <= MAX_RETRIES && saveStatus === "error") {
  //     const retryTimer = setTimeout(() => {
  //       handleSave(formData);
  //     }, 2000 * retryCount);
  //     return () => clearTimeout(retryTimer);
  //   }

  //   // Debounce: Chỉ tự động cập nhật nếu dữ liệu khác với lần lưu cuối
  //   if (
  //     retryCount === 0 &&
  //     JSON.stringify(formData) !== lastSavedData.current
  //   ) {
  //     const timer = setTimeout(() => {
  //       handleSave(formData);
  //     }, 800);
  //     return () => clearTimeout(timer);
  //   }
  // }, [formData, message, open, retryCount, saveStatus, handleSave]);

  if (!message) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-6 rounded-4xl gap-0 border-none shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold text-center text-gray-800 flex items-center justify-center gap-2">
            Chi tiết giao dịch
            {saveStatus === "saving" && (
              <Loader2 size={16} className="animate-spin text-indigo-500" />
            )}
            {saveStatus === "saved" && (
              <Check
                size={16}
                className="text-emerald-500 animate-in fade-in zoom-in"
              />
            )}
            {saveStatus === "error" && (
              <div className="flex items-center gap-1">
                <AlertCircle size={16} className="text-rose-500" />
                <button
                  onClick={() => handleSave(formData, true)}
                  className="text-[10px] bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full hover:bg-rose-100 transition-colors"
                >
                  Thử lại
                </button>
              </div>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="w-full pb-4">
          {/* Toggle Thu/Chi */}
          <div className="flex bg-gray-100 p-1 rounded-2xl mb-6">
            <button
              onClick={() => setFormData({ ...formData, type: "expense" })}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                formData.type === "expense"
                  ? "bg-white text-rose-600 shadow-sm scale-[1.02]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Chi tiêu
            </button>
            <button
              onClick={() => setFormData({ ...formData, type: "income" })}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                formData.type === "income"
                  ? "bg-white text-emerald-600 shadow-sm scale-[1.02]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Thu nhập
            </button>
          </div>

          <div className="relative mb-4">
            <div
              className={`absolute top-1/2 left-4 -translate-y-1/2 font-bold text-lg ${
                formData.type === "expense"
                  ? "text-rose-400"
                  : "text-emerald-400"
              }`}
            >
              ₫
            </div>
            <input
              type="number"
              value={formData.amount || ""}
              onChange={(e) =>
                setFormData({ ...formData, amount: Number(e.target.value) })
              }
              className={`w-full p-4 pl-10 text-3xl font-bold text-center bg-transparent border-b-2 outline-none transition-all placeholder-gray-200 ${
                formData.type === "expense"
                  ? "text-rose-600 border-rose-100 focus:border-rose-500"
                  : "text-emerald-600 border-emerald-100 focus:border-emerald-500"
              }`}
              placeholder="0"
              autoFocus
            />
          </div>

          <div className="mb-6 px-1">
            <input
              value={formData.text}
              onChange={(e) =>
                setFormData({ ...formData, text: e.target.value })
              }
              className="w-full p-3 bg-gray-50 rounded-xl text-base font-medium text-gray-700 border border-transparent focus:bg-white focus:border-indigo-200 outline-none transition-all text-center"
              placeholder="Nhập nội dung giao dịch..."
            />
          </div>

          <div className="space-y-6">
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">
                Ví thanh toán
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {wallets.map((w: Wallet) => {
                  const isSelected = formData.walletId === w.id;
                  const template =
                    WALLET_TEMPLATES.find((t) => t.code === w.icon) ||
                    WALLET_TEMPLATES.find((t) => t.code === "custom");

                  return (
                    <button
                      key={w.id}
                      onClick={() =>
                        setFormData({ ...formData, walletId: w.id })
                      }
                      style={{
                        borderColor: isSelected ? template?.color : undefined,
                        backgroundColor: isSelected
                          ? template?.bgLight
                          : undefined,
                        color: isSelected ? template?.text : undefined,
                      }}
                      className={`flex flex-col items-start gap-1 px-4 py-2.5 rounded-xl border transition-all min-w-[120px] `}
                    >
                      <div className="flex items-center gap-2">
                        {template?.img ? (
                          <img
                            src={template.img}
                            alt={w.name}
                            className="w-5 h-5 object-contain"
                          />
                        ) : (
                          <span className="text-lg">💰</span>
                        )}
                        <span className="text-sm whitespace-nowrap">
                          {w.name}
                        </span>
                      </div>
                      <div
                        className={`text-[10px] font-medium ${
                          isSelected ? "" : "text-gray-400"
                        }`}
                      >
                        {formatCurrency(w.balance)} ₫
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">
                Danh mục
              </div>
              <div className="flex flex-wrap gap-2">
                {!categoriesDefault || categoriesDefault.length === 0 ? (
                  <div className="text-xs text-amber-500 italic px-1 py-2">
                    Nhu liệu: Không tìm thấy danh mục từ Backend.
                  </div>
                ) : (
                  categoriesDefault.map((c) => {
                    const isSelected = formData.categoryId === c.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() =>
                          setFormData({ ...formData, categoryId: c.id })
                        }
                        className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? formData.type === "expense"
                              ? "bg-rose-500 text-white border-rose-500 shadow-rose-200 shadow-md transform scale-105"
                              : "bg-emerald-500 text-white border-emerald-500 shadow-emerald-200 shadow-md transform scale-105"
                            : "bg-white text-gray-600 border-gray-100 hover:border-gray-300"
                        }`}
                      >
                        {c.name}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
            <DialogFooter className="gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="shadow-md font-semibold"
              >
                Hủy
              </Button>
              <Button
                type="button"
                onClick={() => handleSave(formData, true)}
                disabled={saveStatus === "saving"}
                className={`bg-linear-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-xl hover:shadow-2xl transition-all duration-300 font-semibold flex items-center justify-center gap-2 ${
                  saveStatus === "saving"
                    ? "opacity-80 pointer-events-none"
                    : ""
                }`}
                loading={saveStatus === "saving"}
              >
                Lưu
              </Button>
            </DialogFooter>
          </div>

          <div className="mt-8 border-t border-gray-50 flex justify-center">
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="text-gray-400 hover:text-rose-500 transition-colors text-xs font-bold flex items-center gap-1 py-2 px-4 rounded-full hover:bg-rose-50"
              >
                <Trash2 size={14} />{" "}
                <span className="pt-0.5">Xóa giao dịch này</span>
              </button>
            ) : (
              <div className="flex items-center gap-3 animate-in fade-in zoom-in">
                <span className="text-xs text-rose-500 font-bold">
                  Bạn chắc chắn?
                </span>
                <button
                  onClick={async () => {
                    await onDelete(message.id);
                    onOpenChange(false);
                  }}
                  className="bg-rose-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:bg-rose-600"
                >
                  Xóa luôn
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-200"
                >
                  Hủy
                </button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
