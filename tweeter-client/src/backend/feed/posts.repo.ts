import { Post } from "../../core/feed";
import client from "../common/dynamo";

const log = (...s: any[]) => console.log(`[PostRepo]`, ...s);

// POSTS structure in dynamo - optimized for followers reading their news feed
// PK: handle of the recipient - recipient_ryan
// SK: tweetedAt timestamp     - 2021-10-10 00:00:00

const recipientPostKey = ({ handle }: { handle: string }): string =>
  `recipient_post_${handle}`;

const postKey = ({ id }: Post): string => `post_${id}`;

async function findPostsForUser(handle: string): Promise<Post[]> {
  log(`Find posts for user: ${handle}`);
  var params = {
    KeyConditionExpression: "PK = :PK",
    ExpressionAttributeValues: {
      ":PK": recipientPostKey({ handle }),
    },
    TableName: "TweeterTable",
  };
  return client
    .query(params)
    .promise()
    .then((x) => (x.Items ? x.Items.map((item) => ({ ...item } as Post)) : []));
}

async function savePost(p: Post): Promise<void> {
  await client
    .put({
      TableName: "TweeterTable",
      Item: { PK: postKey(p), SK: postKey(p), ...p },
    })
    .promise();
}

async function saveRecipientPost(
  recipient: { handle: string },
  p: Post
): Promise<void> {
  await client
    .put({
      TableName: "TweeterTable",
      Item: { PK: recipientPostKey(recipient), SK: p.createdAt, ...p },
    })
    .promise();
}

const PostRepo = { findPostsForUser, savePost, saveRecipientPost };

export default PostRepo;
