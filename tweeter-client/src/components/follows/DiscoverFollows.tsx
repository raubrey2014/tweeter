import { Card, Divider, List } from "antd";
import { useEffect } from "react";
import FollowUser from "./FollowUser";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { fetchFollowsAsync, selectFollows } from "../../store/slices/follows";
import { useAppSelector } from "../../hooks/useAppSelector";
import FollowedUserComponent from "./FollowedUser";

const useFollows = () => {
  const dispatch = useAppDispatch();
  const { suggestedUsers, followedUsers, loading } =
    useAppSelector(selectFollows);

  useEffect(() => {
    dispatch(fetchFollowsAsync());
  }, [dispatch]);
  return { suggestedUsers, followedUsers, loading };
};

const DiscoverFollows = () => {
  const { suggestedUsers, followedUsers, loading } = useFollows();
  return (
    <div>
      <Card bordered={false} loading={loading}>
        <>
          {followedUsers.length === 0 && suggestedUsers.length === 0 && (
            <>Oops! No suggested follows for now..</>
          )}
          {followedUsers.length > 0 && (
            <List
              dataSource={followedUsers}
              renderItem={(user) => (
                <FollowedUserComponent followedUser={user} />
              )}
            />
          )}
          {followedUsers.length > 0 && suggestedUsers.length > 0 && <Divider />}
          {suggestedUsers.length > 0 && (
            <List
              loading={loading}
              dataSource={suggestedUsers}
              renderItem={(user) => <FollowUser user={user} />}
            />
          )}
        </>
      </Card>
    </div>
  );
};

export default DiscoverFollows;
