import { ArrowBigUp } from "lucide-react";
import React from "react";

export function TextAreaInput({
  value,
  onChange,
  maxLength,
}: {
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
}) {
  return (
    <div className="flex flex-col justify-center">
      <textarea
        className="border-2 border-slate-300 rounded-xl p-4 min-h-40"
        placeholder="Cole, escreva ou carregue um texto para análise (max 500.000 caracteres)"
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
      />

      <p className="text-slate-500 -mt-2! mr-4! text-sm self-end">
        {value.length}/{maxLength}
      </p>
    </div>
  );
}
