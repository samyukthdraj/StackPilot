import Link from "next/link";
import { FileText, Briefcase, Target } from "lucide-react";

export function QuickActions() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold font-playfair" style={{ color: "#f5f0e8" }}>Quick Actions</h2>
        <p className="text-sm mt-1" style={{ color: "#a0a0a0" }}>Get started with your job search</p>
      </div>

      <div className="flex flex-col space-y-5">
        <Link href="/resumes/upload" className="flex items-center group cursor-pointer w-fit">
           <div className="w-10 h-10 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center mr-4 group-hover:border-[#f5c842]/50 transition-all shadow-sm">
             <FileText className="h-4 w-4 text-[#f5c842]" />
           </div>
           <div>
             <p className="text-[#f5f0e8] font-bold text-sm tracking-tight group-hover:text-[#f5f0e8] transition-colors leading-none">Upload Resume</p>
             <p className="text-[10px] text-[#666] uppercase tracking-widest mt-1">Optimize Profile</p>
           </div>
        </Link>

        <Link href="/jobs" className="flex items-center group cursor-pointer w-fit">
           <div className="w-10 h-10 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center mr-4 group-hover:border-[#f5c842]/50 transition-all shadow-sm">
             <Briefcase className="h-4 w-4 text-[#f5c842]" />
           </div>
           <div>
             <p className="text-[#f5f0e8] font-bold text-sm tracking-tight group-hover:text-[#f5f0e8] transition-colors leading-none">Browse Jobs</p>
             <p className="text-[10px] text-[#666] uppercase tracking-widest mt-1">Explore Markets</p>
           </div>
        </Link>

        <Link href="/matches" className="flex items-center group cursor-pointer w-fit">
           <div className="w-10 h-10 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center mr-4 group-hover:border-[#f5c842]/50 transition-all shadow-sm">
             <Target className="h-4 w-4 text-[#f5c842]" />
           </div>
           <div>
             <p className="text-[#f5f0e8] font-bold text-sm tracking-tight group-hover:text-[#f5f0e8] transition-colors leading-none">View Matches</p>
             <p className="text-[10px] text-[#666] uppercase tracking-widest mt-1">Check Compatibility</p>
           </div>
        </Link>
      </div>
    </div>
  );
}
