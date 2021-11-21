import { List } from "antd";
import { useEffect } from "react";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { fetchFeedAsync, selectFeed } from "../../store/slices/feed";
import CreatePost from "./CreatePost";
import PostComponent from "./Post";

const useFeed = () => {
  const { posts, loading } = useAppSelector(selectFeed);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchFeedAsync());
  }, [dispatch]);

  return { posts, loading };
};

const Feed = () => {
  const { posts, loading } = useFeed();

  return (
    <>
      <CreatePost />

      <List
        loading={loading}
        dataSource={posts}
        renderItem={(post) => <PostComponent post={post} />}
      />
    </>
  );
};

export default Feed;
