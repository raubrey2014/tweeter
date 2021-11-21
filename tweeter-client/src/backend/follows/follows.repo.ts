import { v4 as uuid } from "uuid";
import { Follow } from "../../core/follows";
import { Handled, User } from "../../core/users";
import client from "../common/dynamo";

const userPrefix = "user_";
const userKey = (h: string): string => `${userPrefix}${h}`;

const followerPrefix = "follower_";
const followerKey = (h: string): string => `${followerPrefix}${h}`;

const log = (...s: any[]) => console.log(`[FollowsRepo]`, ...s);

async function getFollowsForUser({ handle }: Handled): Promise<Follow[]> {
  log(`Getting followers for: ${handle}`);
  var params = {
    TableName: "TweeterTable",
    KeyConditionExpression:
      "#PK = :user_id and begins_with(#SK, :follower_prefix)",
    ExpressionAttributeNames: {
      "#PK": "PK",
      "#SK": "SK",
    },
    ExpressionAttributeValues: {
      ":user_id": userKey(handle),
      ":follower_prefix": followerPrefix,
    },
  };
  return client
    .query(params)
    .promise()
    .then((x) =>
      x.Items ? x.Items.map((item) => ({ ...item } as Follow)) : []
    );
}

async function save(
  { handle: source }: Handled,
  { handle: destination }: Handled
): Promise<Follow> {
  const follow = {
    id: uuid(),
    createdAt: new Date().toISOString(),
    source,
    destination,
  };
  log(`Saving follow: ${source}`);
  await client
    .put({
      TableName: "TweeterTable",
      Item: {
        PK: userKey(source),
        SK: followerKey(destination),
        ...follow,
      },
    })
    .promise();

  return follow;
}

const FollowsRepo = { getFollowsForUser, save };

export default FollowsRepo;
