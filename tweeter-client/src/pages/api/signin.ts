import type { NextApiRequest, NextApiResponse } from "next";
import UsersService from "../../backend/users/users.service";

type Data = { message: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { method } = req;
  switch (method) {
    case "PUT":
      const { handle } = req.body;
      console.log(req.body);
      if (handle) {
        try {
          await UsersService.requestSignin(handle);
          res.status(200).json({ message: "Signin requested" });
        } catch (e: any) {
          console.log(e);
          res.status(e.status || 500).json({ message: JSON.stringify(e) });
        }
      } else {
        res.status(400).json({
          message: "Bad request, handle is required in body as string",
        });
      }
      break;
    default:
      res.setHeader("Allow", ["PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
