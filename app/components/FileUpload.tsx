import { ArrowBigUp } from "lucide-react";

interface FileUploadProps {
  onLoadText: (text: string) => void;
  fileName: string;
  setFileName: (name: string) => void;
  maxLength?: number;
  id?: string;
}

export function FileUpload({
  onLoadText,
  fileName,
  setFileName,
  maxLength = 500000,
  id = "file",
}: FileUploadProps) {
  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();

    reader.onload = (event: ProgressEvent<FileReader>) => {
      const text = (event.target?.result as string) || "";
      const limitedText = text.slice(0, maxLength);
      onLoadText(limitedText);
    };

    reader.readAsText(file);
  }

  return (
    <div className="ml-2!">
      <div className="flex items-center gap-3">
        <label
          htmlFor={id}
          className="flex items-center gap-2 px-3 py-1 bg-emerald-400 text-white rounded-lg cursor-pointer"
        >
          <ArrowBigUp size={18} />
          Selecionar Texto
        </label>

        <input
          id={id}
          type="file"
          accept=".txt"
          onChange={handleFile}
          className="hidden"
        />

        {fileName && (
          <span className="text-slate-500 font-semibold text-sm">
            {fileName}
          </span>
        )}
      </div>
    </div>
  );
}
