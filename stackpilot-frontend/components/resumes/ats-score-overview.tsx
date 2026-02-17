import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
          <div className="h-75">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={scoreData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#FF6B35"
                  fill="#FF6B35"
                  fillOpacity={0.3}
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
                <span className="text-3xl font-bold text-orange-500">
                  {atsScore}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
