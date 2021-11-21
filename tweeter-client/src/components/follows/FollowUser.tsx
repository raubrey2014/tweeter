import { Avatar, Button, Typography } from "antd";
import { FC, useCallback } from "react";
import { User } from "../../core/users";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { followAsync, selectFollow } from "../../store/slices/follows";

const useFollow = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector(selectFollow);
  const follow = useCallback(
    (handle: string) => {
      dispatch(followAsync({ handle }));
    },
    [dispatch]
  );
  return { follow, loading };
};

const FollowUser: FC<{ user: User }> = ({ user }) => {
  const { follow, loading } = useFollow();
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div>
        <Avatar src={user.avatar} style={{ margin: 10 }} />
      </div>
      <div>
        <Typography.Paragraph type="secondary" style={{ margin: 2 }}>
          @{user.handle}
        </Typography.Paragraph>
        <Button
          size="small"
          shape="round"
          loading={loading}
          disabled={loading}
          onClick={() => follow(user.handle)}
        >
          Follow
        </Button>
      </div>
    </div>
  );
};

export default FollowUser;
