import {
  Button,
  Pagination,
  Spin,
  Tooltip,
  Typography,
  Input,
  Tag,
} from "antd";
import NoPostImg from "../../assets/images/NoPostImg";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import MainButton from "../../components/baseComponents/button/MainButton";
import {
  FiUsers,
  FiUserCheck,
  FiClock,
  FiUserPlus
} from "react-icons/fi";
import {
  HiTrendingUp,
  HiTrendingDown
} from "react-icons/hi";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

import { useIdVerification } from "../../hooks/idCreate";
import dayjs from "dayjs";

const { Search } = Input;
const Text = Typography;

export default function UserMangement() {
  const {
    data: idVerificationData,
    isError,
    error,
    isLoading,
  } = useIdVerification();

  // Calculate statistics for dashboard
  const allUsers = idVerificationData?.data || [];
  const totalUsers = allUsers.length;
  const registeredUsers = allUsers.filter(
    (item) => item.kycStatus?.toUpperCase() === "VERIFIED"
  ).length;
  const pendingIds = allUsers.filter(
    (item) => item.kycStatus?.toUpperCase() === "IN_PROGRESS"
  ).length;
  const applyUsers = allUsers.filter(
    (item) => item.kycStatus?.toUpperCase() === "NOT_STARTED"
  ).length;

  // Extract posts from API response (active users for table)
  const posts =
    idVerificationData?.data?.filter(
      (item) => item.status?.toUpperCase() === "ACTIVE"
    ) || [];

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

  // Statistics card component
  const StatCard = ({ title, value, icon: Icon, gradient, percentage, trend }) => (
    <div
      className={`relative overflow-hidden rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${gradient}`}
      style={{
        background: gradient,
      }}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3  bg-opacity-20 rounded-xl backdrop-blur-sm">
            <Icon className="text-3xl text-white" />
          </div>
          {trend && (
            <div className="flex items-center gap-1 text-white text-sm font-semibold">
              {trend > 0 ? (
                <HiTrendingUp className="text-lg" />
              ) : (
                <HiTrendingDown className="text-lg" />
              )}
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        <div className="text-white">
          <h3 className="text-4xl font-bold mb-2 animate-pulse">{value}</h3>
          <p className="text-sm opacity-90 font-medium">{title}</p>
          {percentage !== undefined && (
            <div className="mt-3 pt-3 border-t border-white border-opacity-20">
              <p className="text-xs opacity-75">
                {percentage.toFixed(1)}% of total users
              </p>
            </div>
          )}
        </div>
      </div>
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-12 -mb-12"></div>
    </div>
  );

  // Chart Data Preparation
  const pieChartData = [
    { name: 'Registered', value: registeredUsers, color: '#f093fb' },
    { name: 'Pending', value: pendingIds, color: '#4facfe' },
    { name: 'Apply', value: applyUsers, color: '#43e97b' },
  ];

  const barChartData = [
    { name: 'Total', value: totalUsers, fill: '#667eea' },
    { name: 'Registered', value: registeredUsers, fill: '#f093fb' },
    { name: 'Pending', value: pendingIds, fill: '#4facfe' },
    { name: 'Apply', value: applyUsers, fill: '#43e97b' },
  ];

  /* Custom Tooltip for Charts */
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-xl shadow-xl border border-gray-100">
          <p className="font-bold text-gray-700">{label || payload[0].name}</p>
          <p className="text-gray-600">
            Count: <span className="font-bold text-gray-800">{payload[0].value}</span>
          </p>
          {payload[0].payload.percent && (
            <p className="text-xs text-gray-500">
              {`(${(payload[0].payload.percent * 100).toFixed(0)}%)`}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2"> Dashboard</h1>
        <p className="text-gray-600">Monitor and manage user registrations and KYC status</p>
      </div>




      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={totalUsers}
            icon={FiUsers}
            gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          />
          <StatCard
            title="Registered Users"
            value={registeredUsers}
            icon={FiUserCheck}
            gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
            percentage={totalUsers > 0 ? (registeredUsers / totalUsers) * 100 : 0}
            trend={12}
          />
          <StatCard
            title="Pending IDs"
            value={pendingIds}
            icon={FiClock}
            gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
            percentage={totalUsers > 0 ? (pendingIds / totalUsers) * 100 : 0}
            trend={-5}
          />
          <StatCard
            title="Apply Users"
            value={applyUsers}
            icon={FiUserPlus}
            gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
            percentage={totalUsers > 0 ? (applyUsers / totalUsers) * 100 : 0}
            trend={8}
          />
        </div>
        {/* Pie Chart - KYC Distribution */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800"></h3>
            <p className="text-sm text-gray-500">Overview of user verification status</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  formatter={(value) => <span className="text-gray-600 font-medium ml-1">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>



      </div>

      {/* User Management Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Registered Users</h2>

        {/* Search and Filter Section */}
        <div className="flex flex-row items-center mb-6 gap-4">
          <div className="w-full md:w-[400px]">
            <Search
              placeholder="Search by ID or Name"
              style={{ maxWidth: "100%" }}
              size="large"
              className="h-10"
              enterButton={
                <button className="bg-[#13A4B4] hover:bg-[#0e8694] text-white px-6 rounded-[0px_10px_10px_0px] h-10 transition-colors duration-200">
                  Search
                </button>
              }
            />
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <span className="text-gray-700 font-semibold">Active Records:</span>
            <span className="text-[#13A4B4] font-bold text-lg">{posts?.length || 0}</span>
          </div>
        </div>

        {/* User Table */}
        <div className="rounded-xl overflow-hidden border border-gray-200">
          {!isLoading && (
            <div className="w-full overflow-auto">
              {/* header */}
              {posts?.length > 0 && (
                <div className="w-full min-w-[700px] grid grid-cols-24 bg-gradient-to-r from-[#13A4B4] to-[#0e8694]">
                  <div className="col-span-4 xl:col-span-4 flex items-center justify-start p-3 h-[45px]">
                    <Tooltip title="User name">
                      <Text className="text-sm font-bold text-white">
                        Name
                      </Text>
                    </Tooltip>
                  </div>
                  <div className="col-span-4 h-[45px] flex items-center justify-start p-3">
                    <Tooltip title="Email address">
                      <Text className="text-sm font-bold text-white">
                        Email
                      </Text>
                    </Tooltip>
                  </div>
                  <div className="col-span-4 h-[45px] flex items-center justify-start p-3">
                    <Tooltip title="Phone number">
                      <Text className="text-sm font-bold text-white">
                        Phone
                      </Text>
                    </Tooltip>
                  </div>
                  <div className="col-span-4 xl:col-span-3 h-[45px] flex items-center justify-start p-3">
                    <Tooltip title="Digital ID">
                      <Text className="text-sm font-bold text-white">
                        DID Number
                      </Text>
                    </Tooltip>
                  </div>
                  <div className="col-span-4 h-[45px] flex items-center justify-center p-3">
                    <Tooltip title="Registration date">
                      <Text className="text-sm font-bold text-white">
                        Submitted
                      </Text>
                    </Tooltip>
                  </div>
                  <div className="col-span-4 h-[45px] flex items-center justify-center p-3">
                    <Tooltip title="Account status">
                      <Text className="text-sm font-bold text-white">
                        Status
                      </Text>
                    </Tooltip>
                  </div>
                </div>
              )}
              {/* data */}
              {posts?.length > 0 ? (
                <div className="w-full min-w-[700px] bg-white">
                  {posts.map((post, index) => {
                    return (
                      <div
                        key={index}
                        className="w-full grid grid-cols-24 border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-all duration-200"
                      >
                        <div className="col-span-4 xl:col-span-4 flex items-center justify-start p-3 h-[50px]">
                          <Tooltip title={post?.fullName}>
                            <Text className="text-sm font-semibold truncate text-gray-700">
                              {post?.fullName}
                            </Text>
                          </Tooltip>
                        </div>
                        <div className="col-span-4 h-[50px] flex items-center justify-start p-3">
                          <Tooltip title={post?.email}>
                            <Text className="text-sm truncate text-gray-600">
                              {post?.email}
                            </Text>
                          </Tooltip>
                        </div>
                        <div className="col-span-4 h-[50px] flex items-center justify-start p-3">
                          <Tooltip title={post?.phone}>
                            <Text className="text-sm truncate text-gray-600">
                              {post?.phone}
                            </Text>
                          </Tooltip>
                        </div>
                        <div className="col-span-4 xl:col-span-3 h-[50px] flex items-center justify-start p-3">
                          <Tooltip title={post?.didId?.split(":")[2]}>
                            <Text className="text-sm font-mono text-gray-700">
                              {post?.didId?.split(":")[2]}
                            </Text>
                          </Tooltip>
                        </div>
                        <div className="col-span-4 h-[50px] flex items-center justify-center p-3">
                          <Tooltip title={post?.createdAt}>
                            <Text className="text-sm truncate text-gray-600">
                              {dayjs(post?.createdAt).format("YYYY-MM-DD")}
                            </Text>
                          </Tooltip>
                        </div>
                        <div className="col-span-4 h-[50px] flex items-center justify-center p-3">
                          {getStatusTag(post?.status)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="w-full flex flex-col items-center justify-center py-16 bg-white">
                  <NoPostImg className="w-[50%] xl:w-[35%] mb-4 h-[300px]" />
                  <div className="flex flex-col gap-2 items-center justify-center">
                    <Text className="font-semibold text-lg text-gray-700">No User Data Available</Text>
                    <Text className="text-sm text-gray-500">There are no registered users to display</Text>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
