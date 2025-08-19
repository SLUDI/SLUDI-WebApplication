import { Form, Image, Input, Modal, Radio, Typography } from "antd";
import MainButton from "../../../components/baseComponents/button/MainButton";
const Text = Typography;
export default function Verify({ open, onCancel }) {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      className="flex flex-col rounded-md"
      width={900}
      footer={null}
      destroyOnClose={true}
      maskClosable={false}
      centered={true}
    >
      <div className="p-4  items-center justify-start w-full ">
        <Form className=" w-full ">
          <Text className="t-23 text-black font-bold">Extracted Details</Text>
          <div className="flex flex-row w-full gap-10 mt-5">
            <div className="flex flex-col w-full">
              <Text className="t-16 text-black font-medium">Full Name :</Text>
              <Input
                size="smalle"
                value={"Ishan Devinda"}
                readOnly
                className="text-black text-sm "
              />
            </div>
            <div className="flex flex-col w-full">
              <Text className="t-16 text-black font-medium">
                Date Of Birth :
              </Text>
              <Input
                size="smalle"
                value={"1998/11/22"}
                readOnly
                className="text-black text-sm "
              />
            </div>
          </div>
          <div className="flex flex-row w-full gap-10 mt-5">
            <div className="flex flex-col w-full">
              <Text className="t-16 text-black font-medium">
                Phone Number :
              </Text>
              <Input
                size="smalle"
                value={"0705830147"}
                readOnly
                className="text-black text-sm "
              />
            </div>
            <div className="flex flex-col w-full">
              <Text className="t-16 text-black font-medium">NIC Number :</Text>
              <Input
                size="smalle"
                value={"983270573V"}
                readOnly
                className="text-black text-sm "
              />
            </div>
          </div>
          <div className="flex flex-row w-full gap-10 mt-5">
            <div className="flex flex-col w-full">
              <Text className="t-16 text-black font-medium">Email :</Text>
              <Input
                size="smalle"
                value={"ishan@1998sri@gmail.com"}
                readOnly
                className="text-black text-sm "
              />
            </div>
            <div className="flex flex-col w-full">
              <Text className="t-16 text-black font-medium">Gender :</Text>
              <Input
                size="smalle"
                value={"Male"}
                readOnly
                className="text-black text-sm "
              />
            </div>
          </div>
          <div className="flex flex-row w-full gap-10 mt-5">
            <div className="flex flex-col w-full">
              <Text className="t-16 text-black font-medium">Address :</Text>
              <Input
                size="smalle"
                value={"No/10 Galle"}
                readOnly
                className="text-black text-sm "
              />
            </div>
            <div className="flex flex-col w-full">
              <Text className="t-16 text-black font-medium">
                Divisional Secretariat :
              </Text>
              <Input
                size="smalle"
                value={"Galle"}
                readOnly
                className="text-black text-sm "
              />
            </div>
          </div>
          <div className="flex flex-row w-full gap-10 mt-5">
            <div className="flex flex-col w-full">
              <Text className="t-16 text-black font-medium">
                Select dates :
              </Text>
              <div className="w-full flex flex-row gap-10">
                <Form.Item name="date" className="w-full ">
                  <Radio.Group
                    options={[
                      { value: 1, label: "2025/05/21" },
                      { value: 2, label: "2025/05/21" },
                      { value: 3, label: "2025/05/21" },
                    ]}
                    className="t-16 "
                  />
                </Form.Item>
              </div>
            </div>
          </div>
          <div className="flex flex-row w-full gap-10 mt-5">
            <div className="flex flex-col w-full">
              <Text className="t-16 text-black font-medium">
                Verification details :
              </Text>
              <div className="w-full flex flex-row gap-10 items-center justify-center px-10">
                <Image.PreviewGroup
                  items={[
                    "https://img.freepik.com/free-psd/id-card-mockup_358694-108.jpg",
                    "https://images.pexels.com/photos/3962285/pexels-photo-3962285.jpeg",
                  ]}
                >
                  <Image
                    width={400}
                    src="https://img.freepik.com/free-psd/id-card-mockup_358694-108.jpg"
                  />
                </Image.PreviewGroup>

                <div className="w-1/2 flex flex-col gap-8 justify-center items-center ">
                  <MainButton
                    buttonText={"Reject"}
                    height={"30px"}
                    width={"60%"}
                    minWidth="63px"
                    type="primary"
                    color="#ffffff"
                    paddingY="2px"
                    htmlType={"submit"}
                    buttonColor={"#FD0B0B"}
                    borderColor={"#FD0B0B"}
                  />
                  <MainButton
                    buttonText={"Request Resubmission"}
                    height={"30px"}
                    width={"60%"}
                    minWidth="63px"
                    type="primary"
                    color="#ffffff"
                    paddingY="2px"
                    htmlType={"submit"}
                    buttonColor={"#FFC107"}
                    borderColor="#FFC107"
                  />
                  <MainButton
                    buttonText={"Approve"}
                    height={"30px"}
                    width={"60%"}
                    minWidth="63px"
                    type="primary"
                    color="#ffffff"
                    paddingY="2px"
                    htmlType={"submit"}
                    buttonColor={"#1FC41A"}
                    borderColor="#1FC41A"
                  />
                </div>
              </div>
            </div>
          </div>
        </Form>
      </div>
    </Modal>
  );
}
