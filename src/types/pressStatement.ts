export interface PressStatement {
  id: number;
  title: string;
  description?: string;
  fileUrl: string;
  image?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}