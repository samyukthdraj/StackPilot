import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface GettingStartedStep {
  number: number;
  text: string;
}

interface GettingStartedProps {
  steps?: GettingStartedStep[];
}

const defaultSteps: GettingStartedStep[] = [
  {
    number: 1,
    text: "Upload your resume and get an ATS score",
  },
  {
    number: 2,
    text: "Browse jobs that match your skills",
  },
  {
    number: 3,
    text: "Apply with confidence using AI-powered insights",
  },
];

export function GettingStarted({ steps = defaultSteps }: GettingStartedProps) {
  return (
    <Card 
      className="border relative overflow-hidden group"
      style={{ background: "linear-gradient(to right, #1a1a1a, #0d0d0d)", borderColor: "#2a2a2a" }}
    >
      <div className="absolute inset-0 bg-[#f5c842]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <CardHeader className="relative z-10">
        <CardTitle style={{ color: "#f5f0e8", fontFamily: "'Playfair Display', serif" }}>
          Get the most out of StackPilot
        </CardTitle>
        <CardDescription style={{ color: "#a0a0a0" }}>
          Follow these steps to optimize your job search
        </CardDescription>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="space-y-4">
          {steps.map((step) => (
            <div key={step.number} className="flex items-center gap-4 transition-transform hover:translate-x-2 duration-300">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 shadow-[0_0_15px_rgba(245,200,66,0.2)]"
                style={{ backgroundColor: "#f5c842", color: "#0d0d0d" }}
              >
                {step.number}
              </div>
              <p className="text-sm font-medium" style={{ color: "#f5f0e8" }}>{step.text}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
