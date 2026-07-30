export interface Project {

  id: number;

  title: string;

  description: string;

  content: string;

  image?: string;

  images?: string[];

  category?: string;

  status?: string;

  startDate?: string;

  endDate?: string;

  published: boolean;

  createdAt: string;

  updatedAt: string;

}