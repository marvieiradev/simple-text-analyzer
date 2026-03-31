export function TabSwitcher({
  tab,
  setTab,
}: {
  tab: string;
  setTab: (value: string) => void;
}) {
  return (
    <div className="flex justify-center mt-2!">
      <div className="bg-white shadow-sm rounded-xl p-1 flex gap-1">
        <button
          onClick={() => setTab("analise")}
          className={`px-6 py-2 rounded-lg transition font-medium text-sm ${
            tab === "analise"
              ? "bg-indigo-500 text-white shadow"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Análise
        </button>

        <button
          onClick={() => setTab("comparacao")}
          className={`px-6 py-2 rounded-lg transition font-medium text-sm ${
            tab === "comparacao"
              ? "bg-indigo-500 text-white shadow"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Comparação
        </button>
      </div>
    </div>
  );
}
