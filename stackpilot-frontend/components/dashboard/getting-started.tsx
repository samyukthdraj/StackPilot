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
    <Card className="bg-linear-to-r from-orange-50 to-orange-100 border-orange-200">
      <CardHeader>
        <CardTitle className="text-orange-900">
          Get the most out of StackPilot
        </CardTitle>
        <CardDescription className="text-orange-700">
          Follow these steps to optimize your job search
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {steps.map((step) => (
            <div key={step.number} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">
                {step.number}
              </div>
              <p className="text-sm text-gray-700">{step.text}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
