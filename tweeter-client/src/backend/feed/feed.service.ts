import { v4 as uuid } from "uuid";
import { Feed, Post } from "../../core/feed";
import FollowsService from "../follows/follows.service";
import PostsRepo from "./posts.repo";

const log = (...a: any[]) => console.log(`[FeedService]:`, a);

async function getFeed(handle: string): Promise<Feed> {
  const posts = await PostsRepo.findPostsForUser(handle);
  return { posts };
}

async function addPostToFeeds(p: Post) {
  const followers = await FollowsService.getFollowsForUser({
    handle: p.createdBy,
  });

  log(
    `Creating recipient post objects for ${p.createdBy}'s ${followers.length} followers and self`
  );

  const followersToReceive = followers.map((f) =>
    PostsRepo.saveRecipientPost({ handle: f.handle }, p)
  );
  const self = PostsRepo.saveRecipientPost({ handle: p.createdBy }, p);

  await Promise.all([...followersToReceive, self]);
}

async function createPost(handle: string, text: string): Promise<Post> {
  const p: Post = {
    id: uuid(),
    createdAt: new Date().toISOString(),
    createdBy: handle,
    text,
  };

  log(`Saving post: ${JSON.stringify(p)}`);
  await PostsRepo.savePost(p);

  log("Adding post to feeds");
  await addPostToFeeds(p);

  return p;
}

const FeedService = { getFeed, createPost };

export default FeedService;
