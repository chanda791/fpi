export interface TeamMember {

  id: number;

  fullName: string;

  position: string;

  category: string;

  biography: string;

  responsibilities: string[];

  image?: string;

  displayOrder: number;

  published: boolean;

  createdAt: string;

  updatedAt: string;

}