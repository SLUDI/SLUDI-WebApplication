import React, { useState } from "react";
import {
  Form,
  Input,
  Card,
  Checkbox,
  Upload,
  Button,
  Row,
  Col,
  Typography,
  message,
  Divider,
  Space,
  DatePicker,
} from "antd";
import { Upload as UploadIcon, CheckCircle, User, Info } from "lucide-react";
import {
  useLicenseCreate,
  useVehicleCategories,
} from "../../hooks/licenseIssue";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const { Title, Text } = Typography;

export default function LicenseIssuanceForm() {
  const location = useLocation();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Get data from navigation state
  const navigationData = location.state;

  console.log("Navigation State Data:", navigationData);
  console.log("Session ID:", navigationData?.sessionId);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const verificationData = useSelector((state) => state.licenseVerification);

  console.log("Verification Data:", verificationData);

  // Extract shared attributes safely
  const citizenInfo = verificationData?.sharedAttributes || {};

  const { data: vehicleCategories } = useVehicleCategories();
  const licenseRequest = useLicenseCreate();

  const categories = vehicleCategories
    ? Object.entries(vehicleCategories.data).map(([id, description]) => ({
        id,
        name: `Category ${id}`,
        description,
      }))
    : [];

  console.log("Vehicle Categories:", vehicleCategories?.data);

  const handleIssueLicense = (values) => {
    const payload = {
      sessionId: verificationData?.sessionId || navigationData?.sessionId,
      validityYears: values.validityPeriod,
      issuingAuthority: values.issuingAuthority,
      restrictions: values.restrictions || "",
      endorsements: values.endorsements || "",
      vehicleCategories: selectedCategories.join(","),
      categoryValidFrom: values.categoryValidFrom
        ? values.categoryValidFrom.format("YYYY-MM-DD")
        : null,
      categoryValidUntil: values.categoryValidUntil
        ? values.categoryValidUntil.format("YYYY-MM-DD")
        : null,
      categoryRestrictions: values.categoryRestrictions || "",
      documentTypes: "PDF,JPEG",
      documents: values.documents.fileList,
    };

    licenseRequest.mutate(payload, {
      onSuccess: () => {
        message.success("License issued successfully!");
        navigate("/issuedLicenses");
      },
      onError: () => message.error("Something went wrong!"),
    });
  };

  const handleDOBChange = (date) => {
    if (date) {
      const years = dayjs().diff(date, "year");
      form.setFieldsValue({ age: years });
    } else {
      form.setFieldsValue({ age: "" });
    }
  };

  return (
    <div style={{ padding: 24, minHeight: "100vh" }}>
      <Row justify="center">
        <Col xs={24} lg={20}>
          <Form layout="vertical" onFinish={handleIssueLicense}>
            {/* Citizen Information */}
            <Card>
              <Space align="center" style={{ marginBottom: 16 }}>
                <User className="w-5 h-5 text-gray-700" />
                <Title level={4} style={{ margin: 0 }}>
                  Citizen Information (Verified)
                </Title>
              </Space>

              <Row gutter={[24, 16]}>
                {/* LEFT SIDE: DETAILS */}
                <Col xs={24} md={16}>
                  <Row gutter={[24, 16]}>
                    <Col span={12}>
                      <Text type="secondary">Full Name</Text>
                      <p>
                        <b>
                          {citizenInfo?.fullName ||
                            navigationData?.sharedAttributes?.fullName}
                        </b>
                      </p>
                    </Col>

                    <Col span={12}>
                      <Text type="secondary">NIC</Text>
                      <p>
                        <b>
                          {citizenInfo?.nic ||
                            navigationData?.sharedAttributes?.nic}
                        </b>
                      </p>
                    </Col>

                    <Col span={12}>
                      <Text type="secondary">Date of Birth</Text>
                      <p>
                        <b>
                          {citizenInfo?.dateOfBirth ||
                            navigationData?.sharedAttributes?.dateOfBirth}
                        </b>
                      </p>
                    </Col>

                    <Col span={12}>
                      <Text type="secondary">Age</Text>
                      <p>
                        <b>
                          {citizenInfo?.age ||
                            navigationData?.sharedAttributes?.age}{" "}
                          years
                        </b>
                      </p>
                    </Col>

                    <Col span={12}>
                      <Text type="secondary">Blood Group</Text>
                      <p>
                        <b>
                          {citizenInfo?.bloodGroup ||
                            navigationData?.sharedAttributes?.bloodGroup}
                        </b>
                      </p>
                    </Col>

                    <Col span={12}>
                      <Text type="secondary">Address</Text>
                      <p>
                        <b>
                          {citizenInfo?.address?.street
                            ? `${citizenInfo.address.street}, ${citizenInfo.address.city}`
                            : `${navigationData?.sharedAttributes?.address?.street}, ${navigationData?.sharedAttributes?.address?.city}`}
                        </b>
                      </p>
                    </Col>

                    <Col span={12}>
                      <Text type="secondary">Status</Text>
                      <Space>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <Text strong type="success">
                          Verified
                        </Text>
                      </Space>
                    </Col>
                  </Row>
                </Col>

                {/* RIGHT SIDE: PROFILE PHOTO */}
                <Col xs={24} md={8} style={{ textAlign: "center" }}>
                  <img
                    src={
                      citizenInfo?.profilePhoto ||
                      navigationData?.sharedAttributes?.profilePhoto
                    }
                    alt="Profile"
                    style={{
                      width: 150,
                      height: 150,
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "3px solid #e0e0e0",
                    }}
                  />
                </Col>
              </Row>
            </Card>

            {/* License Details */}
            <Card style={{ marginTop: 16 }}>
              <Title level={4}>License Details</Title>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    label="Validity Period (Years)"
                    name="validityPeriod"
                    initialValue="5"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Issuing Authority"
                    name="issuingAuthority"
                    initialValue={"Department of Motor Traffic, Sri Lanka"}
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    label="Category Valid From"
                    name="categoryValidFrom"
                    rules={[
                      {
                        required: true,
                        message: "Please enter category valid from date",
                      },
                    ]}
                  >
                    <DatePicker
                      className="w-full rounded-lg"
                      size="large"
                      onChange={handleDOBChange}
                      disabledDate={(current) =>
                        current && current > dayjs().endOf("day")
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Category Valid Until"
                    name="categoryValidUntil"
                    rules={[
                      {
                        required: true,
                        message: "Please select category valid until date",
                      },
                    ]}
                  >
                    <DatePicker
                      className="w-full rounded-lg"
                      size="large"
                      onChange={handleDOBChange}
                      disabledDate={(current) =>
                        current && current > dayjs().endOf("day")
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* Vehicle Categories */}
            <Card style={{ marginTop: 16 }}>
              <Title level={4}>Vehicle Categories</Title>
              <Text type="danger">* Required</Text>

              <div style={{ marginTop: 16 }}>
                {categories.map((cat) => (
                  <Card
                    key={cat.id}
                    size="small"
                    hoverable
                    style={{
                      marginBottom: 12,
                      borderColor: selectedCategories.includes(cat.id)
                        ? "#1677ff"
                        : "#d9d9d9",
                      background: selectedCategories.includes(cat.id)
                        ? "#e6f4ff"
                        : "white",
                    }}
                    onClick={() =>
                      setSelectedCategories((prev) =>
                        prev.includes(cat.id)
                          ? prev.filter((id) => id !== cat.id)
                          : [...prev, cat.id]
                      )
                    }
                  >
                    <Checkbox checked={selectedCategories.includes(cat.id)}>
                      <b>{cat.name}</b>
                      <div
                        style={{ fontSize: 12, marginTop: 4, color: "#666" }}
                      >
                        {cat.description}
                      </div>
                    </Checkbox>
                  </Card>
                ))}
              </div>
            </Card>

            {/* Supporting Documents */}
            <Card style={{ marginTop: 16 }}>
              <Title level={4}>Supporting Documents</Title>

              <Form.Item
                name="documents"
                rules={[{ required: true, message: "Documents required!" }]}
              >
                <Upload.Dragger
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  beforeUpload={() => false}
                >
                  <UploadIcon className="w-12 h-12 mx-auto text-gray-400" />
                  <p className="ant-upload-text">
                    Upload Test Certificates & Medical Reports
                  </p>
                  <p className="ant-upload-hint">PDF, JPG, PNG up to 10MB</p>
                </Upload.Dragger>
              </Form.Item>
            </Card>

            {/* Additional Information */}
            <Card style={{ marginTop: 16 }}>
              <Title level={4}>Additional Information (Optional)</Title>

              <Form.Item label="Restrictions" name="restrictions">
                <Input placeholder="e.g., Must wear corrective lenses" />
              </Form.Item>

              <Form.Item label="Endorsements" name="endorsements">
                <Input placeholder="e.g., Defensive driving course completed" />
              </Form.Item>
            </Card>

            {/* Footer */}
            <Card style={{ marginTop: 16 }}>
              <Row justify="space-between" align="middle">
                <Space>
                  <Info className="w-4 h-4" />
                  <Text>All information will be recorded on blockchain</Text>
                </Space>

                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  icon={<CheckCircle className="w-5 h-5" />}
                  loading={licenseRequest.isPending}
                >
                  Issue License
                </Button>
              </Row>
            </Card>
          </Form>
        </Col>
      </Row>
    </div>
  );
}
