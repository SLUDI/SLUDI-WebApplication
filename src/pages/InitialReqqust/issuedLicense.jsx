import { Button, Input, Tooltip, Typography, Modal, Tag, Select } from "antd";
import { useState } from "react";
import MainButton from "../../components/baseComponents/button/MainButton";
import {
  Edit,
  Eye,
  Trash2,
  UserX,
  UserCheck,
  RefreshCw,
  MoreVertical,
} from "lucide-react";

import {
  useAllOrganizationUsers,
  useApproveUser,
  useOrganizationCount,
  useReactivateUser,
  useSuspendUser,
} from "../../hooks/organizationUser";
import { useSelector } from "react-redux";
import NoPostImg from "../../assets/images/NoPostImg";
import { useGetAllLicenses } from "../../hooks/licenseIssue";
import ViewTemplate from "./features/ViewTemplate";

const { Search } = Input;
const { TextArea } = Input;
const Text = Typography;
const { Option } = Select;

const IssuedLicense = () => {
  const [open, setOpen] = useState(false);
  const [detailsModal, setDetailsModal] = useState({ open: false, user: null });
  const organizationId = useSelector((state) => state.auth.organizationId);

  const [viewOpen, setViewOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const [filterStatus, setFilterStatus] = useState("NOT_FILTER");

  const { data: userData, isLoading } = useAllOrganizationUsers(
    organizationId,
    filterStatus
  );

  const { data: userCount } = useOrganizationCount(organizationId);

  const { data: licenseData, isLoading: isLicenseLoading } =
    useGetAllLicenses();

  const posts =
    licenseData?.data?.filter(
      (item) => item.status?.toUpperCase() === "COMPLETED"
    ) || [];

  console.log(userData); // Now correct!

  // Use mock data if API data is not available, otherwise use API data
  const count = userCount?.data;
  const users = userData?.data || [];

  // Status rendering with colors
  const getStatusTag = (status) => {
    const statusConfig = {
      COMPLETED: { color: "green", text: "COMPLETED" },
      PENDING: { color: "gold", text: "PENDING" },
      SUSPENDED: { color: "red", text: "SUSPENDED" },
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

  return (
    <>
      <div className="p-6 max-h-screen">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="rounded-xl sm:rounded-2xl bg-white border border-l-blue-600 border-4 p-4 sm:p-6 shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium opacity-90 text-black">
                  Active Requests
                </p>
                <p className="mt-2 text-3xl sm:text-4xl font-bold text-black">
                  4
                </p>
              </div>
              <div className="text-3xl sm:text-4xl opacity-80 text-blue-700">
                👥
              </div>
            </div>
          </div>

          <div className="rounded-xl sm:rounded-2xl bg-white border border-l-green-500 border-4 p-4 sm:p-6 shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium opacity-90 text-black">
                  Licenses Issued
                </p>
                <p className="mt-2 text-3xl sm:text-4xl font-bold text-black">
                  5
                </p>
              </div>
              <div className="text-3xl sm:text-4xl opacity-80 text-green-500">
                ✓
              </div>
            </div>
          </div>

          <div className="rounded-xl sm:rounded-2xl bg-white border border-l-yellow-500 border-4 p-4 sm:p-6 shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium opacity-90 text-black">
                  Pending Verification
                </p>
                <p className="mt-2 text-3xl sm:text-4xl font-bold text-black">
                  2
                </p>
              </div>
              <div className="text-3xl sm:text-4xl opacity-80">⏳</div>
            </div>
          </div>

          <div className="rounded-xl sm:rounded-2xl bg-white border border-l-red-500 border-4 p-4 sm:p-6 shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium opacity-90 text-black">
                  Expiring Soon
                </p>
                <p className="mt-2 text-3xl sm:text-4xl font-bold text-black">
                  2
                </p>
              </div>
              <div className="text-3xl sm:text-4xl opacity-80">🚫</div>
            </div>
          </div>
        </div>

        <div className="flex items-center mb-6 mt-10">
          <h1 className="text-3xl font-bold text-gray-900">Issued Licenses</h1>
        </div>

        <div className="bg-white w-full mt-10">
          <div className="max-h-screen">
            <div className="w-full sm:w-full rounded-xl py-8 px-2 ssm:px-3 sm:px-4 lg:px-8 bg-colorSelected gap-4 flex flex-col flex-1 items-center justify-between">
              {!isLicenseLoading && (
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
                              <Button
                                className="text-gray-700 hover:text-cyan-600 transition duration-200"
                                title="View"
                                onClick={() => {
                                  setSelectedTemplate(post);
                                  setViewOpen(true);
                                }}
                              >
                                <Eye size={20} />
                              </Button>
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
      </div>

      {viewOpen && (
        <ViewTemplate
          open={viewOpen}
          data={selectedTemplate}
          onCancel={() => {
            setViewOpen(false);
            setSelectedTemplate(null);
          }}
        />
      )}
    </>
  );
};

export default IssuedLicense;
