import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, Sparkles, ChevronRight } from "lucide-react";
import Link from "next/link";

export function ResumeUploadBanner() {
  return (
    <Card 
      className="border-none overflow-hidden relative group animate-in fade-in slide-in-from-top-4 duration-700"
      style={{ 
        background: "linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)",
        boxShadow: "0 10px 40px rgba(0,0,0,0.4)"
      }}
    >
      {/* Premium Gradient Overlays */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-linear-to-l from-[#f5c842]/10 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-[#f5c842]/30 to-transparent" />
      
      <CardContent className="p-8 sm:p-10 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="w-16 h-16 rounded-2xl bg-[#0d0d0d] border border-[#f5c842]/20 shadow-[0_0_20px_rgba(245,200,66,0.1)] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
              <UploadCloud className="w-8 h-8 text-[#f5c842]" />
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-[#f5c842]" />
                <span className="text-[10px] font-bold text-[#f5c842] uppercase tracking-[0.2em]">Unlock AI Potential</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#f5f0e8] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Elevate Your Career Search
              </h2>
              <p className="text-[#a0a0a0] text-sm sm:text-base max-w-xl leading-relaxed">
                Upload your resume now to unlock <span className="text-[#f5f0e8] font-semibold">AI-powered ATS scoring</span>, 
                personalized <span className="text-[#f5f0e8] font-semibold">Job Matchmaking</span>, and tailored career insights.
              </p>
            </div>
          </div>
          
          <Link href="/resumes" className="w-full lg:w-auto">
            <Button 
              className="w-full lg:w-auto h-14 px-10 rounded-xl bg-[#f5c842] hover:bg-[#d4a832] text-[#0d0d0d] font-bold text-sm uppercase tracking-widest shadow-[0_4px_20px_rgba(245,200,66,0.2)] hover:shadow-[0_8px_30px_rgba(245,200,66,0.4)] transition-all duration-300 group"
            >
              Upload Your Resume
              <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
