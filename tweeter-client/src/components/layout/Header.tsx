import { Avatar, Button, Popover, Skeleton, Typography } from "antd";
import { dayjs } from "../../core/utils";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { logout, selectCurrentUser } from "../../store/slices/user";

const Header = () => {
  const { user, loading } = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();
  const doLogout = () => dispatch(logout());

  return (
    <div
      style={{
        height: 60,
        padding: 12,
        display: "flex",
        justifyContent: "space-between",
        boxShadow: "0 2px 14px rgba(41,48,58,0.08)",
      }}
    >
      <Typography.Title level={3}>Tweeter</Typography.Title>

      <Popover
        content={
          <div>
            {user?.handle ? (
              <>
                <Typography.Paragraph>
                  Signed in as <strong>@{user.handle}</strong> 🎉
                </Typography.Paragraph>

                <Typography.Paragraph type="secondary">
                  Joined {dayjs(user.createdAt).fromNow()}
                </Typography.Paragraph>

                <Button shape={"round"} onClick={doLogout}>
                  Logout?
                </Button>
              </>
            ) : (
              <>Sign up first!</>
            )}
          </div>
        }
      >
        {!loading && <Avatar src={user?.avatar} />}
        {loading && <Skeleton.Avatar active />}
      </Popover>
    </div>
  );
};

export default Header;
