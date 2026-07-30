export interface Activity {
  id: number;
  title: string;
  description: string;
  fullDescription: string;
  image: string;
  date: string;
  location: string;
  participants: number;
  category: "training" | "workshop" | "webinar" | "dialogue";
}