import {
  Banknote,
  Wallet,
  CreditCard,
  Coffee,
  ShoppingBag,
  Car,
  Zap,
  Home,
  Smartphone,
  DollarSign,
  Gift,
  TrendingUp,
  Briefcase,
} from "lucide-react";

export const THEME_COLORS = {
  bg: "bg-[#FAFAFA]", // Màu nền tổng thể
  text: "text-gray-800",
  smartModeGradient:
    "bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500",
  expense: {
    text: "text-rose-500",
    bg: "bg-rose-500",
    shadow: "shadow-rose-200",
    ring: "focus-within:ring-rose-100",
  },
  income: {
    text: "text-emerald-600",
    bg: "bg-emerald-500",
    shadow: "shadow-emerald-200",
    ring: "focus-within:ring-emerald-100",
  },
};

export const WALLETS_UI = [
  {
    id: "cash",
    name: "Tiền mặt",
    icon: <Banknote size={18} />,
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "momo",
    name: "Momo",
    icon: <Wallet size={18} />,
    color: "bg-pink-100 text-pink-700",
  },
  {
    id: "visa",
    name: "Visa Techcom",
    icon: <CreditCard size={18} />,
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: "vcb",
    name: "Vietcombank",
    icon: <CreditCard size={18} />,
    color: "bg-green-100 text-green-700",
  },
  {
    id: "mb",
    name: "MB Bank",
    icon: <CreditCard size={18} />,
    color: "bg-blue-200 text-blue-800",
  },
  {
    id: "zalo",
    name: "ZaloPay",
    icon: <Wallet size={18} />,
    color: "bg-cyan-100 text-cyan-700",
  },
];

export const CATEGORIES_UI = {
  expense: [
    { id: "food", label: "Ăn uống", icon: <Coffee size={16} /> },
    { id: "shopping", label: "Mua sắm", icon: <ShoppingBag size={16} /> },
    { id: "transport", label: "Di chuyển", icon: <Car size={16} /> },
    { id: "bill", label: "Hóa đơn", icon: <Zap size={16} /> },
    { id: "house", label: "Nhà cửa", icon: <Home size={16} /> },
    { id: "phone", label: "Điện thoại", icon: <Smartphone size={16} /> },
  ],
  income: [
    { id: "salary", label: "Lương", icon: <DollarSign size={16} /> },
    { id: "bonus", label: "Thưởng", icon: <Gift size={16} /> },
    { id: "invest", label: "Đầu tư", icon: <TrendingUp size={16} /> },
    { id: "freelance", label: "Freelance", icon: <Briefcase size={16} /> },
  ],
};

export type OptimisticMessageStatus =
  | "analyzing"
  | "done"
  | "network_error"
  | "ai_error";

export const WALLET_TEMPLATES = [
  {
    code: "cash",
    name: "Tiền mặt",
    color: "#10B981", // emerald-500
    text: "#10B981",
    bgLight: "#ECFDF5", // emerald-50
    icon: "cash",
  },
  {
    code: "momo",
    name: "MoMo",
    color: "#A50064",
    text: "#A50064",
    bgLight: "#FDF2F8", // pink-50
    icon: "momo",
  },
  {
    code: "vcb",
    name: "Vietcombank",
    color: "#74B156",
    text: "#74B156",
    bgLight: "#F0FDF4", // green-50
    icon: "vcb",
  },
  {
    code: "tpb",
    name: "TPBank",
    color: "#8B5CF6",
    text: "#8B5CF6",
    bgLight: "#F5F3FF", // purple-50
    icon: "tpb",
  },
  {
    code: "mb",
    name: "MB Bank",
    color: "#1D4ED8",
    text: "#1D4ED8",
    bgLight: "#EFF6FF", // blue-50
    icon: "mb",
  },
  {
    code: "zalopay",
    name: "ZaloPay",
    color: "#0068FF",
    text: "#0068FF",
    bgLight: "#ECFEFF", // cyan-50
    icon: "zalopay",
  },
  {
    code: "custom",
    name: "Ví tùy chỉnh",
    color: "#4B5563", // gray-600
    text: "#4B5563",
    bgLight: "#F3F4F6", // gray-100
    icon: "custom",
  },
];
