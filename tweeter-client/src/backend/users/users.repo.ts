import { FullUser } from "../../core/users";

import client from "../common/dynamo";

const userPrefix = "user_";
const userKey = (h: string): string => `${userPrefix}${h}`;

const log = (...s: any[]) => console.log(`[UserRepo]`, ...s);

async function find(handle: string): Promise<FullUser | undefined> {
  log(`Searching for ${handle}`);
  return client
    .get({
      TableName: "TweeterTable",
      Key: { PK: userKey(handle), SK: userKey(handle) },
    })
    .promise()
    .then((x) => (x.Item ? ({ ...x.Item } as FullUser) : undefined));
}

async function findMany(...handles: string[]): Promise<FullUser[]> {
  log(`Searching for ${handles}`);
  const req = {
    RequestItems: {
      TweeterTable: {
        Keys: handles.map((h) => ({
          PK: userKey(h),
          SK: userKey(h),
        })),
      },
    },
  };

  try {
    const res = await client.batchGet(req).promise();
    if (res.UnprocessedKeys?.TweeterTable) {
      log(`Unprocessed keys in findMany: ${res.UnprocessedKeys.TweeterTable}`);
    }
    return (res.Responses?.TweeterTable as FullUser[]) || [];
  } catch (e) {
    log(JSON.stringify(e));
  }

  return [];
}

async function save(user: FullUser): Promise<void> {
  log("Saving", user.handle);
  const { handle } = user;
  await client
    .put({
      TableName: "TweeterTable",
      Item: { PK: userKey(handle), SK: userKey(handle), ...user },
    })
    .promise();
}

const UsersRepo = { find, findMany, save };

export default UsersRepo;
