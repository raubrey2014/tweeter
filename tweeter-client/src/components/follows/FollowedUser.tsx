import { Avatar, Typography } from "antd";
import { FC } from "react";
import { FollowedUser } from "../../core/follows";
import { dayjs } from "../../core/utils";

const FollowedUserComponent: FC<{ followedUser: FollowedUser }> = ({
  followedUser,
}) => {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div>
        <Avatar src={followedUser.avatar} style={{ margin: 10 }} />
      </div>
      <div>
        <Typography.Paragraph type="secondary" style={{ margin: 2 }}>
          @{followedUser.handle}
        </Typography.Paragraph>
        <Typography.Paragraph
          type="secondary"
          style={{ margin: 2, fontSize: 12 }}
        >
          Started following {dayjs(followedUser.followedSince).fromNow()}
        </Typography.Paragraph>
      </div>
    </div>
  );
};

export default FollowedUserComponent;
