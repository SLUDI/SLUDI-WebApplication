import React, { useState } from "react";
import {
  User,
  UserPlus,
  Settings,
  LogOut,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Mail,
  Building,
  Key,
  Copy,
  CheckCircle,
  AlertCircle,
  Users,
  Shield,
  Menu,
  X,
} from "lucide-react";
import { Modal, Form, Input, Select, Button, Alert } from "antd";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    userId: "",
    workplace: "",
    role: "user",
  });
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Kamal Perera",
      email: "kamal.perera@gov.lk",
      userId: "USR001",
      workplace: "Ministry of Digital Technology",
      role: "user",
      status: "active",
      createdDate: "2024-01-15",
      lastLogin: "2024-12-08",
    },
    {
      id: 2,
      name: "Nimal Silva",
      email: "nimal.silva@health.gov.lk",
      userId: "USR002",
      workplace: "Ministry of Health",
      role: "user",
      status: "active",
      createdDate: "2024-01-20",
      lastLogin: "2024-12-07",
    },
    {
      id: 3,
      name: "Sunitha Kumari",
      email: "sunitha.kumari@education.gov.lk",
      userId: "USR003",
      workplace: "Ministry of Education",
      role: "user",
      status: "inactive",
      createdDate: "2024-02-01",
      lastLogin: "2024-11-25",
    },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [form] = Form.useForm();
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();

  // Handle user creation
  const handleCreateUser = () => {
    if (
      !newUser.name ||
      !newUser.email ||
      !newUser.userId ||
      !newUser.workplace
    ) {
      alert("Please fill in all required fields");
      return;
    }

    //const password = generatePassword();
    //setGeneratedPassword(password);

    const user = {
      id: users.length + 1,
      ...newUser,
      status: "active",
      createdDate: new Date().toISOString().split("T")[0],
      lastLogin: "Never",
      //password: password,
    };

    setUsers([...users, user]);
    setShowCreateUser(false);
    setShowPasswordModal(true);

    // Reset form
    setNewUser({
      name: "",
      email: "",
      userId: "",
      workplace: "",
      role: "user",
    });
  };

  // Handle user deletion
  const handleDeleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  // Filter users based on search and status
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const Sidebar = () => (
    <div
      className={`bg-background text-white transition-all duration-300 ${
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      } fixed lg:relative lg:translate-x-0 z-30 w-64 h-full`}
    >
      <div className="p-6">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-3 justify-center">
            <div>
              <h1 className="t-20 font-bold text-primary">SLUID</h1>
              <p className="t-13 text-gray-300">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <nav className="mt-8">
        <div className="px-6">
          <button
            onClick={() => setActiveTab("users")}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all ${
              activeTab === "users"
                ? "bg-primary text-white"
                : "text-gray-300 hover:bg-gray-700"
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="t-16">User Management</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all mt-2 ${
              activeTab === "settings"
                ? "bg-primary text-white"
                : "text-gray-300 hover:bg-gray-700"
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="t-16">Settings</span>
          </button>
        </div>

        <div className="mt-8 px-6">
          <div className="border-t border-gray-700 pt-6">
            <button
              className="w-full flex items-center space-x-3 p-3 text-gray-300 hover:bg-gray-700 rounded-lg transition-all"
              onClick={() => {
                navigate("/sign-in");
              }}
            >
              <LogOut className="w-5 h-5" />
              <span className="t-16">Logout</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );

  const CreateUserModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="t-23 font-bold text-gray-900">Create New User</h2>
            <button
              onClick={() => setShowCreateUser(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-8 ">
          <Form form={form} layout="vertical">
            <Form.Item
              label="Full Name"
              name="name"
              rules={[{ required: true, message: "Please enter full name" }]}
            >
              <Input placeholder="Enter full name" />
            </Form.Item>

            <Form.Item
              label="User ID"
              name="userId"
              rules={[{ required: true, message: "Please enter user ID" }]}
            >
              <Input
                placeholder="Enter user ID"
                onChange={(e) => setUserId(e.target.value)}
              />
            </Form.Item>

            <Form.Item label="Password">
              <Input value={userId} disabled placeholder="Enter password" />
            </Form.Item>

            <Form.Item
              label="Email Address"
              name="email"
              rules={[
                { required: true, message: "Please enter email address" },
                { type: "email", message: "Invalid email format" },
              ]}
            >
              <Input placeholder="Enter email address" />
            </Form.Item>

            <Form.Item
              label="Workplace"
              name="workplace"
              rules={[{ required: true, message: "Please enter workplace" }]}
            >
              <Input placeholder="Enter workplace/organization" />
            </Form.Item>

            <Form.Item label="Role" name="role" initialValue="user">
              <Select>
                <Option value="user">Standard User</Option>
                <Option value="admin">Administrator</Option>
                <Option value="supervisor">Supervisor</Option>
              </Select>
            </Form.Item>
          </Form>
        </div>

        <div className="p-6 border-t border-gray-200">
          <div className="flex space-x-4">
            <button
              onClick={() => setShowCreateUser(false)}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium t-16"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateUser}
              className="flex-1 bg-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition font-medium t-16"
            >
              Create User
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-mona-sans">
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      <div className="flex h-screen">
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Header */}
          <header className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <h1 className="t-23 font-bold text-gray-900">
                  User Management
                </h1>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="t-14 text-gray-700">Administrator</span>
                </div>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <main className="flex-1 overflow-y-auto p-6">
            {activeTab === "users" && (
              <div>
                {/* Action Bar */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
                      <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          placeholder="Search users..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent t-16 text-black"
                        />
                      </div>

                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent t-16 text-black"
                      >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={() => setShowCreateUser(true)}
                        className="flex items-center space-x-2 bg-primary text-white px-4 py-3 rounded-lg hover:bg-opacity-90 transition t-16 font-medium"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>Create User</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left t-16 font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-4 text-left t-16 font-medium text-gray-500 uppercase tracking-wider">
                            User ID
                          </th>
                          <th className="px-6 py-4 text-left t-16 font-medium text-gray-500 uppercase tracking-wider">
                            Workplace
                          </th>
                          <th className="px-6 py-4 text-left t-16 font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-4 text-left t-16 font-medium text-gray-500 uppercase tracking-wider">
                            Last Login
                          </th>
                          <th className="px-6 py-4 text-right t-16 font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.map((user) => (
                          <tr
                            key={user.id}
                            className="hover:bg-gray-50 transition"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center">
                                  <span className="t-16 font-medium">
                                    {user.name.charAt(0)}
                                  </span>
                                </div>
                                <div>
                                  <div className="t-16 font-medium text-gray-900">
                                    {user.name}
                                  </div>
                                  <div className="t-14 text-gray-500">
                                    {user.email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap t-16 text-gray-900 font-mono">
                              {user.userId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap t-16 text-gray-500">
                              {user.workplace}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-2 py-1 t-14 font-medium rounded-full ${
                                  user.status === "active"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {user.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap t-16 text-gray-500">
                              {user.lastLogin}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <button
                                  className="p-2 text-gray-400 hover:text-blue-600 transition"
                                  title="View"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  className="p-2 text-gray-400 hover:text-green-600 transition"
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="p-2 text-gray-400 hover:text-red-600 transition"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {filteredUsers.length === 0 && (
                    <div className="text-center py-12">
                      <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="t-16 text-gray-500">No users found</p>
                    </div>
                  )}
                </div>

                {/* Statistics */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="t-16 text-gray-500">Total Users</p>
                        <p className="t-36 font-bold text-gray-900">
                          {users.length}
                        </p>
                      </div>
                      <Users className="w-8 h-8 text-primary" />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="t-16 text-gray-500">Active Users</p>
                        <p className="t-36 font-bold text-green-600">
                          {users.filter((u) => u.status === "active").length}
                        </p>
                      </div>
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="t-16 text-gray-500">Inactive Users</p>
                        <p className="t-36 font-bold text-red-600">
                          {users.filter((u) => u.status === "inactive").length}
                        </p>
                      </div>
                      <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="t-23 font-bold text-gray-900 mb-4">
                  System Settings
                </h2>
                <p className="t-16 text-gray-600">
                  Settings panel will be implemented here.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Modals */}
      {showCreateUser && <CreateUserModal />}
      {showPasswordModal && <PasswordModal />}
    </div>
  );
};

export default AdminPanel;
