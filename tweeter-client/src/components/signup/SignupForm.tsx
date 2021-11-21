import { Alert, Button, Divider, Form, Input, Typography } from "antd";
import { FC, useState } from "react";
import { CreateUserDto } from "../../core/users";
import { isEmail } from "../../core/utils/validation";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import {
  requestSigninAsync,
  selectSignin,
  selectSignup,
  signUpUserAsync,
} from "../../store/slices/user";

const ErrorAlert: FC<{ error: string }> = ({ error }) => {
  let message: string;
  switch (error) {
    case "HandleInUseError":
      message = "That handle is being used.. try another :)";
      break;
    default:
      message = "Whoops.. something went wrong. Please try signing up later!";
  }
  return <Alert type="error" message={message} />;
};

const SignupForm = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(selectSignup);
  const [form] = Form.useForm();

  const signup = async (values: CreateUserDto) => {
    dispatch(signUpUserAsync(values));
  };

  return (
    <Form layout="vertical" form={form} onFinish={signup}>
      {error && (
        <Form.Item>
          <ErrorAlert error={error} />
        </Form.Item>
      )}
      <Form.Item name="handle" label="Choose your handle wisely">
        <Input
          prefix={<Typography.Text type="secondary">@</Typography.Text>}
          size="large"
          style={{ borderRadius: 12 }}
        />
      </Form.Item>
      <Form.Item name="email" label="Yeah yeah dumb email">
        <Input size="large" style={{ borderRadius: 12 }} />
      </Form.Item>

      <Form.Item shouldUpdate>
        {() => {
          const handle = form.getFieldValue("handle");
          const hasEmail =
            form.getFieldValue("email") && isEmail(form.getFieldValue("email"));
          const isDisabled = !handle || handle.length < 3 || !hasEmail;
          return (
            <Button
              style={{ width: "100%" }}
              size="large"
              htmlType="submit"
              type="primary"
              shape="round"
              disabled={isDisabled || loading}
              loading={loading}
            >
              Do it!
            </Button>
          );
        }}
      </Form.Item>
    </Form>
  );
};
const SigninForm = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(selectSignin);
  const [form] = Form.useForm();

  const signin = async (values: { handle: string }) => {
    console.log(values);
    dispatch(requestSigninAsync(values.handle));
  };

  return (
    <Form layout="vertical" form={form} onFinish={signin}>
      {error && (
        <Form.Item>
          <ErrorAlert error={error} />
        </Form.Item>
      )}

      <Form.Item name="handle" label="Enter your handle">
        <Input
          prefix={<Typography.Text type="secondary">@</Typography.Text>}
          size="large"
          style={{ borderRadius: 12 }}
        />
      </Form.Item>

      <Form.Item shouldUpdate>
        {() => {
          const handle = form.getFieldValue("handle");
          const isDisabled = !handle || handle.length < 3;
          return (
            <Button
              style={{ width: "100%" }}
              size="large"
              htmlType="submit"
              type="primary"
              shape="round"
              disabled={isDisabled || loading}
              loading={loading}
            >
              Send me a magic link
            </Button>
          );
        }}
      </Form.Item>
    </Form>
  );
};

const AuthForm = () => {
  const [signin, setSignin] = useState(false);

  return (
    <>
      <Typography.Title level={3} style={{ margin: 0 }}>
        {signin ? "Sign in" : "Sign up for tweeter.. do it."}
      </Typography.Title>
      <Typography.Paragraph>
        Or{" "}
        <Button
          type="link"
          onClick={() => setSignin(!signin)}
          style={{ padding: 0 }}
        >
          {signin ? "sign up" : "sign in"}
        </Button>{" "}
        instead.
      </Typography.Paragraph>
      <Divider />
      {signin ? <SigninForm /> : <SignupForm />}
    </>
  );
};

export default AuthForm;
