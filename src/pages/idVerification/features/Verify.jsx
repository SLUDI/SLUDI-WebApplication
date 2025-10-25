import { Form, Image, Input, Modal, Radio, Typography, Empty } from "antd";
import MainButton from "../../../components/baseComponents/button/MainButton";

const { Text } = Typography;

export default function Verify({ open, onCancel, user }) {
  console.log("User Details:", user);

  // Convert base64 files to valid image URLs
  const getBase64Image = (file) => `data:image/jpeg;base64,${file}`;

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
      <div className="p-4 items-center justify-start w-full">
        <Form className="w-full">
          <Text className="t-23 text-black font-bold">Extracted Details</Text>

          {/* --- User Basic Details --- */}
          <div className="flex flex-row w-full gap-10 mt-5">
            <div className="flex flex-col w-full">
              <Text className="t-16 text-black font-medium">Full Name :</Text>
              <Input
                value={user?.fullName}
                readOnly
                className="text-black text-sm"
              />
            </div>
            <div className="flex flex-col w-full">
              <Text className="t-16 text-black font-medium">
                Date Of Birth :
              </Text>
              <Input
                value={user?.dateOfBirth}
                readOnly
                className="text-black text-sm"
              />
            </div>
          </div>

          <div className="flex flex-row w-full gap-10 mt-5">
            <div className="flex flex-col w-full">
              <Text className="t-16 text-black font-medium">
                Phone Number :
              </Text>
              <Input
                value={user?.phone}
                readOnly
                className="text-black text-sm"
              />
            </div>
            <div className="flex flex-col w-full">
              <Text className="t-16 text-black font-medium">NIC Number :</Text>
              <Input
                value={user?.nic}
                readOnly
                className="text-black text-sm"
              />
            </div>
          </div>

          <div className="flex flex-row w-full gap-10 mt-5">
            <div className="flex flex-col w-full">
              <Text className="t-16 text-black font-medium">Email :</Text>
              <Input
                value={user?.email}
                readOnly
                className="text-black text-sm"
              />
            </div>
            <div className="flex flex-col w-full">
              <Text className="t-16 text-black font-medium">Gender :</Text>
              <Input
                value={user?.gender}
                readOnly
                className="text-black text-sm"
              />
            </div>
          </div>

          <div className="flex flex-row w-full gap-10 mt-5">
            <div className="flex flex-col w-full">
              <Text className="t-16 text-black font-medium">Address :</Text>
              <Input
                value={`${user?.address?.street}, ${user?.address?.gramaNiladhariDivision}, ${user?.address?.city}`}
                readOnly
                className="text-black text-sm"
              />
            </div>
            <div className="flex flex-col w-full">
              <Text className="t-16 text-black font-medium">
                Divisional Secretariat :
              </Text>
              <Input
                value={user?.address?.divisionalSecretariat}
                readOnly
                className="text-black text-sm"
              />
            </div>
          </div>

          {/* --- Date Selection (placeholder) --- */}
          <div className="flex flex-row w-full gap-10 mt-5">
            <div className="flex flex-col w-full">
              <Text className="t-16 text-black font-medium">
                Appoinment date :
              </Text>
              <div className="w-full flex flex-row gap-10">
                <Form.Item name="date" className="w-full">
                  <Input
                    value={user?.dateOfBirth}
                    readOnly
                    className="text-black text-sm"
                  />
                </Form.Item>
              </div>
            </div>
          </div>

          {/* --- Supporting Documents Visualization --- */}
          <div className="flex flex-col w-full gap-10 mt-5">
            <Text className="t-16 text-black font-medium">
              Verification Details :
            </Text>

            {user?.supportingDocumentList?.length > 0 ? (
              <div className="w-full flex flex-row gap-10 items-start justify-start px-10">
                <Image.PreviewGroup>
                  <div className="grid grid-cols-2 gap-6 w-full">
                    {user.supportingDocumentList.map((doc, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center justify-center border p-3 rounded-lg shadow-sm bg-gray-50"
                      >
                        <Text className="font-medium mb-2 text-black">
                          {doc.fileType} ({doc.side})
                        </Text>
                        <Image
                          width={200}
                          src={getBase64Image(doc.file)}
                          alt={doc.name}
                          className="rounded-md"
                        />
                      </div>
                    ))}
                  </div>
                </Image.PreviewGroup>

                {/* Action Buttons */}
                <div className="w-1/2 flex flex-col gap-8 justify-center items-center">
                  <MainButton
                    buttonText={"Reject"}
                    height={"30px"}
                    width={"70%"}
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
                    width={"70%"}
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
                    width={"70%"}
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
            ) : (
              <Empty description="No supporting documents available" />
            )}
          </div>
        </Form>
      </div>
    </Modal>
  );
}
