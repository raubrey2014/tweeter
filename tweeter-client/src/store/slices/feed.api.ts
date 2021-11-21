import { doApi } from "./api";

export const fetchFeed = () => doApi("/api/feed");

export const createPost = (text: string) =>
  doApi("/api/posts", { method: "PUT", data: { text } });
