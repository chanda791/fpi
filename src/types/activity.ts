export interface Activity {

  id: number;

  title: string;

  description: string;

  content: string;

  image: string;

  images?: string[];

  program?: string;

  category: string;

  location: string;

  participants: number;

  date: string;

  published: boolean;

  createdAt: string;

  updatedAt: string;

}