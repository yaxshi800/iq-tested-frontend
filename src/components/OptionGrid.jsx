import clsx from "clsx";

export default function OptionGrid({ options, selectedIndex, onSelect }) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {options.map((opt, i) => {
        const selected = selectedIndex === i;
        return (
          <button
            key={i}
            onClick={() => onSelect(i)}
            className={clsx(
              "group flex items-center gap-3 rounded-xl border px-4 py-4 text-left transition-all",
              selected
                ? "border-indigo-400 bg-indigo-500/20 text-white shadow-lg shadow-indigo-500/20"
                : "border-white/10 bg-white/5 text-slate-200 hover:border-indigo-400/50 hover:bg-white/10"
            )}
          >
            <span
              className={clsx(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-sm font-bold",
                selected
                  ? "border-indigo-400 bg-indigo-500 text-white"
                  : "border-white/20 bg-white/5 text-slate-300 group-hover:border-indigo-400/60"
              )}
            >
              {i + 1}
            </span>
            <span className="text-sm md:text-base">{opt}</span>
          </button>
        );
      })}
    </div>
  );
}