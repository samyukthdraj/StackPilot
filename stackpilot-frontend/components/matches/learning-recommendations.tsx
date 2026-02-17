"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LordiconWrapper } from "@/components/shared/lordicon-wrapper";
import { animations } from "@/public/icons/lordicon";
import { useMatchStats } from "@/lib/hooks/use-matches";
import Link from "next/link";

const learningResources = {
  react: {
    name: "React",
    resources: [
      {
        name: "React Official Docs",
        url: "https://react.dev",
        type: "Documentation",
      },
      { name: "Epic React", url: "https://epicreact.dev", type: "Course" },
      {
        name: "React Tutorial",
        url: "https://www.w3schools.com/react/",
        type: "Tutorial",
      },
    ],
  },
  typescript: {
    name: "TypeScript",
    resources: [
      {
        name: "TypeScript Handbook",
        url: "https://www.typescriptlang.org/docs/",
        type: "Documentation",
      },
      {
        name: "Understanding TypeScript",
        url: "https://www.udemy.com/course/understanding-typescript/",
        type: "Course",
      },
      {
        name: "TypeScript Exercises",
        url: "https://typescript-exercises.github.io/",
        type: "Practice",
      },
    ],
  },
  "node.js": {
    name: "Node.js",
    resources: [
      {
        name: "Node.js Docs",
        url: "https://nodejs.org/en/docs/",
        type: "Documentation",
      },
      {
        name: "The Complete Node.js Course",
        url: "https://www.udemy.com/course/the-complete-nodejs-developer-course-2/",
        type: "Course",
      },
      {
        name: "Node.js Best Practices",
        url: "https://github.com/goldbergyoni/nodebestpractices",
        type: "Guide",
      },
    ],
  },
  python: {
    name: "Python",
    resources: [
      {
        name: "Python.org",
        url: "https://www.python.org/doc/",
        type: "Documentation",
      },
      {
        name: "Automate the Boring Stuff",
        url: "https://automatetheboringstuff.com/",
        type: "Book",
      },
      {
        name: "Real Python",
        url: "https://realpython.com/",
        type: "Tutorials",
      },
    ],
  },
  aws: {
    name: "AWS",
    resources: [
      {
        name: "AWS Documentation",
        url: "https://docs.aws.amazon.com/",
        type: "Documentation",
      },
      {
        name: "AWS Training",
        url: "https://www.aws.training/",
        type: "Training",
      },
      { name: "A Cloud Guru", url: "https://acloudguru.com/", type: "Course" },
    ],
  },
  docker: {
    name: "Docker",
    resources: [
      {
        name: "Docker Docs",
        url: "https://docs.docker.com/",
        type: "Documentation",
      },
      {
        name: "Docker Mastery",
        url: "https://www.udemy.com/course/docker-mastery/",
        type: "Course",
      },
      {
        name: "Play with Docker",
        url: "https://labs.play-with-docker.com/",
        type: "Practice",
      },
    ],
  },
};

export function LearningRecommendations() {
  const { data: stats } = useMatchStats();

  if (!stats || stats.commonMissingSkills.length === 0) {
    return null;
  }

  const skillsToLearn = stats.commonMissingSkills
    .filter(
      (item) =>
        learningResources[
          item.skill.toLowerCase() as keyof typeof learningResources
        ],
    )
    .slice(0, 3);

  if (skillsToLearn.length === 0) return null;

  return (
    <Card className="border-2 border-gray-200 hover:border-orange-500/50 transition-all duration-300 overflow-hidden">
      <CardHeader className="bg-linear-to-r from-orange-50 to-orange-100/50 border-b border-orange-200">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <LordiconWrapper
              icon={animations.learning}
              size={28}
              color="#FF6B35"
              state="loop"
            />
          </div>
          <span className="text-navy">Learning Recommendations</span>
        </CardTitle>
        <CardDescription className="text-gray-700 font-medium">
          Level up your skills with these curated resources
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {skillsToLearn.map((item) => {
          const resource =
            learningResources[
              item.skill.toLowerCase() as keyof typeof learningResources
            ];
          if (!resource) return null;

          return (
            <div
              key={item.skill}
              className="space-y-3 p-4 bg-linear-to-br from-gray-50 to-white rounded-xl border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-lg text-navy">{resource.name}</h4>
                <Badge
                  variant="secondary"
                  className="bg-red-100 text-red-700 border-red-300 font-semibold px-3 py-1"
                >
                  Missing in {item.count} jobs
                </Badge>
              </div>
              <div className="grid gap-3">
                {resource.resources.map((res, index) => (
                  <Link
                    key={index}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-orange-500 hover:shadow-md transition-all duration-300 group hover:-translate-y-0.5"
                  >
                    <div>
                      <p className="font-semibold text-navy group-hover:text-orange-500 transition-colors duration-300">
                        {res.name}
                      </p>
                      <p className="text-xs text-gray-600 font-medium mt-1">
                        📚 {res.type}
                      </p>
                    </div>
                    <div className="transition-transform duration-300 group-hover:translate-x-1">
                      <LordiconWrapper
                        icon={animations.external}
                        size={22}
                        color="#FF6B35"
                        state="hover"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}

        <div className="pt-4 text-center border-t border-gray-200">
          <Button
            variant="link"
            className="text-orange-500 font-bold hover:text-orange-600 transition-all duration-300 hover:scale-105"
          >
            View All Resources
            <span className="inline-block ml-1 transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
