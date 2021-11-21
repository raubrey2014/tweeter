import { User } from "../users";
import { DateISOString } from "../utils";

export interface Follow {
  id: string;
  createdAt: DateISOString;
  source: string;
  destination: string;
}

export interface FollowedUser extends User {
  followId: string;
  followSource: string;
  followedSince: DateISOString;
}
