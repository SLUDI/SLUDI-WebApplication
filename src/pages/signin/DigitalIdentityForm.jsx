import React, { useState } from "react";
import {
  Form,
  Input,
  DatePicker,
  Select,
  Upload,
  Button,
  message,
  Row,
  Col,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useCitizenRegister } from "../../hooks/idCreate";
import Sllogo from "../../assets/images/SLlogo";

const { Option } = Select;

const DigitalIdentityForm = () => {
  const [form] = Form.useForm();
  // const [age, setAge] = useState(null);
  const [divisionDates, setDivisionDates] = useState([]);

  const { mutate, isPending } = useCitizenRegister();

  const onFinish = (values) => {
    const supportingDocs = [];

    if (values.nicFrontUpload && values.nicFrontUpload.length > 0) {
      supportingDocs.push(values.nicFrontUpload[0].originFileObj);
    }
    if (values.nicBackUpload && values.nicBackUpload.length > 0) {
      supportingDocs.push(values.nicBackUpload[0].originFileObj);
    }
    if (values.birthCertFrontUpload && values.birthCertFrontUpload.length > 0) {
      supportingDocs.push(values.birthCertFrontUpload[0].originFileObj);
    }
    if (values.birthCertBackUpload && values.birthCertBackUpload.length > 0) {
      supportingDocs.push(values.birthCertBackUpload[0].originFileObj);
    }

    const payload = {
      ...values,
      dateOfBirth: values.dob ? values.dob.format("YYYY-MM-DD") : null,
      os: window.navigator.platform,
      deviceId: "web-frontend",
      ipAddress: "0.0.0.0",
      deviceType: "browser",
      location: "",
      supportingDocuments: supportingDocs,
    };

    console.log("Payload to submit:", payload);

    mutate(payload, {
      onSuccess: (res) => {
        message.success(res?.message || "Citizen Registered Successfully!");
      },
      onError: (err) => {
        message.error(
          err.response?.data?.message || "Citizen Registration Failed!"
        );
      },
    });
  };

  // Auto-calculate Age from DOB
  const handleDOBChange = (date) => {
    if (date) {
      const years = dayjs().diff(date, "year");

      form.setFieldsValue({ age: years });
    } else {
      form.setFieldsValue({ age: "" });
    }
  };

  // Disable past dates + Sundays

  const disableDates = (current) => {
    const today = dayjs().startOf("day");
    return current && (current < today || current.day() === 0);
  };

  // Allow only 3 dates (not less, not more)
  const handleDivisionDateChange = (dates) => {
    if (dates.length > 3) {
      message.warning("You must select exactly 3 dates");
      return;
    }
    setDivisionDates(dates);
    form.setFieldsValue({ divisionDates: dates });
  };

  // const handleFinish = (values) => {
  //   console.log("Form Values:", values);
  //   message.success("Digital Identity Submitted Successfully ✅");
  // };

  return (
    <div className="py-6 px-20 lg:px-50 max-w-ful mx-auto bg-white shadow-md rounded-2xl">
      <div className="flex flex-row space-x-3">
        <div className="items-center justify-center">
          <Sllogo className="h-30 md:h-40 spin-vertical" />
        </div>

        <div className="flex justify-center mb-6 items-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Digital Identity Registration
          </h2>
        </div>
      </div>

      <div className="mt-6">
        {" "}
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="space-y-4 "
        >
          {/* Row 1 */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Full Name"
                name="fullName"
                rules={[{ required: true, message: "Please enter full name" }]}
              >
                <Input placeholder="Enter full name" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="Date of Birth"
                name="dob"
                rules={[
                  { required: true, message: "Please select date of birth" },
                ]}
              >
                <DatePicker
                  className="w-full"
                  onChange={handleDOBChange}
                  disabledDate={(current) =>
                    current && current > dayjs().endOf("day")
                  }
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Age" name="age">
                <Input placeholder="Auto-calculated" disabled />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="NIC Number"
                name="nic"
                rules={[{ required: true, message: "Please enter NIC number" }]}
              >
                <Input placeholder="Enter NIC number" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Gender"
                name="gender"
                rules={[{ required: true, message: "Please select gender" }]}
              >
                <Select placeholder="Select gender">
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Blood Group"
                name="bloodGroup"
                rules={[
                  { required: true, message: "Please select blood group" },
                ]}
              >
                <Select placeholder="Select blood group">
                  <Option value="A+">A+</Option>
                  <Option value="A-">A-</Option>
                  <Option value="B+">B+</Option>
                  <Option value="B-">B-</Option>
                  <Option value="O+">O+</Option>
                  <Option value="O-">O-</Option>
                  <Option value="AB+">AB+</Option>
                  <Option value="AB-">AB-</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Contact Information */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter email" },
                  { type: "email", message: "Invalid email format" },
                ]}
              >
                <Input placeholder="Enter email address" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Phone Number"
                name="phone"
                rules={[
                  { required: true, message: "Please enter phone number" },
                ]}
              >
                <Input placeholder="Enter phone number" />
              </Form.Item>
            </Col>
          </Row>

          {/* Address Information */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Street Address"
                name="street"
                rules={[
                  { required: true, message: "Please enter street address" },
                ]}
              >
                <Input placeholder="Enter street address" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="City"
                name="city"
                rules={[{ required: true, message: "Please enter city" }]}
              >
                <Input placeholder="Enter city" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="District"
                name="district"
                rules={[{ required: true, message: "Please enter district" }]}
              >
                <Input placeholder="Enter district" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Postal Code"
                name="postalCode"
                rules={[
                  { required: true, message: "Please enter postal code" },
                ]}
              >
                <Input placeholder="Enter postal code" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Divisional Secretariat"
                name="divisionSecretariat"
                rules={[
                  {
                    required: true,
                    message: "Please enter divisional secretariat",
                  },
                ]}
              >
                <Input placeholder="Enter divisional secretariat" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Grama Niladhari Division"
                name="gramaNiladhariDivision"
                rules={[
                  {
                    required: true,
                    message: "Please enter grama niladhari division",
                  },
                ]}
              >
                <Input placeholder="Enter grama niladhari division" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Province"
                name="province"
                rules={[{ required: true, message: "Please select province" }]}
              >
                <Select placeholder="Select province">
                  <Option value="western">Western Province</Option>
                  <Option value="central">Central Province</Option>
                  <Option value="southern">Southern Province</Option>
                  <Option value="northern">Northern Province</Option>
                  <Option value="eastern">Eastern Province</Option>
                  <Option value="northCentral">North Central Province</Option>
                  <Option value="northWestern">North Western Province</Option>
                  <Option value="uva">Uva Province</Option>
                  <Option value="sabaragamuwa">Sabaragamuwa Province</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Nationality Information */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Citizenship"
                name="citizenship"
                rules={[
                  { required: true, message: "Please enter citizenship" },
                ]}
              >
                <Input
                  placeholder="Enter citizenship"
                  defaultValue="Sri Lankan"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Nationality"
                name="nationality"
                rules={[
                  { required: true, message: "Please enter nationality" },
                ]}
              >
                <Input
                  placeholder="Enter nationality"
                  defaultValue="Sri Lankan"
                />
              </Form.Item>
            </Col>
          </Row>

          {/* NEW: Division Sector Dates */}
          <Form.Item
            label="Division Sector Dates (Must Select 3)"
            name="divisionDates"
            rules={[
              {
                validator: (_, value) => {
                  if (!value || value.length !== 3) {
                    return Promise.reject(
                      new Error("Please select exactly 3 dates")
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <DatePicker
              multiple
              disabledDate={disableDates}
              className="w-full"
              value={divisionDates}
              onChange={handleDivisionDateChange}
            />
          </Form.Item>

          {/* Upload Section */}
          <div className="p-4 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold mb-3">Upload Documents</h3>

            <Row gutter={[16, 16]}>
              {/* NIC Upload (Front + Back) */}
              <Col xs={24} lg={12}>
                <div className="border p-3 rounded-md bg-white">
                  <h4 className="text-sm font-medium mb-2">
                    National Identity Card
                  </h4>

                  <Row gutter={[12, 12]}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="NIC Front Side"
                        name="nicFrontUpload"
                        valuePropName="fileList"
                        getValueFromEvent={(e) =>
                          Array.isArray(e) ? e : e && e.fileList
                        }
                        rules={[
                          {
                            required: true,
                            message: "Please upload NIC front side",
                          },
                        ]}
                      >
                        <Upload
                          beforeUpload={() => false}
                          maxCount={1}
                          accept="image/*"
                          listType="picture"
                        >
                          <Button icon={<UploadOutlined />}>
                            Upload Front
                          </Button>
                        </Upload>
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="NIC Back Side"
                        name="nicBackUpload"
                        valuePropName="fileList"
                        getValueFromEvent={(e) =>
                          Array.isArray(e) ? e : e && e.fileList
                        }
                        rules={[
                          {
                            required: true,
                            message: "Please upload NIC back side",
                          },
                        ]}
                      >
                        <Upload
                          beforeUpload={() => false}
                          maxCount={1}
                          accept="image/*"
                          listType="picture"
                        >
                          <Button icon={<UploadOutlined />}>Upload Back</Button>
                        </Upload>
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              </Col>

              {/* Birth Certificate Upload (Front + Back) */}
              <Col xs={24} lg={12}>
                <div className="border p-3 rounded-md bg-white">
                  <h4 className="text-sm font-medium mb-2">
                    Birth Certificate
                  </h4>

                  <Row gutter={[12, 12]}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Birth Certificate Front"
                        name="birthCertFrontUpload"
                        valuePropName="fileList"
                        getValueFromEvent={(e) =>
                          Array.isArray(e) ? e : e && e.fileList
                        }
                        rules={[
                          {
                            required: true,
                            message: "Please upload Birth Certificate front",
                          },
                        ]}
                      >
                        <Upload
                          beforeUpload={() => false}
                          maxCount={1}
                          accept="image/*"
                          listType="picture"
                        >
                          <Button icon={<UploadOutlined />}>
                            Upload Front
                          </Button>
                        </Upload>
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Birth Certificate Back"
                        name="birthCertBackUpload"
                        valuePropName="fileList"
                        getValueFromEvent={(e) =>
                          Array.isArray(e) ? e : e && e.fileList
                        }
                        rules={[
                          {
                            required: true,
                            message: "Please upload Birth Certificate back",
                          },
                        ]}
                      >
                        <Upload
                          beforeUpload={() => false}
                          maxCount={1}
                          accept="image/*"
                          listType="picture"
                        >
                          <Button icon={<UploadOutlined />}>Upload Back</Button>
                        </Upload>
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </div>

          {/* Submit */}
          <Form.Item className="pt-4">
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              disabled={isPending}
            >
              Submit Digital Identity
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default DigitalIdentityForm;
