import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { GlassmorphicCard } from "@/components/glassmorphic-card";
import { 
  Shield, 
  Menu,
  X,
  Users,
  BookOpen,
  GraduationCap
} from "lucide-react";

export default function About() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const teamMembers = [
    {
      name: "Willyn Grace Marcellana",
      role: "CEO & CMO",
      education: "3rd Year Computer Science Student, Web Science Specialization from Adamson University",
      contribution: "Leads the overall vision and marketing strategy, ensuring PaySafe reaches users who need protection most."
    },
    {
      name: "Constante Dizon",
      role: "CTO & COO",
      education: "3rd Year Computer Science Student, Data Science Specialization from Adamson University",
      contribution: "Developed the hybrid LSTM-SVM machine learning model and manages technical operations."
    },
    {
      name: "Shirlee Manipon",
      role: "CFO",
      education: "3rd Year Computer Science Student, Web Science Specialization from Adamson University",
      contribution: "Manages financial planning and ensures sustainable development of the platform."
    }
  ];

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
                  <Link href="/history" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200">History</Link>
                  <Link href="/about" className="text-blue-400 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200">About</Link>
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
                  <Link href="/history" className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium transition-colors duration-200">History</Link>
                  <Link href="/about" className="text-blue-400 hover:text-white block px-3 py-2 text-base font-medium transition-colors duration-200">About</Link>
                </div>
              </div>
            )}
          </div>
        </nav>
      </header>

      <main className="pt-16">
        {/* About Section */}
        <section className="py-20 lg:py-32">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Page Title */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl mb-6">
                <BookOpen className="text-white w-6 h-6" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                About PaySafe
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Learn about our mission to protect Filipinos from mobile fraud
              </p>
            </div>

            {/* About the App */}
            <div className="mb-20">
              <GlassmorphicCard className="max-w-4xl mx-auto">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-white mb-6">About the App</h2>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    PaySafe is a data science capstone project that detects SMS and chat scams using a hybrid LSTM-SVM machine learning model. It's designed to help Filipinos avoid mobile fraud.
                  </p>
                </div>
              </GlassmorphicCard>
            </div>

            {/* About the Team */}
            <div>
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl mb-4">
                  <Users className="text-white w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">About the Team</h2>
                <p className="text-lg text-gray-300">
                  Meet the Computer Science students behind PaySafe
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {teamMembers.map((member, index) => (
                  <GlassmorphicCard key={index} variant="blue" className="text-center group hover:bg-white/10 transition-all duration-300">
                    {/* Profile Photo Placeholder */}
                    <div className="mb-6">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full mx-auto flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                        <GraduationCap className="text-white w-12 h-12" />
                      </div>
                    </div>

                    {/* Member Info */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                      <div className="text-blue-400 font-semibold mb-3">{member.role}</div>
                      <div className="text-sm text-gray-300 mb-4 leading-relaxed">
                        {member.education}
                      </div>
                    </div>

                    {/* Contribution */}
                    <div className="border-t border-white/10 pt-4">
                      <p className="text-sm text-gray-300 leading-relaxed">
                        {member.contribution}
                      </p>
                    </div>
                  </GlassmorphicCard>
                ))}
              </div>
            </div>

            {/* Project Context */}
            <div className="mt-20">
              <GlassmorphicCard className="max-w-4xl mx-auto">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-4">Capstone Project</h3>
                  <p className="text-gray-300 leading-relaxed">
                    This project represents the culmination of our Computer Science studies at Adamson University, 
                    combining web development, data science, and cybersecurity to address a real-world problem 
                    affecting millions of Filipinos daily.
                  </p>
                </div>
              </GlassmorphicCard>
            </div>
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