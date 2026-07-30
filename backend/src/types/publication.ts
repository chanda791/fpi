export interface Publication {
  id: number;

  title: string;

  description?: string;

  fileUrl: string;

  category?: string;

  published: boolean;

  createdAt: string;

  updatedAt: string;
}