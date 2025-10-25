import React from "react";
import { DatePicker, Form, Input, Select, Typography, message } from "antd";
import MainButton from "../../../components/baseComponents/button/MainButton";
import { setCompletedSteps, setCurrentStep } from "../../../redux/stepSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRegister } from "../../../hooks/idCreate";
import { useLocation } from "react-router-dom";

const { Text } = Typography;
const { Option } = Select;

export default function Step1() {
  const dispatch = useDispatch();
  const currentStep = useSelector((state) => state.step.currentStep);
  const completedSteps = useSelector((state) => state.step.completedSteps);
  const location = useLocation();

  // ✅ Retrieve user data passed via navigate
  const {
    userId,
    fullName,
    dateofBirth,
    nic,
    phone,
    address,
    email,
    age,
    gender,
  } = location.state || {};

  console.log("User Info Received:", {
    userId,
    fullName,
    email,
    nic,
    phone,
    dateofBirth,
  });

  const { mutate, isPending } = useRegister();

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
    const payload = {
      nic: values.nicNumber,
      deviceInfo: {
        deviceId: "web-frontend",
        deviceType: "browser",
        os: window.navigator.platform,
        ipAddress: "0.0.0.0",
        location: "",
      },
    };

    mutate(payload, {
      onSuccess: (res) => {
        message.success(
          res.response?.data?.message || "Registration successful!"
        );
        dispatch(setCurrentStep(currentStep + 1));
        dispatch(setCompletedSteps(completedSteps + 1));
      },
      onError: (err) => {
        message.error(err.response?.data?.message || "Registration failed");
      },
    });
  };

  return (
    <div className="w-2/3 bg-[#ffffff] p-6 mt-10 ">
      <Form
        className="w-full"
        onFinish={onFinish}
        initialValues={{
          name: fullName,
          //dob: dateofBirth,
          nicNumber: nic,
          mobilenumber: phone,
          address: address,
          email: email,
          age: age,
          gender: gender,
        }}
      >
        {/* Full Name */}
        <div className="flex flex-col w-full">
          <Text className="t-16 text-black font-medium">Full Name :</Text>
          <Form.Item className="w-full" name="name">
            <Input readOnly className="text-black text-sm" />
          </Form.Item>
        </div>

        {/* DOB, Gender, Age */}
        <div className="w-full flex flex-row gap-4">
          {/* <div className="flex flex-col w-full">
            <Text className="t-16 text-black font-medium">DOB :</Text>
            <Form.Item className="w-full" name="dob">
              <DatePicker
                size="small"
                placeholder="Select date"
                className="w-full"
              />
            </Form.Item>
          </div> */}

          <div className="flex flex-col w-full">
            <Text className="t-16 text-black font-medium">Gender :</Text>
            <Form.Item className="w-full" name="gender">
              <Select size="small" placeholder="Select Gender">
                <Option value="Male">Male</Option>
                <Option value="Female">Female</Option>
              </Select>
            </Form.Item>
          </div>

          <div className="flex flex-col w-full">
            <Text className="t-16 text-black font-medium">Age :</Text>
            <Form.Item className="w-full" name="age">
              <Input size="small" placeholder="Enter Age" />
            </Form.Item>
          </div>
        </div>

        {/* Address */}
        <div className="flex flex-col w-full">
          <Text className="t-16 text-black font-medium">Address :</Text>
          <Form.Item className="w-full" name="address">
            <Input size="small" placeholder="Enter Address" />
          </Form.Item>
        </div>

        {/* Email */}
        <div className="flex flex-col w-full">
          <Text className="t-16 text-black font-medium">Email :</Text>
          <Form.Item className="w-full" name="email">
            <Input size="small" placeholder="Enter Email" type="email" />
          </Form.Item>
        </div>

        {/* Phone and NIC */}
        <div className="w-full flex flex-row gap-4">
          <div className="flex flex-col w-full">
            <Text className="t-16 text-black font-medium">Mobile Number :</Text>
            <Form.Item className="w-full" name="mobilenumber">
              <Input size="small" placeholder="Enter Mobile Number" />
            </Form.Item>
          </div>

          <div className="flex flex-col w-full">
            <Text className="t-16 text-black font-medium">NIC Number :</Text>
            <Form.Item className="w-full" name="nicNumber">
              <Input size="small" placeholder="Enter NIC Number" />
            </Form.Item>
          </div>
        </div>

        {/* Submit Button */}
        <div className="w-full flex items-center justify-end gap-2 mt-10">
          <Form.Item className="w-[20%]">
            <MainButton
              buttonText={isPending ? "Registering..." : "Next"}
              height="30px"
              width="100%"
              minWidth="63px"
              type="primary"
              color="#ffffff"
              paddingY="2px"
              htmlType="submit"
              disabled={isPending}
            />
          </Form.Item>
        </div>
      </Form>
    </div>
  );
}
