import type { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../core/users";
import UsersService from "../../backend/users/users.service";
import { isEmail } from "../../core/utils/validation";

type Data = User | { message: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { method } = req;
  switch (method) {
    case "PUT":
      const { handle, email } = req.body;
      if (handle && email && isEmail(email)) {
        try {
          const userCreated = await UsersService.signup({ handle, email });
          res.status(200).json(userCreated);
        } catch (e: any) {
          res.status(e.status || 500).json({ message: JSON.stringify(e) });
        }
      } else {
        res.status(400).json({
          message: "Bad request, handle/email is required in body as string",
        });
      }
      break;
    default:
      res.setHeader("Allow", ["PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
