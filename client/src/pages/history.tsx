import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { GlassmorphicCard } from "@/components/glassmorphic-card";
import { 
  Shield, 
  Menu,
  X,
  Clock,
  Search,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Plus
} from "lucide-react";

type ScanHistoryItem = {
  id: number;
  message: string;
  platform: string;
  status: "SCAM" | "SAFE";
  probability: number;
  reasons: string[];
  createdAt: string;
};

export default function History() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  // Fetch scan history
  const { data: scanHistory, isLoading } = useQuery({
    queryKey: ["scan-history"],
    queryFn: async () => {
      const response = await fetch("/api/scans");
      if (!response.ok) {
        throw new Error("Failed to fetch scan history");
      }
      return response.json() as ScanHistoryItem[];
    },
  });

  // Delete scan mutation
  const deleteScanMutation = useMutation({
    mutationFn: async (scanId: number) => {
      const response = await fetch(`/api/scans/${scanId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete scan");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scan-history"] });
    },
    onError: (error) => {
      console.error("Failed to delete scan:", error);
    },
  });

  const handleDeleteScan = (scanId: number) => {
    if (confirm("Are you sure you want to delete this scan result?")) {
      deleteScanMutation.mutate(scanId);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateMessage = (message: string, maxLength: number = 80) => {
    return message.length > maxLength ? `${message.substring(0, maxLength)}...` : message;
  };

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="relative z-50">
        <nav className="glass-effect fixed w-full top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
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
              
              {/* Desktop Navigation */}
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-8">
                  <Link href="/" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200">Home</Link>
                  <Link href="/scan" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200">Scan</Link>
                  <Link href="/history" className="text-blue-400 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200">History</Link>
                  <a href="#" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200">About</a>
                </div>
              </div>

              {/* Mobile menu button */}
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

            {/* Mobile menu */}
            {isMobileMenuOpen && (
              <div className="md:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 glass-effect-blue mt-2 rounded-lg">
                  <Link href="/" className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium transition-colors duration-200">Home</Link>
                  <Link href="/scan" className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium transition-colors duration-200">Scan</Link>
                  <Link href="/history" className="text-blue-400 hover:text-white block px-3 py-2 text-base font-medium transition-colors duration-200">History</Link>
                  <a href="#" className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium transition-colors duration-200">About</a>
                </div>
              </div>
            )}
          </div>
        </nav>
      </header>

      <main className="pt-16">
        {/* History Section */}
        <section className="py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Page Title */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl mb-6">
                <Clock className="text-white w-6 h-6" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Message Scan History
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Review all your previous message scans and their security analysis results
              </p>
            </div>

            {/* Action Button */}
            <div className="text-center mb-8">
              <Button
                onClick={() => setLocation("/scan")}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white font-semibold rounded-xl transition-all duration-300 px-6 py-3 border-0"
              >
                <Plus className="w-5 h-5 mr-2" />
                Scan New Message
              </Button>
            </div>

            {/* History Table */}
            <GlassmorphicCard>
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray-300">Loading scan history...</p>
                </div>
              ) : !scanHistory || scanHistory.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No scans yet</h3>
                  <p className="text-gray-300 mb-6">
                    Start by scanning your first message to see results here
                  </p>
                  <Button
                    onClick={() => setLocation("/scan")}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white font-semibold rounded-xl transition-all duration-300 px-6 py-3 border-0"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Scan Your First Message
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-4 px-2 text-gray-300 font-medium">Message Preview</th>
                        <th className="text-left py-4 px-2 text-gray-300 font-medium">Platform</th>
                        <th className="text-left py-4 px-2 text-gray-300 font-medium">Date Scanned</th>
                        <th className="text-left py-4 px-2 text-gray-300 font-medium">Result</th>
                        <th className="text-left py-4 px-2 text-gray-300 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scanHistory.map((scan) => (
                        <tr key={scan.id} className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200">
                          <td className="py-4 px-2">
                            <div className="max-w-xs">
                              <p className="text-white text-sm leading-relaxed">
                                "{truncateMessage(scan.message)}"
                              </p>
                            </div>
                          </td>
                          <td className="py-4 px-2">
                            <span className="text-gray-300 text-sm capitalize">
                              {scan.platform}
                            </span>
                          </td>
                          <td className="py-4 px-2">
                            <span className="text-gray-300 text-sm">
                              {formatDate(scan.createdAt)}
                            </span>
                          </td>
                          <td className="py-4 px-2">
                            <div className="flex items-center gap-2">
                              {scan.status === "SCAM" ? (
                                <>
                                  <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                                    <AlertTriangle className="w-4 h-4 text-red-400" />
                                  </div>
                                  <div>
                                    <div className="text-red-400 font-medium text-sm">SCAM</div>
                                    <div className="text-gray-400 text-xs">{scan.probability}% likely</div>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                  </div>
                                  <div>
                                    <div className="text-green-400 font-medium text-sm">SAFE</div>
                                    <div className="text-gray-400 text-xs">{scan.probability}% confidence</div>
                                  </div>
                                </>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteScan(scan.id)}
                              disabled={deleteScanMutation.isPending}
                              className="text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors duration-200"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </GlassmorphicCard>

            {/* Summary Stats */}
            {scanHistory && scanHistory.length > 0 && (
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <GlassmorphicCard variant="blue" className="p-6 text-center">
                  <div className="text-2xl font-bold text-white mb-2">
                    {scanHistory.length}
                  </div>
                  <div className="text-gray-300 text-sm">Total Scans</div>
                </GlassmorphicCard>
                
                <GlassmorphicCard variant="blue" className="p-6 text-center">
                  <div className="text-2xl font-bold text-red-400 mb-2">
                    {scanHistory.filter(scan => scan.status === "SCAM").length}
                  </div>
                  <div className="text-gray-300 text-sm">Scams Detected</div>
                </GlassmorphicCard>
                
                <GlassmorphicCard variant="blue" className="p-6 text-center">
                  <div className="text-2xl font-bold text-green-400 mb-2">
                    {scanHistory.filter(scan => scan.status === "SAFE").length}
                  </div>
                  <div className="text-gray-300 text-sm">Safe Messages</div>
                </GlassmorphicCard>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">
              © 2025 PaySafe. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}