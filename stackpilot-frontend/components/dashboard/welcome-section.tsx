import { 
  FileText, 
  Coffee, 
  Sunrise, 
  Briefcase, 
  Compass, 
  Sprout, 
  Sun, 
  Lightbulb, 
  TrendingUp, 
  Wind, 
  Clock, 
  Sunset, 
  Home, 
  Milestone, 
  Sparkles, 
  Trophy, 
  Moon, 
  Stars, 
  Battery, 
  CheckCircle, 
  Bed, 
  Rocket, 
  Repeat, 
  Zap, 
  Mountain, 
  Target, 
  GlassWater,
  PartyPopper,
  Flame,
  Palmtree,
  Camera,
  Heart,
  Bike,
  Search,
  Laptop,
  LucideIcon
} from "lucide-react";
import { Resume } from "@/lib/types/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMemo } from "react";

interface GreetingSuite {
  text: string;
  subtext: string;
  icon: LucideIcon;
}

interface WelcomeSectionProps {
  userName?: string;
  userEmail?: string;
  resumes: Resume[];
  primaryResume: Resume | null;
  onSelectResume: (resumeId: string) => void;
}

export function WelcomeSection({ userName, userEmail, resumes, primaryResume, onSelectResume }: WelcomeSectionProps) {
  const displayName = userName || userEmail?.split("@")[0];

  const greeting = useMemo(() => {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    const name = displayName || "there";

    const suites: Record<string, GreetingSuite[]> = {
      midnight: [
        { text: `Burning the midnight oil, ${name}?`, subtext: "Success belongs to the night owls. Just don't forget to sleep!", icon: Moon },
        { text: `The quiet hours, ${name}.`, subtext: "The best deep work happens when the world is silent.", icon: Stars },
        { text: `Late nights, early retirement.`, subtext: "Every hour you put in now is an investment in your future.", icon: Laptop },
        { text: `Still pushing, ${name}?`, subtext: "Greatness doesn't keep business hours. Keep that momentum.", icon: TrendingUp },
        { text: `Fueled by ambition.`, subtext: "Your dedication is inspiring. Just one more application?", icon: Battery }
      ],
      morning: [
        { text: `Good morning, ${name}.`, subtext: "The early bird catches the best job postings.", icon: Coffee },
        { text: `Rise and shine, ${name}.`, subtext: "A new day, a new chance to find your dream role.", icon: Sunrise },
        { text: `Ready to conquer?`, subtext: "Let's find you a place where you'll truly shine.", icon: Briefcase },
        { text: `Charting your course.`, subtext: "Navigation is key. We've got the map for your career.", icon: Compass },
        { text: `Growth starts now.`, subtext: "Fresh day, fresh roles, fresh opportunities.", icon: Sprout }
      ],
      afternoon: [
        { text: `Good afternoon, ${name}.`, subtext: "Hope your day is proving as productive as your search.", icon: Sun },
        { text: `Bright ideas strike.`, subtext: "The middle of the day is perfect for bold career moves.", icon: Lightbulb },
        { text: `Keep the momentum.`, subtext: "You're getting closer with every click. Stay hydrated!", icon: GlassWater },
        { text: `A fresh breeze.`, subtext: "Let the right roles find their way to you this afternoon.", icon: Wind },
        { text: `Prime time for you.`, subtext: "Beat the after-work rush. Submit those applications now.", icon: Clock }
      ],
      evening: [
        { text: `Good evening, ${name}.`, subtext: "Winding down, or just warming up for the next big move?", icon: Sunset },
        { text: `Reflect on growth.`, subtext: "Take a moment to appreciate how far you've come today.", icon: Milestone },
        { text: `Evening inspiration.`, subtext: "Let's find that role that matches your inner sparkle.", icon: Sparkles },
        { text: `Ending on a high.`, subtext: "Every application is a victory for your future self.", icon: Trophy },
        { text: `Back from the grind?`, subtext: "Let's find you a role you'll actually look forward to tomorrow.", icon: Home }
      ],
      night: [
        { text: `Good night, ${name}.`, subtext: "Rest up. Tomorrow's another day to find your dream role.", icon: Moon },
        { text: `Time to recharge.`, subtext: "Searching with a clear head is always more effective.", icon: Battery },
        { text: `Dream big tonight.`, subtext: "Visualizing your success is the first step to achieving it.", icon: Stars },
        { text: `Daily goals achieved?`, subtext: "Great work today. You've earned some dedicated rest.", icon: CheckCircle },
        { text: `Rest is productive.`, subtext: "The market will be waiting for your best self tomorrow.", icon: Bed }
      ],
      monday: [
        { text: `Happy Monday, ${name}.`, subtext: "New week, new opportunities. Let's crush those goals.", icon: Rocket },
        { text: `Monday reset.`, subtext: "Forget last week. This is a total fresh start for your career.", icon: Repeat },
        { text: `Shock the system.`, subtext: "Start the week with more energy than everyone else.", icon: Zap },
        { text: `The climb starts now.`, subtext: "One step at a time, we'll reach the summit together.", icon: Mountain },
        { text: `Focus on the prize.`, subtext: "Monday sets the tone for your entire week's success.", icon: Target }
      ],
      friday: [
        { text: `It's Friday, ${name}!`, subtext: "One last push before the weekend. You've earned it.", icon: PartyPopper },
        { text: `Closing strong.`, subtext: "Finish those applications before the clock strikes five.", icon: Flame },
        { text: `Weekend loading...`, subtext: "Celebrate the consistent effort you've put in this week.", icon: PartyPopper },
        { text: `Anchors up.`, subtext: "Find peace in the process. You're doing amazing work.", icon: Milestone },
        { text: `Finishing on fire.`, subtext: "Keep that energy alive through the weekend finish line.", icon: Flame }
      ],
      weekend: [
        { text: `Happy Weekend, ${name}.`, subtext: "Rest is just as important as the hustle. Enjoy your break.", icon: Palmtree },
        { text: `Capture the moment.`, subtext: "Take a break from the screen and enjoy the view today.", icon: Camera },
        { text: `Self-care vibes.`, subtext: "Make time for yourself. You are your best investment.", icon: Heart },
        { text: `Leisurely pace.`, subtext: "Even small steps on the weekend make a big difference.", icon: Bike },
        { text: `Weekend deep-dive?`, subtext: "While others rest, you're gaining the ultimate edge.", icon: Search }
      ]
    };

    let selectedSuites = suites.morning;

    // Logic Priority: Weekly Motivation -> Time of Day
    if (day === 1) selectedSuites = suites.monday;
    else if (day === 5) selectedSuites = suites.friday;
    else if (day === 6 || day === 0) selectedSuites = suites.weekend;
    else if (hour >= 23 || hour < 5) selectedSuites = suites.midnight;
    else if (hour >= 5 && hour < 12) selectedSuites = suites.morning;
    else if (hour >= 12 && hour < 17) selectedSuites = suites.afternoon;
    else if (hour >= 17 && hour < 21) selectedSuites = suites.evening;
    else selectedSuites = suites.night;

    // Use a seeded index based on day and hour to ensure component purity
    // This provides "randomness" that stays stable for each session hour
    const seed = day * 24 + hour;
    const index = seed % selectedSuites.length;
    
    return selectedSuites[index];
  }, [displayName]);

  const GreetingIcon = greeting.icon;

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div className="animate-in slide-in-from-left duration-700 flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <h1 
            className="text-2xl md:text-4xl font-bold leading-tight md:whitespace-nowrap"
            style={{ color: "#f5f0e8", fontFamily: "'Playfair Display', serif" }}
          >
            {greeting.text}
          </h1>
          <div className="p-2 rounded-xl bg-[#f5c842]/10 border border-[#f5c842]/20 flex items-center justify-center animate-in zoom-in duration-1000 delay-300">
            <GreetingIcon className="w-5 h-5 md:w-8 md:h-8 text-[#f5c842]" />
          </div>
        </div>
        <p className="mt-3 text-lg md:text-xl font-medium tracking-tight" style={{ color: "#a0a0a0" }}>
          {greeting.subtext}
        </p>
      </div>
      <div className="flex flex-col gap-2 min-w-[200px]">
        <span className="text-xs font-semibold text-[#a0a0a0] uppercase tracking-wider ml-1">Primary Resume</span>
        <Select value={primaryResume?.id} onValueChange={onSelectResume}>
          <SelectTrigger 
            className="w-full bg-[#1a1a1a] border-[#2a2a2a] text-[#f5f0e8] hover:border-[#f5c842]/50 transition-all duration-300 shadow-lg"
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
