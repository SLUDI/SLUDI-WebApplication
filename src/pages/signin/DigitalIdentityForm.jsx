import React from "react";
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
  Spin,
  Card,
} from "antd";
import {
  UploadOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  IdcardOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useCitizenRegister } from "../../hooks/idCreate";
import Sllogo from "../../assets/images/SLlogo";
import { useDeviceInfo } from "../../hooks/useDeviceInfo";
import { useNavigate } from "react-router-dom";
import { IoPersonOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { Calendar1Icon, CalendarIcon } from "lucide-react";

const { Option } = Select;

const DigitalIdentityForm = () => {
  const [form] = Form.useForm();
  // const [divisionDates, setDivisionDates] = useState([]);
  const navigate = useNavigate();

  const selectDate = useSelector((state) => state.availableDate.date);
  const selectDistrict = useSelector((state) => state.availableDate.distric);

  console.log("Selected Date from Redux:", selectDate);
  console.log("Selected District from Redux:", selectDistrict);

  const deviceInfo = useDeviceInfo();

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
      ...deviceInfo,
      supportingDocuments: supportingDocs,
      selectDate,
      selectDistrict,
    };

    console.log("Payload to submit:", payload);
    console.log("Device Info:", deviceInfo);

    mutate(payload, {
      onSuccess: (res) => {
        message.success({
          content: res?.message || "Citizen Registered Successfully!",
          duration: 3,
          style: {
            marginTop: "10vh",
          },
        });
        console.log("Registration response:", res);
        setTimeout(() => {
          navigate("/sign-in");
        }, 2000);
      },
      onError: (err) => {
        message.error({
          content:
            err.response?.data?.message || "Citizen Registration Failed!",
          duration: 3,
          style: {
            marginTop: "10vh",
          },
        });
      },
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

  // const disableDates = (current) => {
  //   const today = dayjs().startOf("day");
  //   return current && (current < today || current.day() === 0);
  // };

  // const handleDivisionDateChange = (dates) => {
  //   if (dates.length > 3) {
  //     message.warning("You must select exactly 3 dates");
  //     return;
  //   }
  //   setDivisionDates(dates);
  //   form.setFieldsValue({ divisionDates: dates });
  // };

  // Custom upload button component to match the image style
  const UploadButton = ({ label, required = false }) => (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors cursor-pointer bg-white">
      <UploadOutlined className="text-2xl text-gray-400 mb-2" />
      <div className="text-sm text-gray-600">
        {label} {required && <span className="text-red-500">*</span>}
      </div>
      <div className="text-xs text-gray-400 mt-1">Click or drag to upload</div>
    </div>
  );

  return (
    <div className="min-h-screen  from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Sllogo className="h-16 md:h-20" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Digital Identity Registration
          </h1>
          <p className="text-gray-600">
            Complete your digital identity profile with accurate information
          </p>
        </div>

        <Card className="shadow-xl border-0 rounded-2xl overflow-hidden">
          <div className="p-6">
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              className="space-y-6"
            >
              <div className="bg-blue-50 py-3 px-6 rounded-lg mb-6">
                <h3 className="text-md font-semibold text-blue-800 flex items-center">
                  <IoPersonOutline className="mr-2" />
                  Personal Information
                </h3>
              </div>
              {/* Personal Details Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <Form.Item
                  label={
                    <span className="font-medium text-gray-700">
                      <UserOutlined className="mr-2" />
                      Full Name
                    </span>
                  }
                  name="fullName"
                  rules={[
                    { required: true, message: "Please enter full name" },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="Enter full name"
                    className="rounded-lg"
                  />
                </Form.Item>

                {/* NIC Number */}
                <Form.Item
                  label={
                    <span className="font-medium text-gray-700">
                      <IdcardOutlined className="mr-2" />
                      NIC Number
                    </span>
                  }
                  name="nic"
                  rules={[
                    { required: true, message: "Please enter NIC number" },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="Enter NIC number"
                    className="rounded-lg"
                  />
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Date of Birth */}
                <Form.Item
                  label="Date of Birth"
                  name="dob"
                  rules={[
                    { required: true, message: "Please select date of birth" },
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

                {/* Age */}
                <Form.Item label="Age" name="age">
                  <Input
                    size="large"
                    placeholder="Auto-calculated"
                    disabled
                    className="rounded-lg bg-gray-50"
                  />
                </Form.Item>

                {/* Gender */}
                <Form.Item
                  label="Gender"
                  name="gender"
                  rules={[{ required: true, message: "Please select gender" }]}
                >
                  <Select
                    size="large"
                    placeholder="Select gender"
                    className="rounded-lg"
                  >
                    <Option value="male">Male</Option>
                    <Option value="female">Female</Option>
                    <Option value="other">Other</Option>
                  </Select>
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Blood Group */}
                <Form.Item
                  label="Blood Group"
                  name="bloodGroup"
                  rules={[
                    { required: true, message: "Please select blood group" },
                  ]}
                >
                  <Select
                    size="large"
                    placeholder="Select blood group"
                    className="rounded-lg"
                  >
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
              </div>

              {/* Contact Information Section */}
              <div className="mt-8">
                <div className="bg-blue-50 py-3 px-6 rounded-lg mb-6">
                  <h3 className="text-md font-semibold text-blue-800 flex items-center">
                    <PhoneOutlined className="mr-2" />
                    Contact Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email */}
                  <Form.Item
                    label={
                      <span className="font-medium text-gray-700">
                        <MailOutlined className="mr-2" />
                        Email
                      </span>
                    }
                    name="email"
                    rules={[
                      { required: true, message: "Please enter email" },
                      { type: "email", message: "Invalid email format" },
                    ]}
                  >
                    <Input
                      size="large"
                      placeholder="Enter email address"
                      className="rounded-lg"
                    />
                  </Form.Item>

                  {/* Phone Number */}
                  <Form.Item
                    label={
                      <span className="font-medium text-gray-700">
                        <PhoneOutlined className="mr-2" />
                        Phone Number
                      </span>
                    }
                    name="phone"
                    rules={[
                      { required: true, message: "Please enter phone number" },
                    ]}
                  >
                    <Input
                      size="large"
                      placeholder="Enter phone number"
                      className="rounded-lg"
                    />
                  </Form.Item>
                </div>
              </div>

              {/* Address Information Section */}
              <div className="mt-8">
                <div className="bg-blue-50 py-3 px-6 rounded-lg mb-6">
                  <h3 className="text-md font-semibold text-blue-800 flex items-center">
                    <HomeOutlined className="mr-2" />
                    Address Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Street Address */}
                  <Form.Item
                    label="Street Address"
                    name="street"
                    rules={[
                      {
                        required: true,
                        message: "Please enter street address",
                      },
                    ]}
                  >
                    <Input
                      size="large"
                      placeholder="Enter street address"
                      className="rounded-lg"
                    />
                  </Form.Item>

                  {/* City */}
                  <Form.Item
                    label="City"
                    name="city"
                    rules={[{ required: true, message: "Please enter city" }]}
                  >
                    <Input
                      size="large"
                      placeholder="Enter city"
                      className="rounded-lg"
                    />
                  </Form.Item>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                  {/* District */}
                  <Form.Item label="District" name="district">
                    <Input
                      size="large"
                      className="rounded-lg text-black text-sm"
                      defaultValue={selectDistrict}
                      readOnly
                    />
                  </Form.Item>

                  {/* Postal Code */}
                  <Form.Item
                    label="Postal Code"
                    name="postalCode"
                    rules={[
                      { required: true, message: "Please enter postal code" },
                    ]}
                  >
                    <Input
                      size="large"
                      placeholder="Enter postal code"
                      className="rounded-lg"
                    />
                  </Form.Item>

                  {/* Divisional Secretariat */}
                  <Form.Item
                    label="Divisional Secretariat"
                    name="divisionalSecretariat"
                    rules={[
                      {
                        required: true,
                        message: "Please enter divisional secretariat",
                      },
                    ]}
                  >
                    <Input
                      size="large"
                      placeholder="Enter divisional secretariat"
                      className="rounded-lg"
                    />
                  </Form.Item>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  {/* Grama Niladhari Division */}
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
                    <Input
                      size="large"
                      placeholder="Enter grama niladhari division"
                      className="rounded-lg"
                    />
                  </Form.Item>

                  {/* Nationality */}
                  <Form.Item
                    label="Nationality"
                    name="nationality"
                    rules={[
                      { required: true, message: "Please enter nationality" },
                    ]}
                  >
                    <Input
                      size="large"
                      placeholder="Enter nationality"
                      //defaultValue="Sri Lankan"
                      className="rounded-lg"
                    />
                  </Form.Item>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  {/* Blood Group */}
                  <Form.Item
                    label="Citizenship"
                    name="citizenship"
                    rules={[
                      { required: true, message: "Please select citizenship" },
                    ]}
                  >
                    <Input
                      size="large"
                      placeholder="Enter citizenship"
                      //defaultValue="Sri Lankan"
                      className="rounded-lg"
                    />
                  </Form.Item>

                  {/* Province */}
                  <Form.Item
                    label="Province"
                    name="province"
                    rules={[
                      { required: true, message: "Please select province" },
                    ]}
                  >
                    <Select
                      size="large"
                      placeholder="Select province"
                      className="rounded-lg"
                    >
                      <Option value="western">Western Province</Option>
                      <Option value="central">Central Province</Option>
                      <Option value="southern">Southern Province</Option>
                      <Option value="northern">Northern Province</Option>
                      <Option value="eastern">Eastern Province</Option>
                      <Option value="northCentral">
                        North Central Province
                      </Option>
                      <Option value="northWestern">
                        North Western Province
                      </Option>
                      <Option value="uva">Uva Province</Option>
                      <Option value="sabaragamuwa">
                        Sabaragamuwa Province
                      </Option>
                    </Select>
                  </Form.Item>
                </div>
              </div>

              {/* Division Dates Section */}
              <div className="mt-8">
                <div className="bg-blue-50 py-3 px-6 rounded-lg mb-6">
                  <h3 className="text-md font-semibold text-blue-800 flex items-center">
                    <Calendar1Icon className="mr-2 w-4" />
                    Your Appointment Booking Date
                  </h3>
                </div>

                <Form.Item name="divisionDates">
                  <Input
                    size="large"
                    className="rounded-lg text-black text-sm"
                    defaultValue={selectDate}
                    readOnly
                  />
                </Form.Item>
              </div>

              {/* Upload Documents Section */}
              <div className="mt-8">
                <div className="bg-blue-50 py-3 px-6 rounded-lg mb-6">
                  <h3 className="text-sm font-semibold text-blue-800">
                    Upload Documents
                  </h3>
                  <p className="text-blue-700 text-sm">
                    Upload clear images of your documents
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* NIC Upload */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-700">
                      National Identity Card
                    </h4>
                    <div className="space-y-4">
                      <Form.Item
                        name="nicFrontUpload"
                        valuePropName="fileList"
                        getValueFromEvent={(e) =>
                          Array.isArray(e) ? e : e && e.fileList
                        }
                        // rules={[
                        //   {
                        //     required: true,
                        //     message: "Please upload NIC front side",
                        //   },
                        // ]}
                      >
                        <Upload
                          beforeUpload={() => false}
                          maxCount={1}
                          accept="image/*"
                          listType="picture"
                          className="upload-section"
                        >
                          <UploadButton label="NIC Front Side" required />
                        </Upload>
                      </Form.Item>

                      <Form.Item
                        name="nicBackUpload"
                        valuePropName="fileList"
                        getValueFromEvent={(e) =>
                          Array.isArray(e) ? e : e && e.fileList
                        }
                        // rules={[
                        //   {
                        //     required: true,
                        //     message: "Please upload NIC back side",
                        //   },
                        // ]}
                      >
                        <Upload
                          beforeUpload={() => false}
                          maxCount={1}
                          accept="image/*"
                          listType="picture"
                          className="upload-section"
                        >
                          <UploadButton label="NIC Back Side" required />
                        </Upload>
                      </Form.Item>
                    </div>
                  </div>

                  {/* Birth Certificate Upload */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-700">
                      Birth Certificate
                    </h4>
                    <div className="space-y-4">
                      <Form.Item
                        name="birthCertFrontUpload"
                        valuePropName="fileList"
                        getValueFromEvent={(e) =>
                          Array.isArray(e) ? e : e && e.fileList
                        }
                        // rules={[
                        //   {
                        //     required: true,
                        //     message: "Please upload Birth Certificate front",
                        //   },
                        // ]}
                      >
                        <Upload
                          beforeUpload={() => false}
                          maxCount={1}
                          accept="image/*"
                          listType="picture"
                          className="upload-section"
                        >
                          <UploadButton
                            label="Birth Certificate Front"
                            required
                          />
                        </Upload>
                      </Form.Item>

                      <Form.Item
                        name="birthCertBackUpload"
                        valuePropName="fileList"
                        getValueFromEvent={(e) =>
                          Array.isArray(e) ? e : e && e.fileList
                        }
                        // rules={[
                        //   {
                        //     required: true,
                        //     message: "Please upload Birth Certificate back",
                        //   },
                        // ]}
                      >
                        <Upload
                          beforeUpload={() => false}
                          maxCount={1}
                          accept="image/*"
                          listType="picture"
                          className="upload-section"
                        >
                          <UploadButton
                            label="Birth Certificate Back"
                            required
                          />
                        </Upload>
                      </Form.Item>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    className="w-full h-12 text-lg font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 border-0 shadow-lg"
                    loading={isPending}
                  >
                    Submit Digital Identity
                  </Button>
                </Form.Item>
              </div>
            </Form>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DigitalIdentityForm;
