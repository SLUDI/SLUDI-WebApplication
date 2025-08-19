import { DatePicker, Form, Input, Select, Typography } from "antd";
import React from "react";
import MainButton from "../../../components/baseComponents/button/MainButton";
import { setCompletedSteps, setCurrentStep } from "../../../redux/stepSlice";
import { useDispatch, useSelector } from "react-redux";
const Text = Typography;

export default function Step1() {
  const dispatch = useDispatch();
  const currentStep = useSelector((state) => state.step.currentStep);
  const completedSteps = useSelector((state) => state.step.completedSteps);

  return (
    <div className="w-2/3 bg-[#ffffff] p-6 mt-10 ">
      <Form className="w-full ">
        <div className="flex flex-col w-full">
          <Text className="t-16 text-black font-medium ">Full Name :</Text>
          <Form.Item className="w-full" name="name">
            <Input size="smalle" placeholder="Enter Name" />
          </Form.Item>
        </div>

        <div className="w-full flex flex-row gap-30">
          <div className="flex flex-col w-full">
            <Text className="t-16 text-black font-medium ">DOB :</Text>
            <Form.Item className="w-full" name="dob">
              <DatePicker
                size="smalle"
                placeholder="select date"
                className="w-full"
              />
            </Form.Item>
          </div>
          <div className="flex flex-col w-full">
            <Text className="t-16 text-black font-medium ">Gender :</Text>
            <Form.Item className="w-full" name="gender">
              <Select size="smalle" placeholder="Select Gender">
                <Option value="Male">Male</Option>
                <Option value="Female">Female</Option>
              </Select>
            </Form.Item>
          </div>
          <div className="flex flex-col w-full">
            <Text className="t-16 text-black font-medium ">Age :</Text>
            <Form.Item className="w-full" name="age">
              <Input size="smalle" placeholder="Enter Age" />
            </Form.Item>
          </div>
        </div>

        <div className="flex flex-col w-full">
          <Text className="t-16 text-black font-medium ">Address :</Text>
          <Form.Item className="w-full" name="address">
            <Input size="smalle" placeholder="Enter Address" />
          </Form.Item>
        </div>

        <div className="flex flex-col w-full">
          <Text className="t-16 text-black font-medium ">Email :</Text>
          <Form.Item className="w-full" name="email">
            <Input size="smalle" placeholder="Enter Email" type="email" />
          </Form.Item>
        </div>

        <div className="w-full flex flex-row gap-30">
          <div className="flex flex-col w-full">
            <Text className="t-16 text-black font-medium ">
              Mobile Number :
            </Text>
            <Form.Item className="w-full" name="mobilenumber">
              <Input
                size="smalle"
                placeholder="Enter mobile Number"
                className="w-full"
              />
            </Form.Item>
          </div>
          <div className="flex flex-col w-full">
            <Text className="t-16 text-black font-medium ">NIC Number :</Text>
            <Form.Item className="w-full" name="nicNumber">
              <Input
                size="smalle"
                placeholder="Enter NIC Number"
                className="w-full"
              />
            </Form.Item>
          </div>
        </div>
        {/* Button */}
        <div className="w-full flex items-center justify-end gap-2 mt-10">
          <Form.Item className=" w-[20%]">
            <MainButton
              buttonText={"Next"}
              height={"30px"}
              width={"100%"}
              minWidth="63px"
              type="primary"
              color="#ffffff"
              paddingY="2px"
              htmlType={"submit"}
              onClick={() => {
                dispatch(setCurrentStep(currentStep + 1));
                dispatch(setCompletedSteps(completedSteps + 1));
              }}
            />
          </Form.Item>
        </div>
      </Form>
    </div>
  );
}
