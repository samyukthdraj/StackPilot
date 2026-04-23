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
import { ScrollableTabs } from "@/components/ui/scrollable-tabs";

interface ResumeDetailsTabsProps {
  skills?: string[];
  experience?: ExperienceItem[];
  projects?: ProjectItem[];
  education?: EducationItem[];
}

import { LordiconWrapper } from "@/components/shared/lordicon-wrapper";
import { animations } from "@/public/icons/lordicon";

function EmptySection({
  title,
  message,
  icon = animations.notFound,
}: {
  title: string;
  message: string;
  icon?: string;
}) {
  return (
    <Card className="border-[#2a2a2a] bg-[#1a1a1a]/50 border-dashed py-12">
      <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
        <LordiconWrapper icon={icon} size={64} color="#f5c842" state="loop" />
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-[#f5f0e8]">{title}</h3>
          <p className="text-gray-400 max-w-xs mx-auto">{message}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function ResumeDetailsTabs({
  skills,
  experience,
  projects,
  education,
}: ResumeDetailsTabsProps) {
  return (
    <Tabs defaultValue="skills" className="space-y-4">
      <ScrollableTabs>
        <TabsList className="flex min-w-full w-max sm:w-auto">
          <TabsTrigger value="skills" className="flex-shrink-0">Skills</TabsTrigger>
          <TabsTrigger value="experience" className="flex-shrink-0">Experience</TabsTrigger>
          <TabsTrigger value="projects" className="flex-shrink-0">Projects</TabsTrigger>
          <TabsTrigger value="education" className="flex-shrink-0">Education</TabsTrigger>
        </TabsList>
      </ScrollableTabs>

      <TabsContent value="skills" className="space-y-4">
        {skills && skills.length > 0 ? (
          <Card className="border-[#2a2a2a] bg-[#1a1a1a]">
            <CardHeader>
              <CardTitle className="text-[#f5f0e8]">Technical Skills</CardTitle>
              <CardDescription className="text-gray-400">
                {skills.length} skills detected
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <Badge
                    key={index}
                    className="px-3 py-1 text-sm bg-[#2a2a2a] text-[#f5f0e8] hover:bg-[#3a3a3a] border-none"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <EmptySection
            title="No Skills Found"
            message="Our AI couldn't detect a dedicated skills section. Try re-formatting your resume with clear headings."
          />
        )}
      </TabsContent>

      <TabsContent value="experience" className="space-y-4">
        {experience && experience.length > 0 ? (
          experience.map((exp: ExperienceItem, index: number) => (
            <Card key={index} className="border-[#2a2a2a] bg-[#1a1a1a]">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-[#f5f0e8]">
                      {exp.position}
                    </CardTitle>
                    <CardDescription className="text-[#f5c842] font-semibold">
                      {exp.company}
                    </CardDescription>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-500 bg-white/5 px-2 py-1 rounded">
                    {exp.duration}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2">
                  {exp.description.map((desc: string, i: number) => (
                    <li
                      key={i}
                      className="text-gray-400 text-sm leading-relaxed"
                    >
                      {desc}
                    </li>
                  ))}
                </ul>
                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-[#2a2a2a]">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                      Core Technologies
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech: string, i: number) => (
                        <Badge
                          key={i}
                          className="bg-[#f5c842]/10 text-[#f5c842] border-[#f5c842]/20 hover:bg-[#f5c842]/20"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <EmptySection
            title="Experience Missing"
            message="No professional experience was parsed. Ensure your job roles use standard headings like 'Work Experience'."
          />
        )}
      </TabsContent>

      <TabsContent value="projects" className="space-y-4">
        {projects && projects.length > 0 ? (
          projects.map((project: ProjectItem, index: number) => (
            <Card key={index} className="border-[#2a2a2a] bg-[#1a1a1a]">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-[#f5f0e8]">
                    {project.name}
                  </CardTitle>
                  {project.url && (
                    <a
                      href={
                        project.url.startsWith("http")
                          ? project.url
                          : `https://${project.url}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold uppercase tracking-widest text-[#f5c842] hover:underline"
                    >
                      Source Code ↗
                    </a>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {project.description}
                </p>
                {project.technologies && project.technologies.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-[#2a2a2a]">
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech: string, i: number) => (
                        <Badge
                          key={i}
                          className="bg-white/5 text-gray-300 border-none hover:bg-white/10"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <EmptySection
            title="No Projects Identified"
            message="Adding a dedicated Projects section is highly recommended for tech roles. It helps significantly boost your ATS score."
          />
        )}
      </TabsContent>

      <TabsContent value="education" className="space-y-4">
        {education && education.length > 0 ? (
          education.map((edu: EducationItem, index: number) => (
            <Card key={index} className="border-[#2a2a2a] bg-[#1a1a1a]">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-[#f5f0e8]">
                      {edu.degree}
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      {edu.institution}
                    </CardDescription>
                  </div>
                  {edu.duration && (
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                      {edu.duration}
                    </span>
                  )}
                </div>
              </CardHeader>
              {(edu.field || edu.gpa) && (
                <CardContent className="pt-0">
                  <div className="flex gap-4 items-center">
                    {edu.field && (
                      <p className="text-sm text-[#f5c842]">
                        Major:{" "}
                        <span className="text-gray-300">{edu.field}</span>
                      </p>
                    )}
                    {edu.gpa && (
                      <p className="text-sm text-[#f5c842]">
                        GPA: <span className="text-gray-300">{edu.gpa}</span>
                      </p>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        ) : (
          <EmptySection
            title="Education Missing"
            message="We couldn't find your educational background. Most ATS systems require at least a high school or university degree."
          />
        )}
      </TabsContent>
    </Tabs>
  );
}
