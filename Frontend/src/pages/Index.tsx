import { useState, useEffect } from "react";
import { Leaf, Loader2, AlertCircle } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import PredictionResult from "@/components/PredictionResult";
import PredictionHistory, {
  loadHistory,
  saveToHistory,
  clearHistory,
  type PredictionRecord,
} from "@/components/PredictionHistory";
import heroBg from "@/assets/hero-bg.jpg";


const API_URL = "http://127.0.0.1:5000/predict";

interface PredictionResponse {
  prediction: string;
  confidence: number;
}

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<PredictionRecord[]>([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const handlePredict = async () => {
    if (!selectedImage) {
      setError("Please upload an image first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedImage);

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error (${response.status}). Please try again.`);
      }

      const data: PredictionResponse = await response.json();
      setResult(data);
      const updated = saveToHistory({
        prediction: data.prediction,
        confidence: data.confidence,
        imageName: selectedImage.name,
      });
      setHistory(updated);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please check your connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageClear = () => {
    setSelectedImage(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero section */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 to-background" />

        <header className="relative z-10 pt-8 pb-16 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Leaf className="w-4 h-4" />
              <span>AI-Powered Crop Health</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              AgriBuddy
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto">
              Upload a photo of your potato or potato leaf to identify diseases early
              and protect your harvest.
            </p>
          </div>
        </header>
      </div>

      {/* Main content */}
      <main className="relative z-10 px-4 pb-16 -mt-4">
        <div className="max-w-lg mx-auto space-y-6">
          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <ImageUpload
              onImageSelect={setSelectedImage}
              onImageClear={handleImageClear}
              selectedImage={selectedImage}
            />

            <button
              onClick={handlePredict}
              disabled={!selectedImage || isLoading}
              className="w-full mt-5 py-3.5 px-6 rounded-xl font-semibold text-primary-foreground bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing…
                </>
              ) : (
                <>
                  <Leaf className="w-5 h-5" />
                  Predict Disease
                </>
              )}
            </button>
          </section>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive animate-in fade-in slide-in-from-bottom-2">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* History */}
          <PredictionHistory
            history={history}
            onClear={() => {
              clearHistory();
              setHistory([]);
            }}
          />

          {/* Result */}
          {result && (
            <PredictionResult
              prediction={result.prediction}
              confidence={result.confidence}
            />
          )}

          {/* Disclaimer */}
          <p className="text-xs text-center text-muted-foreground px-4">
            Predictions are probabilistic and should be verified by agricultural experts.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
