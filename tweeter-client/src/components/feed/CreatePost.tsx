import { Input, Form, Button, Modal, Divider, Typography } from "antd";
import { FC, useState } from "react";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useIsMobile } from "../../hooks/useIsMobile";
import { createPostAsync, selectCreatePost } from "../../store/slices/feed";

const useCreatePost = () => {
  const { loading } = useAppSelector(selectCreatePost);
  const dispatch = useAppDispatch();

  const [form] = Form.useForm();

  const submit = (values: { text: string }) => {
    console.log(values.text);
    dispatch(createPostAsync(values.text));
  };

  return { form, submit, loading };
};

const CreatePost: FC = () => {
  const { form, submit, loading } = useCreatePost();
  return (
    <>
      <Form form={form} onFinish={submit}>
        <Form.Item name="text">
          <Input.TextArea
            style={{ borderRadius: 12 }}
            rows={3}
            placeholder="Ya know what..."
          />
        </Form.Item>
        <Form.Item shouldUpdate>
          {() => {
            const disabled = !form.getFieldValue("text");
            return (
              <div style={{ display: "flex", justifyContent: "end" }}>
                <Button
                  loading={loading}
                  shape="round"
                  type="primary"
                  htmlType="submit"
                  disabled={disabled || loading}
                >
                  Post Twitt
                </Button>
              </div>
            );
          }}
        </Form.Item>
      </Form>
    </>
  );
};

const ActionButton = () => {
  const [visible, setVisible] = useState(false);
  return (
    <div style={{ position: "fixed", bottom: 30, right: 30 }}>
      <Modal
        visible={visible}
        footer={null}
        title="Spill ya beans"
        onCancel={() => setVisible(false)}
      >
        <CreatePost />
      </Modal>
      <Button
        type="primary"
        shape="circle"
        size="large"
        style={{ padding: 2 }}
        onClick={() => setVisible(true)}
      >
        Twitt
      </Button>
    </div>
  );
};

const CreatePostModalOrActionButton = () => {
  const isMobile = useIsMobile();

  return (
    <>
      {!isMobile && (
        <>
          <Typography.Title level={5}>Spill ya beans</Typography.Title>
          <CreatePost />
          <Divider />
        </>
      )}
      {isMobile && <ActionButton />}
    </>
  );
};

export default CreatePostModalOrActionButton;
