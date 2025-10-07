import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Tabs,
  Divider,
  message,
  Modal,
  Upload,
  Avatar,
  Table,
  Tag,
  Rate,
  List,
  Space,
  Typography,
  Row,
  Col,
  Badge,
  Drawer,
  Steps,
  Result,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  GoogleOutlined,
  FacebookOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  PlusOutlined,
  EditOutlined,
  HeartOutlined,
  ShoppingOutlined,
  CreditCardOutlined,
  HistoryOutlined,
  SettingOutlined,
  LogoutOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Step } = Steps;

export default function EcommerceUserSystem() {
  const [currentView, setCurrentView] = useState("auth"); // auth, verify, dashboard
  const [authMode, setAuthMode] = useState("login"); // login, register
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [profileDrawerVisible, setProfileDrawerVisible] = useState(false);
  const [verificationStep, setVerificationStep] = useState(0);
  const [userProfile, setUserProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 234-567-8900",
    address: "123 Main St, City, State 12345",
    avatar: null,
  });

  // Mock data
  const orderHistory = [
    {
      key: "1",
      orderId: "#ORD001",
      date: "2024-01-15",
      items: "iPhone 15 Pro, AirPods",
      total: "$1,299.00",
      status: "Delivered",
    },
    {
      key: "2",
      orderId: "#ORD002",
      date: "2024-01-10",
      items: "MacBook Air",
      total: "$999.00",
      status: "Processing",
    },
  ];

  const wishlistItems = [
    {
      id: 1,
      name: "Samsung Galaxy S24",
      price: "$899.00",
      image: "https://via.placeholder.com/100",
      rating: 4.5,
    },
    {
      id: 2,
      name: "Apple Watch Series 9",
      price: "$399.00",
      image: "https://via.placeholder.com/100",
      rating: 4.8,
    },
  ];

  const handleLogin = (values) => {
    console.log("Login:", values);
    message.success("Login successful!");
    setIsLoggedIn(true);
    setCurrentView("dashboard");
  };

  const handleRegister = (values) => {
    console.log("Register:", values);
    setOtpModalVisible(true);
    setVerificationStep(1);
  };

  const handleOtpVerification = (otp) => {
    console.log("OTP:", otp);
    setOtpModalVisible(false);
    setVerificationStep(2);
    message.success("Email verified successfully!");
    setTimeout(() => {
      setIsLoggedIn(true);
      setCurrentView("dashboard");
    }, 1500);
  };

  const handleSocialLogin = (provider) => {
    message.success(`${provider} login successful!`);
    setIsLoggedIn(true);
    setCurrentView("dashboard");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView("auth");
    setAuthMode("login");
    message.success("Logged out successfully!");
  };

  const orderColumns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Items",
      dataIndex: "items",
      key: "items",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={
            status === "Delivered"
              ? "green"
              : status === "Processing"
              ? "blue"
              : "orange"
          }
        >
          {status}
        </Tag>
      ),
    },
  ];

  // Authentication UI
  const AuthUI = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <div className="text-center mb-6">
          <Title level={2} className="text-gray-800">
            {authMode === "login" ? "Welcome Back" : "Create Account"}
          </Title>
          <Text className="text-gray-600">
            {authMode === "login"
              ? "Sign in to your account"
              : "Join our community today"}
          </Text>
        </div>

        <Tabs activeKey={authMode} onChange={setAuthMode} centered>
          <TabPane tab="Sign In" key="login">
            <Form onFinish={handleLogin} layout="vertical">
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Please input your email!" },
                  { type: "email", message: "Please enter a valid email!" },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Email Address"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Password"
                  size="large"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" size="large" block>
                  Sign In
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane tab="Sign Up" key="register">
            <Form onFinish={handleRegister} layout="vertical">
              <Form.Item
                name="name"
                rules={[{ required: true, message: "Please input your name!" }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Full Name"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Please input your email!" },
                  { type: "email", message: "Please enter a valid email!" },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Email Address"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                  {
                    min: 8,
                    message: "Password must be at least 8 characters!",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Password"
                  size="large"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Please confirm your password!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Passwords do not match!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Confirm Password"
                  size="large"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" size="large" block>
                  Create Account
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>

        <Divider>Or continue with</Divider>

        <Space direction="vertical" className="w-full">
          <Button
            icon={<GoogleOutlined />}
            size="large"
            block
            onClick={() => handleSocialLogin("Google")}
          >
            Continue with Google
          </Button>

          <Button
            icon={<FacebookOutlined />}
            size="large"
            block
            onClick={() => handleSocialLogin("Facebook")}
          >
            Continue with Facebook
          </Button>
        </Space>
      </Card>

      {/* OTP Verification Modal */}
      <Modal
        title="Verify Your Email"
        open={otpModalVisible}
        onCancel={() => setOtpModalVisible(false)}
        footer={null}
        centered
      >
        <div className="text-center py-4">
          <Steps current={verificationStep} className="mb-6">
            <Step title="Register" />
            <Step title="Verify Email" />
            <Step title="Complete" />
          </Steps>

          {verificationStep === 1 && (
            <>
              <Text className="block mb-4">
                We've sent a verification code to your email address.
              </Text>
              <Form onFinish={(values) => handleOtpVerification(values.otp)}>
                <Form.Item
                  name="otp"
                  rules={[{ required: true, message: "Please enter the OTP!" }]}
                >
                  <Input
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    size="large"
                    className="text-center text-lg"
                  />
                </Form.Item>
                <Button type="primary" htmlType="submit" size="large" block>
                  Verify Email
                </Button>
              </Form>
            </>
          )}

          {verificationStep === 2 && (
            <Result
              status="success"
              title="Email Verified!"
              subTitle="Your account has been created successfully."
              icon={<CheckCircleOutlined className="text-green-500" />}
            />
          )}
        </div>
      </Modal>
    </div>
  );

  // Dashboard UI
  const DashboardUI = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Title level={3} className="mb-0">
              My Account
            </Title>
            <Space>
              <Button
                icon={<EditOutlined />}
                onClick={() => setProfileDrawerVisible(true)}
              >
                Edit Profile
              </Button>
              <Button icon={<LogoutOutlined />} onClick={handleLogout}>
                Logout
              </Button>
            </Space>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Row gutter={[24, 24]}>
          {/* Profile Overview */}
          <Col xs={24} lg={8}>
            <Card className="text-center">
              <Avatar size={80} icon={<UserOutlined />} className="mb-4" />
              <Title level={4}>{userProfile.name}</Title>
              <Text className="text-gray-600">{userProfile.email}</Text>

              <div className="mt-6 space-y-2">
                <div className="flex justify-between">
                  <Text>Orders:</Text>
                  <Badge count={orderHistory.length} showZero color="blue" />
                </div>
                <div className="flex justify-between">
                  <Text>Wishlist:</Text>
                  <Badge count={wishlistItems.length} showZero color="red" />
                </div>
              </div>
            </Card>
          </Col>

          {/* Dashboard Tabs */}
          <Col xs={24} lg={16}>
            <Card>
              <Tabs defaultActiveKey="orders">
                <TabPane
                  tab={
                    <span>
                      <HistoryOutlined />
                      Order History
                    </span>
                  }
                  key="orders"
                >
                  <Table
                    columns={orderColumns}
                    dataSource={orderHistory}
                    pagination={false}
                  />
                </TabPane>

                <TabPane
                  tab={
                    <span>
                      <HeartOutlined />
                      Wishlist
                    </span>
                  }
                  key="wishlist"
                >
                  <List
                    grid={{ gutter: 16, column: 2 }}
                    dataSource={wishlistItems}
                    renderItem={(item) => (
                      <List.Item>
                        <Card
                          hoverable
                          cover={<img alt={item.name} src={item.image} />}
                          actions={[
                            <ShoppingOutlined key="cart" />,
                            <HeartOutlined
                              key="remove"
                              style={{ color: "red" }}
                            />,
                          ]}
                        >
                          <Card.Meta
                            title={item.name}
                            description={
                              <div>
                                <div className="text-lg font-bold text-blue-600">
                                  {item.price}
                                </div>
                                <Rate disabled defaultValue={item.rating} />
                              </div>
                            }
                          />
                        </Card>
                      </List.Item>
                    )}
                  />
                </TabPane>

                <TabPane
                  tab={
                    <span>
                      <CreditCardOutlined />
                      Payment Methods
                    </span>
                  }
                  key="payment"
                >
                  <div className="space-y-4">
                    <Card className="border-dashed">
                      <div className="text-center py-8">
                        <PlusOutlined className="text-2xl text-gray-400 mb-2" />
                        <div>
                          <Button type="primary">Add Payment Method</Button>
                        </div>
                      </div>
                    </Card>
                  </div>
                </TabPane>

                <TabPane
                  tab={
                    <span>
                      <SettingOutlined />
                      Settings
                    </span>
                  }
                  key="settings"
                >
                  <div className="space-y-6">
                    <Card title="Account Settings" size="small">
                      <Space direction="vertical" className="w-full">
                        <Button block>Change Password</Button>
                        <Button block>Email Preferences</Button>
                        <Button block>Privacy Settings</Button>
                      </Space>
                    </Card>
                  </div>
                </TabPane>
              </Tabs>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Profile Edit Drawer */}
      <Drawer
        title="Edit Profile"
        placement="right"
        onClose={() => setProfileDrawerVisible(false)}
        open={profileDrawerVisible}
        width={400}
      >
        <Form layout="vertical" initialValues={userProfile}>
          <Form.Item label="Profile Photo" name="avatar">
            <Upload
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
            >
              {userProfile.avatar ? (
                <img src={userProfile.avatar} alt="avatar" className="w-full" />
              ) : (
                <div>
                  <PlusOutlined />
                  <div className="mt-2">Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item label="Full Name" name="name">
            <Input />
          </Form.Item>

          <Form.Item label="Email" name="email">
            <Input disabled />
          </Form.Item>

          <Form.Item label="Phone" name="phone">
            <Input />
          </Form.Item>

          <Form.Item label="Address" name="address">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Save Changes
              </Button>
              <Button onClick={() => setProfileDrawerVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );

  // Main render
  return <div>{!isLoggedIn ? <AuthUI /> : <DashboardUI />}</div>;
}
