import { CheckCircle2, AlertTriangle } from "lucide-react";

interface PredictionResultProps {
  prediction: string;
  confidence: number;
}

const PredictionResult = ({ prediction, confidence }: PredictionResultProps) => {
  const isHealthy = prediction.toLowerCase().includes("healthy");
  const confidenceColor =
    confidence >= 80 ? "text-success" : confidence >= 50 ? "text-warning" : "text-destructive";

  return (
    <div className="w-full rounded-xl border border-border bg-card p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-start gap-4">
        <div
          className={`p-3 rounded-full shrink-0 ${
            isHealthy ? "bg-success/10" : "bg-warning/10"
          }`}
        >
          {isHealthy ? (
            <CheckCircle2 className="w-6 h-6 text-success" />
          ) : (
            <AlertTriangle className="w-6 h-6 text-warning" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-muted-foreground mb-1">Detected Condition</p>
          <h3 className="text-2xl font-bold text-foreground font-serif">{prediction}</h3>
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Confidence</span>
              <span className={`text-sm font-semibold ${confidenceColor}`}>
                {confidence.toFixed(1)}%
              </span>
            </div>
            <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-1000 ease-out"
                style={{ width: `${confidence}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionResult;
