import React, { useState } from "react";
import useSWR from "swr";
import {
  Plus,
  ChevronLeft,
  Check,
  Edit3,
  Banknote,
  Wallet as WalletIcon,
  CreditCard,
  Trash,
} from "lucide-react";
import { WALLET_TEMPLATES } from "@/pages/message/message.constant";
import {
  getListWallets,
  createWallet,
  deleteWallet,
} from "@/apis/wallets/wallet.api";
import { WalletType } from "@/apis/wallets/wallet.enum";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/currency";
import { Wallet } from "@/apis/wallets/wallet.entities";
import { CreateWalletDto } from "@/apis/wallets/wallet.interface";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  selectedWalletId: string;
  onSelect: (id: string) => void;
  data: any;
  mutate: () => Promise<any>;
}

const mapTemplateToCreate = (tpl: any) => {
  const code = tpl.code;
  let type = WalletType.OTHERS;
  if (code === "cash") type = WalletType.CASH;
  else if (["vcb", "tpb", "mb"].includes(code)) type = WalletType.BANK;
  else if (["momo", "zalopay"].includes(code)) type = WalletType.E_WALLET;
  else type = WalletType.OTHERS;

  return {
    type,
    icon: tpl.icon || "wallet",
    color: tpl.color || "#888",
  };
};

const WalletSelectorModal: React.FC<Props> = ({
  open,
  onClose,
  selectedWalletId,
  onSelect,
  data,
  mutate,
}) => {
  const [modalView, setModalView] = useState<"list" | "templates" | "form">(
    "list"
  );
  const [loading, setLoading] = useState(false);
  const [formBalance, setFormBalance] = useState<number | string>(0);
  const [chosenTemplate, setChosenTemplate] = useState<any>(
    WALLET_TEMPLATES[0]
  );
  const [formName, setFormName] = useState("");

  const handleCreate = async () => {
    const tpl = chosenTemplate || WALLET_TEMPLATES[0];
    const mapped = mapTemplateToCreate(tpl);
    const body: CreateWalletDto = {
      name: formName || tpl.name,
      balance: Number(formBalance) || 0,
      type: mapped.type,
      icon: mapped.icon,
      color: tpl.color || "#000",
    };
    setLoading(true);
    try {
      const created = await createWallet(body);
      if (mutate) await mutate();
      onSelect(created.id);
    } catch (error) {
      toast.error("Tạo ví thất bại");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await deleteWallet(id);
      toast.success("Đã xóa ví thành công!");
      if (mutate) await mutate();
    } catch (error) {
      toast.error("Xóa ví thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setModalView("list");
    setFormName("");
    setFormBalance(0);
    onClose();
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />
      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl relative z-10 animate-in slide-in-from-bottom duration-300 max-h-[90vh] flex flex-col min-h-[50vh]">
        {modalView === "list" && (
          <>
            <div className="flex justify-between items-center mb-6 px-1">
              <h3 className="text-lg font-bold text-gray-800">Chọn ví nguồn</h3>
              <button
                onClick={() => setModalView("templates")}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 overflow-y-auto pb-6">
              {data?.data.map((w) => {
                const style =
                  WALLET_TEMPLATES.find((t) => t.code === w.icon) ||
                  WALLET_TEMPLATES.find((t) => t.code === "custom");
                const isSelected = selectedWalletId === w.id;
                return (
                  <div key={w.id} className="relative group">
                    <button
                      onClick={() => {
                        onSelect(w.id);
                        handleClose();
                      }}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all overflow-hidden text-left ${
                        isSelected
                          ? "bg-indigo-50 border-indigo-500 shadow-sm"
                          : "bg-white border-gray-100 hover:border-gray-300"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center `}
                        style={{
                          backgroundColor: style?.bgLight || "#F9FAFB",
                          color: style?.text || "#374151",
                        }}
                      >
                        {/* pick icon */}
                        {style?.icon === "wallet" ? (
                          <WalletIcon size={20} />
                        ) : style?.icon === "card" ? (
                          <CreditCard size={20} />
                        ) : (
                          <Banknote size={20} />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-gray-800 text-sm">
                          {w.name}
                        </div>
                        <div
                          className={`text-xs font-medium mt-0.5 ${
                            isSelected ? "text-indigo-600" : "text-gray-400"
                          }`}
                        >
                          Số dư: {formatCurrency(w.balance || 0)}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="bg-indigo-500 text-white p-1 rounded-full">
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                    </button>

                    <button className="absolute right-16 top-1/2 -translate-y-1/2 p-2 text-gray-300 hover:text-indigo-500 transition-colors">
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(w.id)}
                      className="absolute right-10 top-1/2 -translate-y-1/2 p-2 text-gray-300 hover:text-indigo-500 transition-colors"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {modalView === "templates" && (
          <>
            <div className="flex justify-between items-center mb-6 px-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setModalView("list")}
                  className="p-1 -ml-1 text-gray-400 hover:text-gray-800"
                >
                  <ChevronLeft size={24} />
                </button>
                <h3 className="text-lg font-bold text-gray-800">Thêm ví mới</h3>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 overflow-y-auto pb-6">
              {WALLET_TEMPLATES.map((tpl) => {
                let Icon = Banknote;
                if (tpl.icon === "wallet") Icon = WalletIcon;
                if (tpl.icon === "card") Icon = CreditCard;
                return (
                  <button
                    key={tpl.code}
                    onClick={() => {
                      setChosenTemplate(tpl);
                      setFormName(tpl.name);
                      setModalView("form");
                    }}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-all text-center"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mb-1`}
                      style={{
                        backgroundColor: tpl.bgLight,
                        color: tpl.text,
                      }}
                    >
                      <Icon size={20} />
                    </div>
                    <div className="font-bold text-xs text-gray-700">
                      {tpl.name}
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {modalView === "form" && (
          <>
            <div className="flex justify-between items-center mb-6 px-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setModalView("templates")}
                  className="p-1 -ml-1 text-gray-400 hover:text-gray-800"
                >
                  <ChevronLeft size={24} />
                </button>
                <h3 className="text-lg font-bold text-gray-800">
                  Thiết lập ví
                </h3>
              </div>
            </div>

            <div className="flex-1 space-y-6">
              <div className="flex justify-center mb-6">
                <div
                  className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-md`}
                  style={{
                    backgroundColor: chosenTemplate?.bgLight || "#F3F4F6",
                    color: chosenTemplate?.color || "#374151",
                  }}
                >
                  {/* icon preview */}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                  Tên hiển thị
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder={chosenTemplate?.name}
                  className="w-full p-4 bg-gray-50 rounded-2xl text-gray-800 font-semibold focus:ring-2 focus:ring-indigo-100 outline-none border border-transparent focus:border-indigo-200 transition-all"
                />
                <p className="text-[10px] text-gray-400 ml-1">
                  Ví dụ: MoMo Cá nhân, VCB Lương...
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                  Số dư hiện tại
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formBalance}
                    onChange={(e) => setFormBalance(e.target.value)}
                    className="w-full p-4 pl-4 pr-12 bg-gray-50 rounded-2xl text-gray-800 font-bold text-lg focus:ring-2 focus:ring-emerald-100 outline-none border border-transparent focus:border-emerald-200 transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                    VNĐ
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-auto">
              <Button
                onClick={() => {
                  handleCreate();
                  handleClose();
                }}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Check size={20} /> Tạo ví ngay
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WalletSelectorModal;
