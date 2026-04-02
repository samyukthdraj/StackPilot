import { FileText } from "lucide-react";
import { Resume } from "@/lib/types/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WelcomeSectionProps {
  userName?: string;
  userEmail?: string;
  resumes: Resume[];
  primaryResume: Resume | null;
  onSelectResume: (resumeId: string) => void;
}

export function WelcomeSection({ userName, userEmail, resumes, primaryResume, onSelectResume }: WelcomeSectionProps) {
  const displayName = userName || userEmail?.split("@")[0];

  const getDynamicGreeting = () => {
    const now = new Date();
    const hour = now.getHours();
    const month = now.getMonth();
    const date = now.getDate();
    const day = now.getDay();
    const name = displayName || "there";

    // Global Festivals / Holidays
    if (month === 3 && date === 1) return { text: `Happy April Fool's, ${name}! 🤡`, subtext: "Don't worry, these job matches are 100% real (we think)." };
    if (month === 0 && date === 1) return { text: `Happy New Year, ${name}! 🎊`, subtext: "New year, new career. Let's make it happen." };
    if (month === 1 && date === 14) return { text: `Happy Valentine's Day, ${name}! ❤️`, subtext: "Finding a job you love is the best kind of romance." };
    if (month === 9 && date === 31) return { text: `Spooky Season, ${name}! 🎃`, subtext: "Don't let the job search haunt you. We've got your back." };
    if (month === 11 && date === 25) return { text: `Merry Christmas, ${name}! 🎄`, subtext: "Wishing you a season of joy and successful applications." };

    // Weekly Motivation
    if (day === 1) return { text: `Happy Monday, ${name}. 🚀`, subtext: "New week, new opportunities. Let's crush those applications." };
    if (day === 5) return { text: `It's Friday, ${name}! 🥂`, subtext: "One last push before the weekend. You've earned it." };
    if (day === 6 || day === 0) return { text: `Happy Weekend, ${name}. 🧘‍♂️`, subtext: "Rest is just as important as the hustle. Enjoy your break." };

    // Time of Day
    if (hour >= 23 || hour < 5) return { text: `Burning the midnight oil, ${name}? 🌙`, subtext: "Success belongs to the night owls. Just don't forget to sleep!" };
    if (hour >= 5 && hour < 12) return { text: `Good morning, ${name}. ☕️`, subtext: "The early bird catches the best job postings." };
    if (hour >= 12 && hour < 17) return { text: `Good afternoon, ${name}. ☀️`, subtext: "Hope your day is proving as productive as your search." };
    if (hour >= 17 && hour < 21) return { text: `Good evening, ${name}. 🌇`, subtext: "Winding down, or just warming up for the next big move?" };
    
    return { text: `Good night, ${name}. 🌌`, subtext: "Rest up. Tomorrow's another day to find your dream role." };
  };

  const greeting = getDynamicGreeting();

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div className="animate-in slide-in-from-left duration-500">
        <h1 
          className="text-2xl md:text-4xl font-bold leading-tight md:whitespace-nowrap"
          style={{ color: "#f5f0e8", fontFamily: "'Playfair Display', serif" }}
        >
          {greeting.text}
        </h1>
        <p className="mt-3 text-lg md:text-xl font-medium tracking-tight" style={{ color: "#a0a0a0" }}>
          {greeting.subtext}
        </p>
      </div>
      <div className="flex flex-col gap-2 min-w-[200px]">
        <span className="text-xs font-semibold text-[#a0a0a0] uppercase tracking-wider ml-1">Primary Resume</span>
        <Select value={primaryResume?.id} onValueChange={onSelectResume}>
          <SelectTrigger 
            className="w-full bg-[#1a1a1a] border-[#2a2a2a] text-[#f5f0e8] hover:border-[#f5c842]/50 transition-all duration-300"
          >
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#f5c842]" />
              <SelectValue placeholder="Select a resume" />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-[#1a1a1a] border-[#2a2a2a] text-[#f5f0e8]">
            {resumes.map((resume) => (
              <SelectItem 
                key={resume.id} 
                value={resume.id}
                className="hover:bg-[#f5c842] hover:text-[#0d0d0d] focus:bg-[#f5c842] focus:text-[#0d0d0d] transition-colors"
              >
                {resume.fileName} ({resume.atsScore}% ATS)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
