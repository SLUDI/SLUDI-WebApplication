import { Button, Input, Spin, Tag, Tooltip, Typography, Select } from "antd";
import MainButton from "../../components/baseComponents/button/MainButton";
import { Edit, Eye, Trash2 } from "lucide-react";
import NoPostImg from "../../assets/images/NoPostImg";
import { useGetAllLicenses } from "../../hooks/licenseIssue";
import { useDispatch } from "react-redux";
import { setLicenseVerificationData } from "../../redux/licenseVerificationSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const { Search } = Input;
const Text = Typography;

const PendingRequest = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState(null);

  const { data: licenseData, isLoading } = useGetAllLicenses();

  const allPosts =
    licenseData?.data?.filter(
      (item) =>
        item.status?.toUpperCase() === "PENDING" ||
        item.status?.toUpperCase() === "FULFILLED"
    ) || [];

  const posts = selectedStatus
    ? allPosts.filter((item) => item.status?.toUpperCase() === selectedStatus)
    : allPosts;

  const getStatusTag = (status) => {
    const statusConfig = {
      PENDING: { color: "gold", text: "PENDING" },
      FULFILLED: { color: "red", text: "FULFILLED" },
    };
    const config = statusConfig[status] || { color: "default", text: status };
    return (
      <Tag
        color={config.color}
        style={{
          minWidth: "90px",
          display: "inline-block",
          textAlign: "center",
        }}
      >
        {config.text}
      </Tag>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  const handleIssueClick = (post) => {
    //console.log("Post data before dispatch:", post);

    const payload = {
      sessionId: post?.sessionId,
      sharedAttributes: post?.sharedAttributes,
      status: post?.status,
      canProceed: true,
      fulfilledAt: post?.fulfilledAt,
      expiresAt: post?.expiresAt,
    };

    //console.log("Payload being dispatched:", payload);

    dispatch(setLicenseVerificationData(payload));

    setTimeout(() => {
      navigate("/licenseIssue", {
        state: {
          sessionId: post?.sessionId,
          sharedAttributes: post?.sharedAttributes,
          status: post?.status,
          canProceed: true,
          fulfilledAt: post?.fulfilledAt,
          expiresAt: post?.expiresAt,
        },
      });
    }, 100);
  };

  return (
    <>
      <div className="p-6 max-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Pending Requests</h1>
        </div>
        <div className="flex flex-row items-center gap-4">
          <div className="w-[25%]">
            <Select
              placeholder="Filter by Status"
              style={{ width: "100%" }}
              size="large"
              allowClear
              onChange={(value) => setSelectedStatus(value)}
              options={[
                { label: "PENDING", value: "PENDING" },
                { label: "FULFILLED", value: "FULFILLED" },
              ]}
            />
          </div>
          <div>
            <div className="text-[#000000] font-bold">
              Total Records : {posts?.length}
            </div>
          </div>
        </div>
        <div className="p-6 max-h-screen">
          <div className="w-full sm:w-full rounded-xl py-8 px-2 ssm:px-3 sm:px-4 lg:px-8 bg-colorSelected gap-4 flex flex-col flex-1 items-center justify-between">
            {!isLoading && (
              <div className="w-full overflow-auto scroll">
                {/* header */}
                {posts?.length > 0 && (
                  <div className="w-full min-w-[700px] grid grid-cols-24 rounded-t-xl">
                    <div className="col-span-4 flex items-center justify-start p-3 h-[40px] rounded-tl-lg">
                      <Tooltip title="Requester ID">
                        <Text className="t-16 font-bold pr-[1px] truncate">
                          Requester ID
                        </Text>
                      </Tooltip>
                    </div>
                    <div className="col-span-4 h-[40px] flex items-center justify-start p-3">
                      <Tooltip title="Citizen Name">
                        <Text className="t-16 font-bold pr-[1px] truncate">
                          Citizen Name
                        </Text>
                      </Tooltip>
                    </div>
                    <div className="col-span-4 h-[40px] flex items-center justify-start p-3">
                      <Tooltip title="NIC">
                        <Text className="t-16 font-bold pr-[1px] truncate">
                          NIC
                        </Text>
                      </Tooltip>
                    </div>
                    <div className="col-span-6 h-[40px] flex items-center justify-start p-3">
                      <Tooltip title="Status">
                        <Text className="t-16 font-bold pr-[1px] truncate">
                          Status
                        </Text>
                      </Tooltip>
                    </div>

                    <div className="col-span-6 h-[40px] flex items-center justify-center p-3 rounded-tr-lg">
                      <Tooltip title="Action">
                        <Text className="t-16 font-bold pr-[1px] truncate">
                          Action
                        </Text>
                      </Tooltip>
                    </div>
                  </div>
                )}

                {/* data */}
                {posts?.length > 0 ? (
                  <div className="w-full min-w-[700px] space-y-2 mt-4">
                    {posts.map((post, index) => {
                      return (
                        <div
                          key={index}
                          className="w-full grid grid-cols-24 pt-1 bg-white rounded-xl"
                        >
                          <div className="col-span-4 flex items-center justify-start p-3 h-[40px]">
                            <Tooltip title={post?.requesterId}>
                              <Text className="t-13 font-bold pr-[1px] truncate text-colorDarkDarkGray">
                                {post?.requesterId}
                              </Text>
                            </Tooltip>
                          </div>
                          <div className="col-span-4 h-[40px] flex items-center justify-start p-3">
                            <Tooltip title={post?.sharedAttributes?.fullName}>
                              <Text className="t-13 font-bold pr-[1px] truncate text-colorDarkDarkGray">
                                {post?.sharedAttributes?.fullName}
                              </Text>
                            </Tooltip>
                          </div>
                          <div className="col-span-4 h-[40px] flex items-center justify-start p-3">
                            <Tooltip title={post?.sharedAttributes?.nic}>
                              <Text className="t-13 font-bold pr-[1px] truncate text-colorDarkDarkGray">
                                {post?.sharedAttributes?.nic}
                              </Text>
                            </Tooltip>
                          </div>
                          <div className="col-span-6 h-[40px] flex items-center justify-start p-3">
                            {getStatusTag(post?.status)}
                          </div>

                          <div className="col-span-6 h-[45px] flex items-center justify-center p-3 rounded-tr-lg gap-4">
                            <MainButton
                              buttonText="Issue"
                              height="30px"
                              width="20%"
                              minWidth="63px"
                              type="primary"
                              color="#ffffff"
                              paddingY="2px"
                              htmlType="button"
                              disabled={post?.status === "PENDING"}
                              onClick={() => handleIssueClick(post)}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="w-full flex flex-col flex-1 items-center justify-center">
                    <NoPostImg className="w-[50%] xl:w-[35%] mb-1 h-[300px]" />
                    <div className="flex flex-col gap-1 items-center justify-center">
                      <Text className="font-semibold t-16">
                        No Request data
                      </Text>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PendingRequest;
