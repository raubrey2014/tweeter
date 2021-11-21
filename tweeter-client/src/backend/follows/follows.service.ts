import { Follow, FollowedUser } from "../../core/follows";
import { Handled, User } from "../../core/users";
import UsersRepo from "../users/users.repo";
import UsersService from "../users/users.service";
import FollowsRepo from "./follows.repo";

const log = (...s: any[]) => console.log(`[FollowsService]`, ...s);

function toFollowedUsers(users: User[], follows: Follow[]): FollowedUser[] {
  return users
    .map((u) => {
      const follow = follows.find((f) => f.destination === u.handle);
      if (!follow) return undefined;
      return {
        ...u,
        followId: follow.id,
        followSource: follow.source,
        followedSince: follow.createdAt,
      };
    })
    .filter((f): f is FollowedUser => !!f);
}

async function follow(
  source: Handled,
  destination: Handled
): Promise<FollowedUser> {
  log(`Saving follow: ${source.handle} -> ${destination.handle}`);
  const follow = await FollowsRepo.save(source, destination);
  const user = await UsersService.getUser(destination.handle);
  if (!user) throw new Error(`User not found by handle: ${destination}`);

  const followedUser = toFollowedUsers([user], [follow])[0];
  if (!followedUser)
    throw new Error(`Error associating followed user: ${user} -> ${follow}`);

  return followedUser;
}

async function getFollowsForUser(source: Handled): Promise<FollowedUser[]> {
  const follows = await FollowsRepo.getFollowsForUser(source);
  const users = await UsersRepo.findMany(...follows.map((f) => f.destination));
  return toFollowedUsers(users, follows);
}

async function getSuggestedUsers(source: Handled): Promise<User[]> {
  const users = await UsersService.getUsers(
    "mitch",
    "ryan",
    "bill",
    "bill2",
    "mitchy"
  );
  return users.filter((u) => u.handle !== source.handle);
}

async function getFollowsDigest({ handle }: Handled): Promise<{
  suggestedUsers: User[];
  followedUsers: FollowedUser[];
}> {
  const followedUsers = await getFollowsForUser({
    handle: handle || "ryan",
  });
  const suggestedUsers = await getSuggestedUsers({
    handle: handle || "ryan",
  });
  const unfollowedSuggestions = suggestedUsers.filter(
    (suggestion) => !followedUsers.find((u) => u.handle === suggestion.handle)
  );
  return { followedUsers, suggestedUsers: unfollowedSuggestions };
}

const FollowsService = { follow, getFollowsForUser, getFollowsDigest };

export default FollowsService;
