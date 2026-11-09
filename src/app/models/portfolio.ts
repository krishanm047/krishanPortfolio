// Mirrors the Java Portfolio record returned by GET /api/portfolio
export interface Profile {
  name: string; title: string; tagline: string; summary: string; location: string;
  email: string; linkedin: string; github: string; resumeUrl: string; yearsOfExperience: number;
  photoUrl?: string;
}
export interface SkillGroup { category: string; icon: string; items: string[]; }
export interface Experience {
  company: string; role: string; period: string; location: string; highlights: string[]; tech: string[];
}
export interface Project {
  name: string; description: string; tech: string[]; status: string; repoUrl: string; demoUrl: string; icon: string;
}
export interface Education { institution: string; degree: string; period: string; }
export interface Portfolio {
  profile: Profile; skills: SkillGroup[]; experience: Experience[]; projects: Project[]; education: Education[];
}
export interface ContactMessage { name: string; email: string; subject: string; message: string; }
