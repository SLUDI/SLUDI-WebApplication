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
import Create from "./features/Create";
import { useAllOrganization } from "../../hooks/organization";
import {
  useAllOrganizationUsers,
  useApproveUser,
  useOrganizationCount,
  useReactivateUser,
  useSuspendUser,
} from "../../hooks/organizationUser";
import { useSelector } from "react-redux";

const { Search } = Input;
const { TextArea } = Input;
const Text = Typography;
const { Option } = Select;

const OrganizationManagement = () => {
  const [open, setOpen] = useState(false);
  const [detailsModal, setDetailsModal] = useState({ open: false, user: null });
  const [suspendModal, setSuspendModal] = useState({ open: false, user: null });
  const [approveModal, setApproveModal] = useState({ open: false, user: null });
  const [reactivateModal, setReactivateModal] = useState({
    open: false,
    user: null,
  });
  const [suspensionReason, setSuspensionReason] = useState("");
  const organizationId = useSelector((state) => state.auth.organizationId);

  const [filterStatus, setFilterStatus] = useState("NOT_FILTER");

  const { data: userData, isLoading } = useAllOrganizationUsers(
    organizationId,
    filterStatus
  );

  const { data: userCount } = useOrganizationCount(organizationId);

  const approveUser = useApproveUser();
  const suspendUser = useSuspendUser();
  const reactivateUser = useReactivateUser();

  console.log(userData); // Now correct!

  // Use mock data if API data is not available, otherwise use API data
  const count = userCount?.data;
  const users = userData?.data || [];

  // Status rendering with colors
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

  // Get action button based on status
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
    if (!suspendModal.user?.userId) return;

    suspendUser.mutate(
      {
        userId: suspendModal.user.userId,
        reason: suspensionReason,
      },
      {
        onSuccess: () => {
          console.log("User suspended successfully");
          setSuspendModal({ open: false, user: null });
          setSuspensionReason("");
        },
        onError: (err) => {
          console.error("Suspend failed:", err);
        },
      }
    );
  };

  // Handle approve user
  const handleApprove = () => {
    if (!approveModal.user?.userId) return;

    approveUser.mutate(approveModal.user.userId, {
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
    if (!reactivateModal.user?.userId) return;

    reactivateUser.mutate(reactivateModal.user.userId, {
      onSuccess: () => {
        console.log("User reactivated successfully");
        setReactivateModal({ open: false, user: null });
      },
      onError: (err) => {
        console.error("Reactivate failed:", err);
      },
    });
  };

  return (
    <>
      <div className="p-6 max-h-screen">
        <div className="flex items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Organization User Management
          </h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="rounded-xl sm:rounded-2xl bg-white border border-l-blue-600 border-4 p-4 sm:p-6 shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium opacity-90 text-black">
                  Total Users
                </p>
                <p className="mt-2 text-3xl sm:text-4xl font-bold text-black">
                  {count?.totalUsers}
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
                  Active
                </p>
                <p className="mt-2 text-3xl sm:text-4xl font-bold text-black">
                  {count?.activeUsers}
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
                  Pending
                </p>
                <p className="mt-2 text-3xl sm:text-4xl font-bold text-black">
                  {count?.pendingUsers}
                </p>
              </div>
              <div className="text-3xl sm:text-4xl opacity-80">⏳</div>
            </div>
          </div>

          <div className="rounded-xl sm:rounded-2xl bg-white border border-l-red-500 border-4 p-4 sm:p-6 shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium opacity-90 text-black">
                  Suspended
                </p>
                <p className="mt-2 text-3xl sm:text-4xl font-bold text-black">
                  {count?.suspendedUsers}
                </p>
              </div>
              <div className="text-3xl sm:text-4xl opacity-80">🚫</div>
            </div>
          </div>
        </div>

        <div className="bg-white w-full">
          <div className="flex flex-row items-center space-x-10 mt-10 px-8 py-8">
            {/* Filter Dropdown */}
            <div className="w-[25%]">
              <Select
                size="large"
                value={filterStatus}
                onChange={(value) => setFilterStatus(value)}
                className="w-full"
                allowClear
                placeholder="Filter by Status"
              >
                <Option value="NOT_FILTER">All Users</Option>
                <Option value="ACTIVE">Active</Option>
                <Option value="PENDING">Pending</Option>
                <Option value="DEACTIVATED">Deactivated</Option>
                <Option value="INACTIVE">Inactive</Option>
                <Option value="SUSPENDED">Suspended</Option>
              </Select>
            </div>

            {/* Create Organization Button */}
            <div>
              <button
                onClick={() => setOpen(true)}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-md transition h-10"
              >
                Create Organization
              </button>
            </div>
          </div>

          <div className="max-h-screen">
            <div className="w-full sm:w-full rounded-xl py-8 px-2 sm:px-4 lg:px-8 bg-colorSelected gap-4 flex flex-col flex-1 items-center justify-between">
              {!isLoading && (
                <div className="w-full overflow-auto scroll">
                  {/* Header */}
                  {users?.length > 0 && (
                    <div className="w-full min-w-[900px] grid grid-cols-28 rounded-t-xl bg-[#F1F5F9]">
                      <div className="col-span-4 flex items-center justify-start p-3 h-[40px] rounded-tl-lg">
                        <Text className="t-16 font-bold pr-[1px] truncate">
                          User
                        </Text>
                      </div>
                      <div className="col-span-3 h-[40px] flex items-center justify-start p-3">
                        <Text className="t-16 font-bold pr-[1px] truncate">
                          Employee ID
                        </Text>
                      </div>
                      <div className="col-span-4 h-[40px] flex items-center justify-start p-3">
                        <Text className="t-16 font-bold pr-[1px] truncate">
                          Department
                        </Text>
                      </div>
                      <div className="col-span-3 h-[40px] flex items-center justify-start p-3">
                        <Text className="t-16 font-bold pr-[1px] truncate">
                          Role
                        </Text>
                      </div>
                      <div className="col-span-3 h-[40px] flex items-center justify-start p-3">
                        <Text className="t-16 font-bold pr-[1px] truncate">
                          Blockchain
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
                  {users?.length > 0 ? (
                    <div className="w-full min-w-[900px] space-y-2 mt-4">
                      {users.map((user) => (
                        <div
                          key={user.userId}
                          className="w-full grid grid-cols-28 pt-1 border-3 border-b-[#F1F5F9] p-2 rounded-xl"
                        >
                          <div className="col-span-4 flex items-center justify-start p-3 h-[40px]">
                            <Tooltip
                              title={`${user.firstName} ${user.lastName}`}
                            >
                              <Text className="t-13 font-bold pr-[1px] truncate text-colorDarkDarkGray">
                                {user.firstName} {user.lastName}
                              </Text>
                            </Tooltip>
                          </div>
                          <div className="col-span-3 h-[40px] flex items-center justify-start p-3">
                            <Tooltip title={user.employeeId}>
                              <Text className="t-13 font-bold pr-[1px] truncate text-colorDarkDarkGray">
                                {user.employeeId}
                              </Text>
                            </Tooltip>
                          </div>
                          <div className="col-span-4 h-[40px] flex items-center justify-start p-3">
                            <Tooltip title={user.department}>
                              <Text className="t-13 font-bold pr-[1px] truncate text-colorDarkDarkGray">
                                {user.department}
                              </Text>
                            </Tooltip>
                          </div>
                          <div className="col-span-3 h-[40px] flex items-center justify-start p-3">
                            <Tooltip title={user.roleCode}>
                              <Text className="t-13 font-bold pr-[1px] truncate text-colorDarkDarkGray">
                                {user.roleCode}
                              </Text>
                            </Tooltip>
                          </div>
                          <div className="col-span-3 h-[40px] flex items-center justify-start p-3">
                            {user.isEnrolledOnBlockchain ? (
                              <Tag
                                color="green"
                                style={{
                                  minWidth: "90px",
                                  display: "inline-block",
                                  textAlign: "center",
                                }}
                              >
                                Enrolled
                              </Tag>
                            ) : (
                              <Tag
                                color="red"
                                style={{
                                  minWidth: "90px",
                                  display: "inline-block",
                                  textAlign: "center",
                                }}
                              >
                                Not Enrolled
                              </Tag>
                            )}
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
        </div>
      </div>

      {/* Create Organization Modal */}
      {open && <Create open={open} onCancel={() => setOpen(false)} />}

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
                <p className="text-gray-500 text-sm">Employee ID</p>
                <p className="font-semibold">{detailsModal.user.employeeId}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Username</p>
                <p className="font-semibold">{detailsModal.user.username}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Email</p>
                <p className="font-semibold">{detailsModal.user.email}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Phone</p>
                <p className="font-semibold">{detailsModal.user.phone}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Department</p>
                <p className="font-semibold">{detailsModal.user.department}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Designation</p>
                <p className="font-semibold">{detailsModal.user.designation}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Role</p>
                <p className="font-semibold">{detailsModal.user.roleCode}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Status</p>
                <div className="mt-1">
                  {getStatusTag(detailsModal.user.status)}
                </div>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Fabric User ID</p>
                <p className="font-semibold">
                  {detailsModal.user.fabricUserId}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Suspend User Modal */}
      <Modal
        title="Suspend User"
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
            Suspend User
          </Button>,
        ]}
      >
        {suspendModal.user && (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 p-3 rounded">
              <p className="text-red-800">
                You are about to suspend this user. They will lose access to the
                system.
              </p>
            </div>
            <div>
              <p className="font-semibold">
                User: {suspendModal.user.firstName} {suspendModal.user.lastName}
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
        title="Approve User"
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
            Approve User
          </Button>,
        ]}
      >
        {approveModal.user && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 p-3 rounded">
              <p className="text-green-800">
                You are about to approve this user. They will receive an
                activation email and be enrolled on the blockchain.
              </p>
            </div>
            <div>
              <p>
                <span className="font-semibold">Name:</span>{" "}
                {approveModal.user.firstName} {approveModal.user.lastName}
              </p>
              <p>
                <span className="font-semibold">Email:</span>{" "}
                {approveModal.user.email}
              </p>
              <p>
                <span className="font-semibold">Role:</span>{" "}
                {approveModal.user.roleCode}
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* Reactivate User Modal */}
      <Modal
        title="Reactivate User"
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
            Reactivate User
          </Button>,
        ]}
      >
        {reactivateModal.user && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 p-3 rounded">
              <p className="text-blue-800">
                You are about to reactivate this user. They will regain access
                to the system.
              </p>
            </div>
            <div>
              <p>
                <span className="font-semibold">User:</span>{" "}
                {reactivateModal.user.firstName} {reactivateModal.user.lastName}
              </p>
              {reactivateModal.user.suspendedAt && (
                <p>
                  <span className="font-semibold">Suspended Since:</span>{" "}
                  {new Date(reactivateModal.user.suspendedAt).toLocaleString()}
                </p>
              )}
              {reactivateModal.user.suspensionReason && (
                <p>
                  <span className="font-semibold">Reason:</span>{" "}
                  {reactivateModal.user.suspensionReason}
                </p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default OrganizationManagement;
