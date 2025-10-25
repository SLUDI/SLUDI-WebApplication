// import T from "../../components/baseComponents/text/T";
import { Button, Pagination, Spin, Tooltip, Typography } from "antd";
import NoPostImg from "../../assets/images/NoPostImg";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import MainButton from "../../components/baseComponents/button/MainButton";
import { useState } from "react";
import Verify from "./features/Verify";
import { useIdVerification } from "../../hooks/idCreate";
import dayjs from "dayjs";

const Text = Typography;

export default function IdVerification() {
  const [verify, setOpenVerify] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const {
    data: idVerificationData,
    isError,
    error,
    isLoading,
  } = useIdVerification();

  console.log("idVerificationData", idVerificationData);

  // Extract posts from API response
  const posts = idVerificationData?.data || [];

  console.log("idVerificationData", idVerificationData);

  //pagination
  // const itemRender = (_, type, originalElement) => {
  //   if (type === "prev") {
  //     return (
  //       <a className="pr-2 t-13 flex items-center justify-center gap-2 text-colorDarkDarkGray">
  //         <span>
  //           <MdKeyboardArrowLeft className="text-[16px] " />
  //         </span>
  //         Previous
  //         <span>|</span>
  //       </a>
  //     );
  //   }
  //   if (type === "next") {
  //     return (
  //       <a className="pl-2 t-13 flex items-center justify-center gap-2 text-colorDarkDarkGray">
  //         <span>|</span>
  //         Next
  //         <span>
  //           <MdKeyboardArrowRight className="text-[16px] font-light" />
  //         </span>
  //       </a>
  //     );
  //   }
  //   return originalElement;
  // };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Text className="text-red-500 font-semibold">
          Error: {error?.message || "Failed to load verification data"}
        </Text>
      </div>
    );
  }

  return (
    <>
      <div className="p-6  max-h-screen">
        <Text className="font-semibold min-w-fit t-36 ">Id verification</Text>
        <div className="w-full  sm:w-full  rounded-xl py-8 px-2 ssm:px-3 sm:px-4 lg:px-8 mt-4 bg-colorSelected gap-4 flex flex-col flex-1 items-center justify-between bg-[#CCCCCC]">
          <div className="w-full flex items-center gap-4">
            <Text className="t-23 font-bold text-black">
              Pending Verification Requests
            </Text>
          </div>

          {!isLoading && (
            <div className="w-full overflow-auto scroll">
              {/* header */}
              {posts?.length > 0 && (
                <div className="w-full min-w-[700px] grid grid-cols-24 rounded-t-xl bg-[#13A4B4]">
                  <div className="col-span-5 xl:col-span-6 flex items-center justify-start p-3 h-[40px] rounded-tl-lg">
                    <Tooltip title="Post title">
                      <Text className="t-13 font-bold pr-[1px] truncate">
                        Name
                      </Text>
                    </Tooltip>
                  </div>
                  <div className="col-span-5 h-[40px] flex items-center justify-start p-3">
                    <Tooltip title="Type">
                      <Text className="t-13 font-bold pr-[1px] truncate">
                        Email
                      </Text>
                    </Tooltip>
                  </div>
                  <div className="col-span-4 h-[40px] flex items-center justify-start p-3">
                    <Tooltip title="Date">
                      <Text className="t-13 font-bold pr-[1px] truncate">
                        Phone
                      </Text>
                    </Tooltip>
                  </div>
                  <div className="col-span-4 xl:col-span-3 h-[40px] flex items-center justify-start p-3">
                    <Tooltip title="Status">
                      <Text className="t-13 font-bold pr-[1px] truncate">
                        ID Number
                      </Text>
                    </Tooltip>
                  </div>

                  <div className="col-span-4 h-[40px] flex items-center justify-center p-3">
                    <Tooltip title="Total reached">
                      <Text className="t-13 font-bold pr-[1px] truncate">
                        Submitted
                      </Text>
                    </Tooltip>
                  </div>
                  <div className="col-span-2 h-[40px] flex items-center justify-center p-3 rounded-tr-lg">
                    <Tooltip title="Action">
                      <Text className="t-13 font-bold pr-[1px] truncate">
                        Action
                      </Text>
                    </Tooltip>
                  </div>
                </div>
              )}

              {/* data */}
              {posts?.length > 0 ? (
                <div
                  className="w-full  min-w-[700px]"
                  //style={{ height: `${window.innerHeight - 350}px` }}
                >
                  {posts.map((post, index) => {
                    return (
                      <div
                        key={index}
                        className="w-full grid grid-cols-24  pt-1  hover:bg-[#DFEFFF]  "
                      >
                        <div className="col-span-5 xl:col-span-6 flex items-center justify-start p-3 h-[40px]">
                          <Tooltip title={post?.fullName}>
                            <Text className="t-13 font-bold pr-[1px] truncate text-colorDarkDarkGray">
                              {post?.fullName}
                            </Text>
                          </Tooltip>
                        </div>
                        <div className="col-span-5 h-[40px] flex items-center justify-start p-3">
                          <Tooltip title={post?.email}>
                            <Text className="t-13 font-bold pr-[1px] truncate  text-colorDarkDarkGray">
                              {post?.email}
                            </Text>
                          </Tooltip>
                        </div>
                        <div className="col-span-4 h-[40px] flex items-center justify-start p-3">
                          <Tooltip title={post?.phone}>
                            <Text className="t-13 font-bold pr-[1px] truncate  text-colorDarkDarkGray">
                              {post?.phone}
                            </Text>
                          </Tooltip>
                        </div>
                        <div className="col-span-4 xl:col-span-3 h-[40px] flex items-center justify-start p-3">
                          <Tooltip title={post?.nic}>
                            <Text className="t-13 font-bold pr-[1px] truncate  text-colorDarkDarkGray">
                              {post?.nic}
                            </Text>
                          </Tooltip>
                        </div>

                        <div className="col-span-4 h-[40px] flex items-center justify-center p-3">
                          <Tooltip title={post?.createdAt}>
                            <Text className="t-13 font-bold pr-[1px] truncate  text-colorDarkDarkGray">
                              {dayjs(post?.createdAt).format("YYYY-MM-DD")}
                            </Text>
                          </Tooltip>
                        </div>
                        <div className="col-span-2 h-[45px] flex items-center justify-center p-3 rounded-tr-lg">
                          <MainButton
                            buttonText={"Check"}
                            height={"30px"}
                            width={"20%"}
                            minWidth="63px"
                            type="primary"
                            color="#ffffff"
                            paddingY="2px"
                            htmlType={"submit"}
                            onClick={() => {
                              setSelectedUser(post);
                              setOpenVerify(true);
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="w-full  flex flex-col flex-1 items-center justify-center">
                  <NoPostImg className="w-[50%] xl:w-[35%] mb-1 h-[300px]" />
                  <div
                    className={`flex flex-col gap-1 items-center justify-center`}
                  >
                    <Text className="font-semibold t-16">No Request data</Text>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {verify && (
        <Verify
          open={verify}
          user={selectedUser}
          onCancel={() => {
            setOpenVerify(false);
            setSelectedUser(null);
          }}
        />
      )}
    </>
  );
}
