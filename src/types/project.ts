export type ProjectCategory = 'web' | 'app';

export type PortfolioProject = {
  id: string;
  title: string;
  subtitle?: string;
  projectType?: string;
  description: string;
  technologies: string[];
  features?: Array<{
    title: string;
    description: string;
  }>;
  href: string;
  repositoryHref?: string;
  image: string;
  accent: string;
};
