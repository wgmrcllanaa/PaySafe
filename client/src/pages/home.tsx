import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GlassmorphicCard } from "@/components/glassmorphic-card";
import { 
  Shield, 
  Search, 
  AlertTriangle, 
  Copy, 
  Brain, 
  CheckCircle, 
  Rocket,
  TrendingUp,
  Users,
  ShieldCheck,
  Menu,
  X,
  Check,
  TriangleAlert,
  InfoIcon
} from "lucide-react";

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHeaderBlurred, setIsHeaderBlurred] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsHeaderBlurred(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScanMessage = () => {
    // TODO: Navigate to message scanning interface
    console.log("Navigate to scan message");
  };

  const handleLearnMore = () => {
    const problemSection = document.getElementById('problem-section');
    problemSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleGetStarted = () => {
    handleScanMessage();
  };

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="relative z-50">
        <nav className={`glass-effect fixed w-full top-0 z-50 transition-all duration-300 ${
          isHeaderBlurred ? 'backdrop-blur-xl' : ''
        }`}>
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
                  <a href="#" className="text-blue-400 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200">Home</a>
                  <a href="#" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200">Scan</a>
                  <a href="#" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200">History</a>
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
                  <a href="#" className="text-blue-400 hover:text-white block px-3 py-2 text-base font-medium transition-colors duration-200">Home</a>
                  <a href="#" className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium transition-colors duration-200">Scan</a>
                  <a href="#" className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium transition-colors duration-200">History</a>
                  <a href="#" className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium transition-colors duration-200">About</a>
                </div>
              </div>
            )}
          </div>
        </nav>
      </header>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              {/* Hero Icon */}
              <div className="flex justify-center mb-6">
                <GlassmorphicCard variant="blue" className="p-4 rounded-2xl">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Search className="text-white w-8 h-8" />
                  </div>
                </GlassmorphicCard>
              </div>
              
              {/* Hero Headline */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Check your messages.<br />
                <span className="text-gradient">Stay scam-free.</span>
              </h1>
              
              {/* Hero Subtext */}
              <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
                Protect yourself from SMS scams with AI-powered message analysis. 
                Get instant threat detection and peace of mind.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  onClick={handleScanMessage}
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/50 text-lg border-0"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Scan a Message
                </Button>
                
                <Button
                  onClick={handleLearnMore}
                  variant="ghost"
                  className="glass-effect px-8 py-4 text-white font-medium rounded-xl hover:bg-white/10 transition-all duration-300 text-lg border border-white/10"
                >
                  <InfoIcon className="w-5 h-5 mr-2" />
                  Learn More
                </Button>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-cyan-500/20 rounded-full blur-2xl"></div>
        </section>

        {/* Problem Section */}
        <section id="problem-section" className="py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              {/* Section Header */}
              <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl mb-6">
                  <TriangleAlert className="text-white w-6 h-6" />
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                  The Growing Threat
                </h2>
              </div>

              {/* Problem Statement Card */}
              <GlassmorphicCard className="mb-12">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  <div className="lg:w-1/3">
                    {/* Illustration of phone with warning */}
                    <div className="relative">
                      <div className="w-48 h-64 mx-auto bg-gradient-to-b from-slate-700 to-slate-800 rounded-3xl border border-slate-600 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl text-gray-400 mb-4">📱</div>
                          <div className="w-32 h-2 bg-red-500 rounded-full mb-2"></div>
                          <div className="w-24 h-2 bg-red-400 rounded-full mb-2"></div>
                          <div className="w-28 h-2 bg-red-300 rounded-full"></div>
                        </div>
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                        <AlertTriangle className="text-white w-4 h-4" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="lg:w-2/3">
                    <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-6">
                      <strong className="text-white">Scam SMS and messaging apps are a growing threat in the Philippines.</strong> 
                      Fraudsters are becoming increasingly sophisticated, targeting unsuspecting users with 
                      fake promotions, phishing attempts, and financial scams.
                    </p>
                    
                    <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8">
                      PaySafe aims to help users detect suspicious messages using AI-powered analysis, 
                      providing you with the tools to stay one step ahead of scammers.
                    </p>

                    {/* Feature Points */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="text-white w-3 h-3" />
                        </div>
                        <span className="text-gray-300">AI-powered threat detection</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="text-white w-3 h-3" />
                        </div>
                        <span className="text-gray-300">Real-time message analysis</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="text-white w-3 h-3" />
                        </div>
                        <span className="text-gray-300">Privacy-focused scanning</span>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassmorphicCard>

              {/* Statistics Cards */}
              <div className="grid md:grid-cols-3 gap-6">
                <GlassmorphicCard variant="blue" className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="text-white w-6 h-6" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-2">Rising</div>
                  <div className="text-gray-300 text-sm">Scam incidents</div>
                </GlassmorphicCard>
                
                <GlassmorphicCard variant="blue" className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Users className="text-white w-6 h-6" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-2">Millions</div>
                  <div className="text-gray-300 text-sm">At risk daily</div>
                </GlassmorphicCard>
                
                <GlassmorphicCard variant="blue" className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck className="text-white w-6 h-6" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-2">AI-Powered</div>
                  <div className="text-gray-300 text-sm">Protection</div>
                </GlassmorphicCard>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                How PaySafe Works
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Simple, fast, and secure message scanning in three easy steps
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {/* Step 1 */}
              <div className="text-center group">
                <GlassmorphicCard className="mb-6 group-hover:bg-white/10 transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-white font-bold text-xl">1</span>
                  </div>
                  <div className="w-24 h-32 bg-gradient-to-b from-slate-600 to-slate-700 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <Copy className="text-gray-400 w-8 h-8" />
                  </div>
                </GlassmorphicCard>
                <h3 className="text-xl font-semibold text-white mb-2">Paste Message</h3>
                <p className="text-gray-300">Copy and paste the suspicious message you want to analyze</p>
              </div>

              {/* Step 2 */}
              <div className="text-center group">
                <GlassmorphicCard className="mb-6 group-hover:bg-white/10 transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-white font-bold text-xl">2</span>
                  </div>
                  <div className="w-24 h-32 bg-gradient-to-b from-slate-600 to-slate-700 rounded-lg mx-auto mb-4 flex items-center justify-center relative">
                    <Brain className="text-blue-400 w-8 h-8" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
                  </div>
                </GlassmorphicCard>
                <h3 className="text-xl font-semibold text-white mb-2">AI Analysis</h3>
                <p className="text-gray-300">Our AI instantly analyzes the message for scam indicators</p>
              </div>

              {/* Step 3 */}
              <div className="text-center group">
                <GlassmorphicCard className="mb-6 group-hover:bg-white/10 transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-white font-bold text-xl">3</span>
                  </div>
                  <div className="w-24 h-32 bg-gradient-to-b from-slate-600 to-slate-700 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <CheckCircle className="text-green-400 w-8 h-8" />
                  </div>
                </GlassmorphicCard>
                <h3 className="text-xl font-semibold text-white mb-2">Get Results</h3>
                <p className="text-gray-300">Receive instant feedback and safety recommendations</p>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center mt-12">
              <Button
                onClick={handleGetStarted}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 text-lg border-0"
              >
                <Rocket className="w-5 h-5 mr-2" />
                Get Started Now
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            {/* Logo and Copyright */}
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Shield className="text-white w-4 h-4" />
                </div>
                <span className="text-white font-bold text-xl">PaySafe</span>
              </div>
              <span className="text-gray-400">|</span>
              <p className="text-gray-400 text-sm">
                © 2024 PaySafe. All rights reserved.
              </p>
            </div>

            {/* Links */}
            <div className="flex items-center space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <span className="text-sm">Privacy</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <span className="text-sm">Terms</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <span className="text-sm">Contact</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
