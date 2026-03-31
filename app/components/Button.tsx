import { on } from "events";
import { LoaderCircle } from "lucide-react";
import { ReactNode } from "react";
interface ButtonProps {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function Button({ children, onClick, disabled, loading }: ButtonProps) {
  return (
    <button
      onClick={() => onClick()}
      className={`flex items-center justify-center ml-auto w-50 px-6 py-2 bg-indigo-500 text-white rounded-lg transition shadow-sm text-base font-semibold ${
        disabled ? "cursor-not-allowed! opacity-50!" : ""
      }`}
      disabled={disabled}
    >
      {loading ? <LoaderCircle className="loading" /> : children}
    </button>
  );
}
