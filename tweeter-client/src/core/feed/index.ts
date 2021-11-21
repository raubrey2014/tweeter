import { DateISOString } from "../utils";

export interface Post {
  id: string;
  createdBy: string;
  createdAt: DateISOString;
  text: string;
}

export interface Feed {
  posts: Post[];
}
