import { List, Typography } from "antd";
import { FC } from "react";
import { Post } from "../../core/feed";
import { dayjs } from "../../core/utils";

const { Text } = Typography;

interface Props {
  post: Post;
}

const PostComponent: FC<Props> = ({ post }) => {
  return (
    <List.Item>
      <List.Item.Meta
        title={
          <span>
            @{post.createdBy} ·{" "}
            <Text type="secondary">{dayjs(post.createdAt).fromNow()}</Text>
          </span>
        }
        description={post.text}
      />
    </List.Item>
  );
};

export default PostComponent;
