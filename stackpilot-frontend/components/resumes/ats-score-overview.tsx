import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Info, Lightbulb } from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ScoreBreakdown {
  skillMatch: number;
  projectStrength: number;
  experienceRelevance: number;
  resumeStructure: number;
  keywordDensity: number;
  actionVerbs: number;
  feedback?: string;
  strengths?: string[];
  suggestions?: string[];
}

interface ATSScoreOverviewProps {
  atsScore: number;
  scoreBreakdown?: ScoreBreakdown;
}

export function ATSScoreOverview({
  atsScore,
  scoreBreakdown,
}: ATSScoreOverviewProps) {
  const scoreData = scoreBreakdown
    ? [
        { category: "Skill Match", score: scoreBreakdown.skillMatch },
        { category: "Projects", score: scoreBreakdown.projectStrength },
        {
          category: "Experience",
          score: scoreBreakdown.experienceRelevance,
        },
        { category: "Structure", score: scoreBreakdown.resumeStructure },
        { category: "Keywords", score: scoreBreakdown.keywordDensity },
        { category: "Action Verbs", score: scoreBreakdown.actionVerbs },
      ]
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>ATS Score Overview</CardTitle>
        <CardDescription>
          Your resume scores in different categories
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={scoreData}>
                <PolarGrid stroke="#2a2a2a" />
                <PolarAngleAxis dataKey="category" tick={{ fill: "#a0a0a0", fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#a0a0a0", fontSize: 10 }} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#f5c842"
                  fill="#f5c842"
                  fillOpacity={0.25}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            {scoreData.map((item) => (
              <div key={item.category}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{item.category}</span>
                  <span className="font-semibold text-navy">{item.score}%</span>
                </div>
                <Progress value={item.score} className="h-2" />
              </div>
            ))}

            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-navy">
                  Overall ATS Score
                </span>
                <span className="text-3xl font-bold text-[#f5c842]">
                  {atsScore}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {scoreBreakdown?.feedback && (
          <div className="mt-8 pt-8 border-t border-[#2a2a2a] space-y-6">
            <div className="bg-[#f5c842]/10 border border-[#f5c842]/20 p-4 rounded-lg">
              <h3 className="font-semibold text-[#f5c842] flex items-center gap-2 mb-2">
                <Info className="w-5 h-5" />
                AI ATS Feedback
              </h3>
              <p className="text-[#a0a0a0] leading-relaxed text-sm">{scoreBreakdown.feedback}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {scoreBreakdown.strengths && scoreBreakdown.strengths.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-[#f5f0e8] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Strengths
                  </h4>
                  <ul className="space-y-2">
                    {scoreBreakdown.strengths.map((s, i) => (
                      <li key={i} className="text-sm text-[#a0a0a0] flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {scoreBreakdown.suggestions && scoreBreakdown.suggestions.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-[#f5f0e8] flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-[#f5c842]" />
                    Areas to Improve
                  </h4>
                  <ul className="space-y-2">
                    {scoreBreakdown.suggestions.map((s, i) => (
                      <li key={i} className="text-sm text-[#a0a0a0] flex items-start gap-2">
                        <span className="text-[#f5c842] mt-0.5">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
