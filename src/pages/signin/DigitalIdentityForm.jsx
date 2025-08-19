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

const { Option } = Select;

const DigitalIdentityForm = () => {
  const [form] = Form.useForm();
  const [age, setAge] = useState(null);
  const [divisionDates, setDivisionDates] = useState([]);

  // Auto-calculate Age from DOB
  const handleDOBChange = (date) => {
    if (date) {
      const years = dayjs().diff(date, "year");
      setAge(years);
      form.setFieldsValue({ age: years });
    } else {
      setAge(null);
      form.setFieldsValue({ age: "" });
    }
  };

  // Disable past dates + Sundays
  const disableDates = (current) => {
    const today = dayjs().startOf("day");
    return (
      current && (current < today || current.day() === 0) // disable past + Sundays
    );
  };

  // Handle max 3 date selections
  const handleDivisionDateChange = (dates) => {
    if (dates.length > 3) {
      message.warning("You can select maximum 3 dates only");
      return;
    }
    setDivisionDates(dates);
    form.setFieldsValue({ divisionDates: dates });
  };

  const handleFinish = (values) => {
    console.log("Form Values:", values);
    message.success("Digital Identity Submitted Successfully ✅");
  };

  return (
    <div className="py-6 px-50 max-w-ful mx-auto bg-white shadow-md rounded-2xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Digital Identity Registration
      </h2>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="space-y-4"
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

          <Col span={12}>
            <Form.Item
              label="Date of Birth"
              name="dob"
              rules={[{ required: true, message: "Please select DOB" }]}
            >
              <DatePicker
                className="w-full"
                format="YYYY-MM-DD"
                onChange={handleDOBChange}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 2 */}
        <Row gutter={16}>
          <Col span={12}>
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

          <Col span={12}>
            <Form.Item label="Age" name="age">
              <Input value={age} disabled placeholder="Auto-calculated" />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 3 */}
        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: "Please enter address" }]}
        >
          <Input.TextArea placeholder="Enter residential address" rows={3} />
        </Form.Item>

        {/* Row 4 */}
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
              label="Mobile Number"
              name="mobile"
              rules={[
                { required: true, message: "Please enter mobile number" },
              ]}
            >
              <Input placeholder="Enter mobile number" />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 5 */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="NIC Number"
              name="nic"
              rules={[{ required: true, message: "Please enter NIC number" }]}
            >
              <Input placeholder="Enter NIC number" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Blood Group"
              name="bloodGroup"
              rules={[{ required: true, message: "Please select blood group" }]}
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

        {/* NEW: Division Sector */}
        <Form.Item
          label="Sri Lanka Division Sector"
          name="divisionSector"
          rules={[{ required: true, message: "Please select division sector" }]}
        >
          <Select placeholder="Select division sector">
            <Option value="western">Western Province</Option>
            <Option value="central">Central Province</Option>
            <Option value="southern">Southern Province</Option>
            <Option value="northern">Northern Province</Option>
            <Option value="eastern">Eastern Province</Option>
            <Option value="uva">Uva Province</Option>
            <Option value="sabaragamuwa">Sabaragamuwa Province</Option>
            <Option value="northCentral">North Central Province</Option>
            <Option value="northWestern">North Western Province</Option>
          </Select>
        </Form.Item>

        {/* NEW: Division Sector Dates */}
        <Form.Item
          label="Division Sector Dates (Max 3)"
          name="divisionDates"
          rules={[{ required: true, message: "Please select up to 3 dates" }]}
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

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="National Identity Card" name="nicUpload">
                <Upload beforeUpload={() => false} maxCount={1}>
                  <Button icon={<UploadOutlined />}>Upload NIC</Button>
                </Upload>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="Driving License" name="licenseUpload">
                <Upload beforeUpload={() => false} maxCount={1}>
                  <Button icon={<UploadOutlined />}>Upload License</Button>
                </Upload>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="Passport" name="passportUpload">
                <Upload beforeUpload={() => false} maxCount={1}>
                  <Button icon={<UploadOutlined />}>Upload Passport</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Submit */}
        <Form.Item className="pt-4">
          <Button type="primary" htmlType="submit" className="w-full">
            Submit Digital Identity
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default DigitalIdentityForm;
