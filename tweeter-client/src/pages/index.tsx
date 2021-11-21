import { Col, Layout, Modal, Row } from "antd";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect } from "react";
import Feed from "../components/feed/Feed";
import DiscoverFollows from "../components/follows/DiscoverFollows";
import Header from "../components/layout/Header";
import SignupForm from "../components/signup/SignupForm";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import { fetchUserAsync, selectCurrentUser } from "../store/slices/user";

const useHomePage = () => {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector(selectCurrentUser);

  useEffect(() => {
    dispatch(fetchUserAsync());
  }, [dispatch]);

  return {
    state: {
      currentUser: user,
      currentUserLoading: loading,
    },
  };
};

const { Content } = Layout;

const Home: NextPage = () => {
  const {
    state: { currentUser, currentUserLoading },
  } = useHomePage();

  return (
    <div>
      <Head>
        <title>Tweeter</title>
      </Head>

      <Content>
        <Header />
        <div style={{ margin: "auto", padding: "1rem", maxWidth: 900 }}>
          <Row style={{ width: "100%" }} gutter={25}>
            <Col xs={24} md={14} lg={16}>
              <Feed />
            </Col>
            <Col xs={0} md={10} lg={8}>
              <DiscoverFollows />
            </Col>
          </Row>
          <Modal
            visible={!currentUser?.handle && !currentUserLoading}
            title={null}
            footer={null}
            closable={false}
          >
            <SignupForm />
          </Modal>
        </div>
      </Content>
    </div>
  );
};

export default Home;
