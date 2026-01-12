interface Props {
  value: "day" | "week" | "month";
  onChange: (v: "day" | "week" | "month") => void;
}

export default function PeriodToggle({ value, onChange }: Props) {
  return (
    <div className="inline-flex bg-gray-100 rounded-lg p-1">
      {["day", "week", "month"].map(p => (
        <button
          key={p}
          onClick={() => onChange(p as any)}
          className={`px-4 py-1.5 text-sm rounded-md transition ${
            value === p
              ? "bg-white shadow font-medium"
              : "text-gray-500"
          }`}
        >
          {p.charAt(0).toUpperCase() + p.slice(1)}
        </button>
      ))}
    </div>
  );
}
