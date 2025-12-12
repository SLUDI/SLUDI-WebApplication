import { Button, Input, Modal, Spin, Tag, Tooltip, Typography } from "antd";
import { useState } from "react";
import MainButton from "../../components/baseComponents/button/MainButton";
import { Edit, Eye, MoreVertical, Trash2 } from "lucide-react";

import { UserX, UserCheck, RefreshCw } from "lucide-react";
import Create from "./features/Create";
import {
  useAllOrganization,
  useApproveOrg,
  useReactivateOrg,
  useSuspendOrg,
} from "../../hooks/organization";
import NoPostImg from "../../assets/images/NoPostImg";
import TextArea from "antd/es/input/TextArea";
import OrganizationUser from "../OrganizationUsers/organizationUser";

const { Search } = Input;
const Text = Typography;

const Organization = () => {
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("organizations");

  const {
    data: organizationData,

    isLoading,
  } = useAllOrganization();

  const approveOrg = useApproveOrg();
  const suspendOrg = useSuspendOrg();
  const reactivateOrg = useReactivateOrg();

  const posts = organizationData?.data;

  const filteredPosts = posts?.filter((item) => {
    const search = searchText.toLowerCase();
    return (
      item.name?.toLowerCase().includes(search) ||
      item.orgCode?.toLowerCase().includes(search)
    );
  });

  //console.log(organizationData?.data);

  const [detailsModal, setDetailsModal] = useState({ open: false, user: null });
  const [suspendModal, setSuspendModal] = useState({ open: false, user: null });
  const [approveModal, setApproveModal] = useState({ open: false, user: null });
  const [reactivateModal, setReactivateModal] = useState({
    open: false,
    user: null,
  });

  const [suspensionReason, setSuspensionReason] = useState("");

  const getStatusTag = (status) => {
    const statusConfig = {
      ACTIVE: { color: "green", text: "ACTIVE" },
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

  const getActionButton = (user) => {
    switch (user.status) {
      case "ACTIVE":
        return (
          <Button
            type="text"
            style={{ color: "#f01707" }}
            className="hover:!text-red-600 transition duration-200"
            title="Suspend"
            onClick={() => setSuspendModal({ open: true, user })}
            icon={<UserX size={20} />}
          />
        );
      case "PENDING":
        return (
          <Button
            type="text"
            style={{ color: "#21c465" }}
            className="hover:!text-green-600 transition duration-200"
            title="Approve"
            onClick={() => setApproveModal({ open: true, user })}
            icon={<UserCheck size={20} />}
          />
        );
      case "SUSPENDED":
        return (
          <Button
            type="text"
            style={{ color: "#3907f0" }}
            className="hover:!text-blue-600 transition duration-200"
            title="Reactivate"
            onClick={() => setReactivateModal({ open: true, user })}
            icon={<RefreshCw size={20} />}
          />
        );
      default:
        return null;
    }
  };

  // Handle suspend user
  const handleSuspend = () => {
    if (!suspendModal.user?.id) return;

    suspendOrg.mutate(
      {
        userId: suspendModal.user.id,
        reason: suspensionReason,
      },
      {
        onSuccess: () => {
          console.log("User suspended successfully");
          setSuspendModal({ open: false, user: null });
        },
        onError: (err) => {
          console.error("Suspend failed:", err);
        },
      }
    );
  };

  // Handle approve user
  const handleApprove = () => {
    if (!approveModal.user?.id) return;

    approveOrg.mutate(approveModal.user.id, {
      onSuccess: () => {
        console.log("User approved successfully");
        setApproveModal({ open: false, user: null });
      },
      onError: (err) => {
        console.error("Approve failed:", err);
      },
    });
  };

  // Handle reactivate user
  const handleReactivate = () => {
    if (!reactivateModal.user?.id) return;

    reactivateOrg.mutate(reactivateModal.user.id, {
      onSuccess: () => {
        console.log("User reactivated successfully");
        setReactivateModal({ open: false, user: null });
      },
      onError: (err) => {
        console.error("Reactivate failed:", err);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }
  return (
    <>
      <div className="p-6 max-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Organization Management
          </h1>
          {activeTab === "organizations" && (
            <button
              onClick={() => {
                setOpen(true);
              }}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-md transition duration-200"
            >
              Create Organization
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab("organizations")}
            className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${activeTab === "organizations"
              ? "text-[#13A4B4] border-b-2 border-[#13A4B4]"
              : "text-gray-500 hover:text-gray-700"
              }`}
          >
            Organizations
          </button>
          <button
            onClick={() => setActiveTab("organizationUsers")}
            className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${activeTab === "organizationUsers"
              ? "text-[#13A4B4] border-b-2 border-[#13A4B4]"
              : "text-gray-500 hover:text-gray-700"
              }`}
          >
            Organization Users
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "organizationUsers" ? (
          <OrganizationUser />
        ) : (
          <>
            <div className="flex flex-row items-center ">
              <div className="w-[25%]">
                <Search
                  placeholder="Search by code or Name"
                  style={{ maxWidth: "100%" }}
                  size="large"
                  className="mb-2 h-10"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  enterButton={
                    <button className="bg-[#13A4B4] hover:bg-[#7c9ece] text-white px-4 rounded-[0px_10px_10px_0px] h-10">
                      Search
                    </button>
                  }
                />
              </div>
              <div>
                <div className="mt-[-8px] ml-4 text-[#000000] font-bold">
                  Total Records :{posts?.length}
                </div>
              </div>
            </div>
            <div className="p-6  max-h-screen">
              <div className="w-full  sm:w-full  rounded-xl py-8 px-2 ssm:px-3 sm:px-4 lg:px-8  bg-colorSelected gap-4 flex flex-col flex-1 items-center justify-between">
                {!isLoading && (
                  <div className="w-full overflow-auto scroll">
                    {/* Header */}
                    {filteredPosts?.length > 0 && (
                      <div className="w-full min-w-[900px] grid grid-cols-28 rounded-t-xl bg-[#F1F5F9]">
                        <div className="col-span-4 flex items-center justify-start p-3 h-[40px] rounded-tl-lg">
                          <Text className="t-16 font-bold pr-[1px] truncate">
                            OrgCode
                          </Text>
                        </div>
                        <div className="col-span-3 h-[40px] flex items-center justify-start p-3">
                          <Text className="t-16 font-bold pr-[1px] truncate">
                            Name
                          </Text>
                        </div>
                        <div className="col-span-4 h-[40px] flex items-center justify-start p-3">
                          <Text className="t-16 font-bold pr-[1px] truncate">
                            OrgType
                          </Text>
                        </div>
                        <div className="col-span-3 h-[40px] flex items-center justify-start p-3">
                          <Text className="t-16 font-bold pr-[1px] truncate">
                            TemplateName
                          </Text>
                        </div>
                        <div className="col-span-3 h-[40px] flex items-center justify-start p-3">
                          <Text className="t-16 font-bold pr-[1px] truncate">
                            TemplateId
                          </Text>
                        </div>
                        <div className="col-span-3 h-[40px] flex items-center justify-start p-3">
                          <Text className="t-16 font-bold pr-[1px] truncate">
                            Status
                          </Text>
                        </div>
                        <div className="col-span-8 h-[40px] flex items-center justify-center p-3 rounded-tr-lg">
                          <Text className="t-16 font-bold pr-[1px] truncate">
                            Actions
                          </Text>
                        </div>
                      </div>
                    )}

                    {/* Data Rows */}
                    {filteredPosts?.length > 0 ? (
                      <div className="w-full min-w-[900px] space-y-2 mt-4">
                        {filteredPosts.map((user) => (
                          <div
                            key={user.userId}
                            className="w-full grid grid-cols-28 pt-1 border-3 bg-white border-b-[#F1F5F9] p-2 rounded-xl"
                          >
                            <div className="col-span-4 flex items-center justify-start p-3 h-[40px]">
                              <Tooltip title={user.orgCode}>
                                <Text className="t-13 font-bold pr-[1px] truncate text-colorDarkDarkGray">
                                  {user.orgCode}
                                </Text>
                              </Tooltip>
                            </div>
                            <div className="col-span-3 h-[40px] flex items-center justify-start p-3">
                              <Tooltip title={user.name}>
                                <Text className="t-13 font-bold pr-[1px] truncate text-colorDarkDarkGray">
                                  {user.name}
                                </Text>
                              </Tooltip>
                            </div>
                            <div className="col-span-4 h-[40px] flex items-center justify-start p-3">
                              <Tooltip title={user.orgType}>
                                <Text className="t-13 font-bold pr-[1px] truncate text-colorDarkDarkGray">
                                  {user.orgType}
                                </Text>
                              </Tooltip>
                            </div>
                            <div className="col-span-3 h-[40px] flex items-center justify-start p-3">
                              <Tooltip title={user.templateName}>
                                <Text className="t-13 font-bold pr-[1px] truncate text-colorDarkDarkGray">
                                  {user.templateName}
                                </Text>
                              </Tooltip>
                            </div>
                            <div className="col-span-3 h-[40px] flex items-center justify-start p-3">
                              <Tooltip title={user?.templateId}>
                                <Text className="t-13 font-bold pr-[1px] truncate text-colorDarkDarkGray">
                                  {user?.templateId}
                                </Text>
                              </Tooltip>
                            </div>
                            <div className="col-span-3 h-[40px]  flex items-center justify-start p-3">
                              {getStatusTag(user.status)}
                            </div>
                            <div className="col-span-8 h-[45px] flex items-center justify-center p-3 rounded-tr-lg gap-3">
                              {getActionButton(user)}
                              <Button
                                className="text-gray-700 hover:text-cyan-600 transition duration-200"
                                title="View Details"
                                onClick={() =>
                                  setDetailsModal({ open: true, user })
                                }
                              >
                                <MoreVertical size={20} />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="w-full flex flex-col flex-1 items-center justify-center">
                        <div className="flex flex-col gap-1 items-center justify-center">
                          <Text className="font-semibold t-16">No User Data</Text>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      {open && (
        <Create
          open={open}
          onCancel={() => {
            setOpen(false);
          }}
        />
      )}

      {/* User Details Modal */}
      <Modal
        title="User Details"
        open={detailsModal.open}
        onCancel={() => setDetailsModal({ open: false, user: null })}
        footer={[
          <Button
            key="close"
            onClick={() => setDetailsModal({ open: false, user: null })}
          >
            Close
          </Button>,
        ]}
        width={600}
      >
        {detailsModal.user && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-sm">TemplateName</p>
                <p className="font-semibold">
                  {detailsModal.user.templateName}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">TemplateId</p>
                <p className="font-semibold">{detailsModal.user.templateId}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Email</p>
                <p className="font-semibold">
                  {detailsModal.user.contactEmail}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Phone</p>
                <p className="font-semibold">
                  {detailsModal.user.contactPhone}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Address</p>
                <p className="font-semibold">{detailsModal.user.address}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">City</p>
                <p className="font-semibold">{detailsModal.user.city}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">PostalCode</p>
                <p className="font-semibold">{detailsModal.user.postalCode}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Status</p>
                <div className="mt-1">
                  {getStatusTag(detailsModal.user.status)}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Suspend User Modal */}
      <Modal
        title="Suspend Organization"
        open={suspendModal.open}
        onCancel={() => {
          setSuspendModal({ open: false, user: null });
          setSuspensionReason("");
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setSuspendModal({ open: false, user: null });
              setSuspensionReason("");
            }}
          >
            Cancel
          </Button>,
          <Button key="suspend" type="primary" danger onClick={handleSuspend}>
            Suspend Organization
          </Button>,
        ]}
      >
        {suspendModal.user && (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 p-3 rounded">
              <p className="text-red-800">
                You are about to suspend this organization. They will lose
                access to the system.
              </p>
            </div>
            <div>
              <p className="font-semibold">
                Organization: {suspendModal.user.name}
              </p>
            </div>
            <div>
              <label className="block mb-2 font-semibold">
                Reason for Suspension
              </label>
              <TextArea
                rows={4}
                value={suspensionReason}
                onChange={(e) => setSuspensionReason(e.target.value)}
                placeholder="Enter reason for suspension..."
              />
            </div>
          </div>
        )}
      </Modal>

      {/* Approve User Modal */}
      <Modal
        title="Approve Organization"
        open={approveModal.open}
        onCancel={() => setApproveModal({ open: false, user: null })}
        footer={[
          <Button
            key="cancel"
            onClick={() => setApproveModal({ open: false, user: null })}
          >
            Cancel
          </Button>,
          <Button key="approve" type="primary" onClick={handleApprove}>
            Approve Organization
          </Button>,
        ]}
      >
        {approveModal.user && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 p-3 rounded">
              <p className="text-green-800">
                You are about to approve this organization. They will receive an
                activation email and be enrolled on the blockchain.
              </p>
            </div>
            <div>
              <p>
                <span className="font-semibold">Name:</span>{" "}
                {approveModal.user.name}
              </p>
              <p>
                <span className="font-semibold">Email:</span>{" "}
                {approveModal.user.contactEmail}
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* Reactivate User Modal */}
      <Modal
        title="Reactivate Organization"
        open={reactivateModal.open}
        onCancel={() => setReactivateModal({ open: false, user: null })}
        footer={[
          <Button
            key="cancel"
            onClick={() => setReactivateModal({ open: false, user: null })}
          >
            Cancel
          </Button>,
          <Button key="reactivate" type="primary" onClick={handleReactivate}>
            Reactivate Organization
          </Button>,
        ]}
      >
        {reactivateModal.user && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 p-3 rounded">
              <p className="text-blue-800">
                You are about to reactivate this organization. They will regain
                access to the system.
              </p>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};
export default Organization;
