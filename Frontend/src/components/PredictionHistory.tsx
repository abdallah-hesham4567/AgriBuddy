import { useState, useEffect } from "react";
import { History, Trash2, Clock, ChevronDown, ChevronUp } from "lucide-react";

export interface PredictionRecord {
  id: string;
  prediction: string;
  confidence: number;
  imageName: string;
  timestamp: number;
}

const STORAGE_KEY = "potato-disease-history";

export const loadHistory = (): PredictionRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveToHistory = (record: Omit<PredictionRecord, "id" | "timestamp">) => {
  const history = loadHistory();
  const entry: PredictionRecord = {
    ...record,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };
  const updated = [entry, ...history].slice(0, 20);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const clearHistory = () => {
  localStorage.removeItem(STORAGE_KEY);
};

const PredictionHistory = ({
  history,
  onClear,
}: {
  history: PredictionRecord[];
  onClear: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (history.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
      >
        <div className="flex items-center gap-2 text-foreground font-medium">
          <History className="w-4 h-4 text-primary" />
          <span>Past Analyses</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
            {history.length}
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {isOpen && (
        <div className="border-t border-border animate-in fade-in slide-in-from-top-2 duration-300">
          <ul className="divide-y divide-border max-h-72 overflow-y-auto">
            {history.map((record) => (
              <li key={record.id} className="px-4 py-3 hover:bg-secondary/30 transition-colors">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm text-foreground">{record.prediction}</p>
                  <span
                    className={`text-xs font-semibold ${
                      record.confidence >= 80
                        ? "text-success"
                        : record.confidence >= 50
                        ? "text-warning"
                        : "text-destructive"
                    }`}
                  >
                    {record.confidence.toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(record.timestamp).toLocaleString()}</span>
                  <span className="mx-1">·</span>
                  <span className="truncate max-w-[140px]">{record.imageName}</span>
                </div>
              </li>
            ))}
          </ul>
          <div className="p-3 border-t border-border">
            <button
              onClick={onClear}
              className="flex items-center gap-1.5 text-xs text-destructive hover:text-destructive/80 transition-colors mx-auto"
            >
              <Trash2 className="w-3 h-3" />
              Clear History
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionHistory;
