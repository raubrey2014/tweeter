import axios from "axios";
import { CreateUserDto } from "../../core/users";
import { doApi } from "./api";

export const fetchUser = () => {
  return doApi("/api/me");
};

export class HandleInUseError extends Error {
  constructor(m?: string) {
    super(m);
    this.message = "HandleInUseError";
  }
}

export const signup = async (dto: CreateUserDto) => {
  try {
    const res = await axios.put("/api/signup", dto);
    return res.data;
  } catch (e: any) {
    if ("toJSON" in e && e.toJSON()?.status === 409) {
      throw new HandleInUseError();
    }
    throw e;
  }
};

export const requestSignin = async (handle: string) => {
  console.log(`API: ${handle}`);
  const res = await axios.put("/api/signin", { handle });
  return res.data;
};
