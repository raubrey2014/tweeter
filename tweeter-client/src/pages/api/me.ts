import type { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../core/users";
import UsersService from "../../backend/users/users.service";

type Data = User | { message: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { method } = req;
  const handle = req.headers["x-handle"];
  switch (method) {
    case "GET":
      if (handle && handle !== "undefined" && typeof handle === "string") {
        try {
          const user = await UsersService.getUser(handle);
          if (!user) res.status(404).json({ message: "Not found" });
          else res.status(200).json(user);
        } catch (e) {
          res.status(500).json({ message: "Server error" });
        }
      } else {
        res
          .status(404)
          .json({ message: "Bad request, handle must be provided as string" });
      }
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
