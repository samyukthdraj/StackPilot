export class JobMatchedEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly userName: string,
    public readonly job: {
      title: string;
      company: string;
      location?: string;
      score: number;
      matchedSkills: string[];
      missingSkills: string[];
      url: string;
    },
  ) {}
}
