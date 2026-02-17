import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExperienceItem, ProjectItem, EducationItem } from "@/lib/types/api";

interface ResumeDetailsTabsProps {
  skills?: string[];
  experience?: ExperienceItem[];
  projects?: ProjectItem[];
  education?: EducationItem[];
}

export function ResumeDetailsTabs({
  skills,
  experience,
  projects,
  education,
}: ResumeDetailsTabsProps) {
  return (
    <Tabs defaultValue="skills" className="space-y-4">
      <TabsList>
        <TabsTrigger value="skills">Skills</TabsTrigger>
        <TabsTrigger value="experience">Experience</TabsTrigger>
        <TabsTrigger value="projects">Projects</TabsTrigger>
        <TabsTrigger value="education">Education</TabsTrigger>
      </TabsList>

      <TabsContent value="skills" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Technical Skills</CardTitle>
            <CardDescription>
              {skills?.length || 0} skills detected
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {skills?.map((skill, index) => (
                <Badge
                  key={index}
                  className="px-3 py-1 text-sm bg-gray-100 text-navy hover:bg-gray-200"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="experience" className="space-y-4">
        {experience?.map((exp: ExperienceItem, index: number) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex justify-between">
                <div>
                  <CardTitle>{exp.position}</CardTitle>
                  <CardDescription>{exp.company}</CardDescription>
                </div>
                <span className="text-sm text-gray-600">{exp.duration}</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2">
                {exp.description.map((desc: string, i: number) => (
                  <li key={i} className="text-gray-600">
                    {desc}
                  </li>
                ))}
              </ul>
              {exp.technologies && exp.technologies.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-navy mb-2">
                    Technologies:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech: string, i: number) => (
                      <Badge key={i} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </TabsContent>

      <TabsContent value="projects" className="space-y-4">
        {projects?.map((project: ProjectItem, index: number) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex justify-between">
                <CardTitle>{project.name}</CardTitle>
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-500 hover:text-orange-600"
                  >
                    View Project →
                  </a>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{project.description}</p>
              {project.technologies && project.technologies.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-navy mb-2">
                    Technologies:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech: string, i: number) => (
                      <Badge key={i} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </TabsContent>

      <TabsContent value="education" className="space-y-4">
        {education?.map((edu: EducationItem, index: number) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{edu.degree}</CardTitle>
              <CardDescription>{edu.institution}</CardDescription>
            </CardHeader>
            {edu.field && (
              <CardContent>
                <p className="text-gray-600">Field: {edu.field}</p>
                {edu.duration && (
                  <p className="text-sm text-gray-500 mt-1">{edu.duration}</p>
                )}
                {edu.gpa && (
                  <p className="text-sm text-gray-500 mt-1">GPA: {edu.gpa}</p>
                )}
              </CardContent>
            )}
          </Card>
        ))}
      </TabsContent>
    </Tabs>
  );
}
