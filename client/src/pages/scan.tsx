import { useState } from "react";
import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { GlassmorphicCard } from "@/components/glassmorphic-card";
import {
  Shield,
  Search,
  AlertTriangle,
  ShieldCheck,
  Menu,
  X,
  CheckCircle,
  XCircle
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useScanHistory } from "@/hooks/useScanHistory";
import { useToast } from "@/hooks/use-toast";

type ScanResult = {
  status: "SCAM" | "SAFE";
  probability: number;
  reasons: string[];
};

// --- FIX: Updated URL to match Flask backend's exact address and port ---
// Flask backend is running on http://192.168.1.2:5001 and the route is /predict
async function sendScanToModel(message: string) {
  // CHANGED THIS LINE: Use the actual IP address your Flask backend is running on
  const res = await fetch("http://192.168.1.2:5001/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    // Attempt to parse error message from backend if available
    const errorData = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(`Failed to scan via model API: ${errorData.error || res.statusText}`);
  }
  return res.json();
}

export default function Scan() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const { userId, isLoading } = useUser();
  const { addScanResult } = useScanHistory(userId);
  const { toast } = useToast();

  const scanMutation = useMutation({
    mutationFn: async () => {
      const data = await sendScanToModel(message.trim());
      return {
        status: data.status,
        probability: data.probability,
        reasons: data.reasons,
      };
    },
    onSuccess: (data) => {
      setScanResult({
        status: data.status as "SCAM" | "SAFE",
        probability: data.probability,
        reasons: data.reasons,
      });
      // Save to Firebase
      addScanResult({
        message,
        status: data.status,
        probability: data.probability,
        reasons: data.reasons,
        platform: "SMS"
      }).then(() => {
        toast({
          title: "Scan saved!",
          description: `Result: ${data.status} (${data.probability}%)`,
        });
      }).catch(() => {
        toast({
          title: "Error saving scan result",
          description: "Could not save scan to history.",
          variant: "destructive"
        });
      });
      setMessage(""); // Clear input after success
    },
    onError: (error) => {
      console.error("Scan failed:", error);
      toast({
        title: "Scan failed",
        description: error.message || "Could not analyze the message. Please try again.", // IMPROVED ERROR MESSAGE
        variant: "destructive"
      });
    },
  });

  const handleScan = () => {
    if (!message.trim()) return;
    scanMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-cyan-500">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mb-4" />
          <span className="text-white text-xl font-semibold">Loading user...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="relative z-50">
        <nav className="glass-effect fixed w-full top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center">
                      <Shield className="text-white w-4 h-4" />
                    </div>
                    <span className="text-white font-bold text-xl">PaySafe</span>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-8">
                  <Link href="/" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200">Home</Link>
                  <Link href="/scan" className="text-blue-400 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200">Scan</Link>
                  <Link href="/history" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200">History</Link>
                  <Link href="/about" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200">About</Link>
                </div>
              </div>
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-gray-300 hover:text-white focus:outline-none focus:text-white transition-colors duration-200"
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
              </div>
            </div>
            {isMobileMenuOpen && (
              <div className="md:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 glass-effect-blue mt-2 rounded-lg">
                  <Link href="/" className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium transition-colors duration-200">Home</Link>
                  <Link href="/scan" className="text-blue-400 hover:text-white block px-3 py-2 text-base font-medium transition-colors duration-200">Scan</Link>
                  <Link href="/history" className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium transition-colors duration-200">History</Link>
                  <Link href="/about" className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium transition-colors duration-200">About</Link>
                </div>
              </div>
            )}
          </div>
        </nav>
      </header>

      <main className="pt-16">
        <section className="py-20 lg:py-32">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl mb-6">
                <Search className="text-white w-6 h-6" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Scan a Message</h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Paste your suspicious message below and let our AI analyze it for potential scam indicators
              </p>
            </div>

            <GlassmorphicCard className="mb-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-medium text-white mb-3">Paste your SMS or chat message here</label>
                  <Textarea
                    placeholder="Example: Congratulations! You've won $10,000! Click here to claim your prize now..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[120px] bg-white/5 border-white/10 text-white placeholder-gray-400 resize-none focus:border-blue-400 focus:ring-blue-400"
                  />
                </div>
                <Button
                  onClick={handleScan}
                  disabled={isLoading || !message.trim() || scanMutation.isPending}
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white font-semibold rounded-xl transition-all duration-300 text-lg border-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {scanMutation.isPending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      Scan Now
                    </>
                  )}
                </Button>
              </div>
            </GlassmorphicCard>

            {scanResult && (
              <GlassmorphicCard variant="blue" className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
                <div className="text-center">
                  <div className="mb-6">
                    {scanResult.status === "SCAM" ? (
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full mb-4">
                        <XCircle className="text-white w-10 h-10" />
                      </div>
                    ) : (
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full mb-4">
                        <CheckCircle className="text-white w-10 h-10" />
                      </div>
                    )}
                    <h2 className={`text-3xl font-bold mb-2 ${scanResult.status === "SCAM" ? "text-red-400" : "text-green-400"}`}>
                      {scanResult.status}
                    </h2>
                    <p className="text-xl text-gray-300">
                      {scanResult.probability}% {scanResult.status === "SCAM" ? "Likely Scam" : "Appears Safe"}
                    </p>
                  </div>

                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-white mb-4">Analysis Details:</h3>
                    <ul className="space-y-2">
                      {scanResult.reasons.map((reason, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${scanResult.status === "SCAM" ? "bg-red-400" : "bg-green-400"}`} />
                          <span className="text-gray-300">{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/10">
                    <Button
                      onClick={() => {
                        setMessage("");
                        setScanResult(null);
                      }}
                      variant="ghost"
                      className="glass-effect px-6 py-3 text-white font-medium rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/10"
                    >
                      Scan Another Message
                    </Button>
                  </div>
                </div>
              </GlassmorphicCard>
            )}
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">© 2025 PaySafe. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
