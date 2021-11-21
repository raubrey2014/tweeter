import type { NextApiRequest, NextApiResponse } from "next";
import { Post } from "../../core/feed";
import FeedService from "../../backend/feed/feed.service";

type Data = Post | { message: string };

const parseHandle = (req: NextApiRequest): string | undefined => {
  const handle = req.headers["x-handle"];
  if (handle && handle !== "undefined" && typeof handle === "string")
    return handle;
  return undefined;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const {
    method,
    body: { text },
  } = req;
  const handle = parseHandle(req);
  switch (method) {
    case "PUT":
      if (!handle || !text) {
        res.status(400).json({ message: "Invalid parameters" });
      } else {
        try {
          const post = await FeedService.createPost(handle, text);
          res.status(200).json(post);
        } catch (e: any) {
          res.status(500).json({ message: e.message });
        }
      }
      break;
    default:
      res.setHeader("Allow", ["PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
