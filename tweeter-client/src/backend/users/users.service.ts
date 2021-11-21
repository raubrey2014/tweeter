import axios from "axios";
import { CreateUserDto, FullUser, User } from "../../core/users";
import { publish } from "../common/kafka";
import {
  HandleInUseError,
  HandleLacksEmailError,
  HandleNotFoundError,
} from "./users.errors";
import UsersRepo from "./users.repo";

const toUser = (u: any): User => {
  const { handle, createdAt, avatar } = u;
  return { handle, createdAt, avatar };
};

function getUser(handle: string): Promise<User | undefined> {
  return UsersRepo.find(handle).then(toUser);
}

function getUsers(...handles: string[]): Promise<User[]> {
  return UsersRepo.findMany(...handles).then((users) => users.map(toUser));
}

async function getAvatar(): Promise<string> {
  const url = await axios.get("https://picsum.photos/200/200.jpg");

  return url?.request?.res.responseUrl;
}

async function signup({ handle, email }: CreateUserDto): Promise<FullUser> {
  const existing = await getUser(handle);
  if (existing)
    throw new HandleInUseError(`Handle ${handle} is already in use!`);

  const avatar = await getAvatar();

  const user = {
    handle,
    email,
    avatar,
    createdAt: new Date().toISOString(),
  };

  await UsersRepo.save(user);
  return user;
}

async function requestSignin(handle: string): Promise<void> {
  const existing = await UsersRepo.find(handle);
  if (!existing)
    throw new HandleNotFoundError(`Handle ${handle} is not in use!`);

  if (!existing.email)
    throw new HandleLacksEmailError(
      `Handle ${handle} does not have an associated email!`
    );

  await publish("users", {
    event: "signinRequested",
    handle,
    email: existing.email,
  });
}

const UsersService = { getUser, getUsers, signup, requestSignin };

export default UsersService;
