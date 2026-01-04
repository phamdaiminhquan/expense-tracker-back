import React, { useState, useEffect } from "react";
import { WALLET_TEMPLATES } from "@/pages/message/message.constant";
import { createWallet, deleteWallet } from "@/apis/wallets/wallet.api";
import { WalletType } from "@/apis/wallets/wallet.enum";
import { CreateWalletDto } from "@/apis/wallets/wallet.interface";
import { toast } from "sonner";
import { WalletList } from "../wallet/wallet-list.element";
import { WalletTemplates } from "../wallet/wallet-template.element";
import { WalletForm } from "../wallet/wallet-form.element";

interface Props {
  open: boolean;
  onClose: () => void;
  selectedWalletId: string;
  onSelect: (id: string) => void;
  data: any;
  mutate: () => Promise<any>;
  createOnly?: boolean;
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

const DialogWalletSelector: React.FC<Props> = ({
  open,
  onClose,
  selectedWalletId,
  onSelect,
  data,
  mutate,
  createOnly = false,
}) => {
  // Initial view state logic
  const [modalView, setModalView] = useState<"list" | "templates" | "form">(
    createOnly ? "templates" : "list"
  );

  const [loading, setLoading] = useState(false);
  const [formBalance, setFormBalance] = useState<number | string>(0);
  const [chosenTemplate, setChosenTemplate] = useState<any>(
    WALLET_TEMPLATES[0]
  );
  const [formName, setFormName] = useState("");

  // Reset view when opening/closing or changing mode
  useEffect(() => {
    if (open) {
      if (createOnly) {
        setModalView("templates");
      } else {
        // Always start at list view if not createOnly,
        // even if empty (WalletList handles empty state now)
        setModalView("list");
      }
    }
  }, [open, createOnly]);

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
      handleClose();
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
      <div className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl relative z-10 animate-in slide-in-from-bottom duration-300 max-h-[90vh] flex flex-col min-h-[50vh]">
        {modalView === "list" && (
          <WalletList
            data={data}
            selectedWalletId={selectedWalletId}
            onSelect={(id) => {
              onSelect(id);
              handleClose();
            }}
            onDelete={handleDelete}
            onAddNew={() => setModalView("templates")}
            onClose={handleClose}
          />
        )}

        {modalView === "templates" && (
          <WalletTemplates
            onSelectTemplate={(tpl) => {
              setChosenTemplate(tpl);
              setFormName(tpl.name);
              setModalView("form");
            }}
            onBack={() => setModalView("list")}
            canGoBack={!createOnly}
          />
        )}

        {modalView === "form" && (
          <WalletForm
            onBack={() => setModalView("templates")}
            onSubmit={handleCreate}
            formName={formName}
            setFormName={setFormName}
            formBalance={formBalance}
            setFormBalance={setFormBalance}
            chosenTemplate={chosenTemplate}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default DialogWalletSelector;
