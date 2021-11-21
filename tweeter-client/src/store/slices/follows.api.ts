import { Handled } from "../../core/users";
import { doApi } from "./api";

export const fetchFollows = async () => {
  return doApi("/api/follows");
};

export const follow = (destination: Handled) =>
  doApi("/api/follows", { method: "PUT", data: destination });
