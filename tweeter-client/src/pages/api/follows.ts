import type { NextApiRequest, NextApiResponse } from "next";
import FollowsService from "../../backend/follows/follows.service";
import { FollowedUser } from "../../core/follows";
import { User } from "../../core/users";

type Data =
  | FollowedUser
  | { suggestedUsers: User[]; followedUsers: FollowedUser[] }
  | { message: string };

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
        const { suggestedUsers, followedUsers } =
          await FollowsService.getFollowsDigest({ handle: handle || "ryan" });
        res.status(200).json({ suggestedUsers, followedUsers });
      } catch (e: any) {
        res.status(500).json({ message: e.message });
      }
      break;
    case "PUT":
      try {
        const source = handle;
        const { handle: destination } = req.body;
        if (!source || !destination) {
          res.status(400).json({
            message: "Source and destination of follow must be defined",
          });
          return;
        }

        const followedUser = await FollowsService.follow(
          { handle: source },
          { handle: destination }
        );
        res.status(200).json(followedUser);
      } catch (e: any) {
        res.status(500).json({ message: e.message });
      }
      break;
    default:
      res.setHeader("Allow", ["PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
