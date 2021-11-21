import type { NextApiRequest, NextApiResponse } from "next";
import { Feed } from "../../core/feed";
import FeedService from "../../backend/feed/feed.service";

type Data = Feed | { message: string };

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
  const { method } = req;
  const handle = parseHandle(req);
  switch (method) {
    case "GET":
      try {
        const feed = await FeedService.getFeed(handle || "ryan");
        res.status(200).json(feed);
      } catch (e: any) {
        res.status(500).json({ message: e.message });
      }
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
