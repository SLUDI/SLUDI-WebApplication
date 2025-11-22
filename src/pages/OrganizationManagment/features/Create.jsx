import { Modal, Form, Input, Select, Button, message } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import {
  useOrganizationRoles,
  useOrganizationUserCreate,
} from "../../../hooks/organizationUser";

export default function Create({ open, onCancel }) {
  const [form] = Form.useForm();
  const { mutate, isPending } = useOrganizationUserCreate();
  const organizationId = useSelector((state) => state.auth.organizationId);

  // Fetch roles for the organization
  const { data: rolesData, isLoading: isLoadingRoles } =
    useOrganizationRoles(organizationId);

  const handleSubmit = (values) => {
    console.log("Form values:", values);

    // Prepare data with organizationId
    const payload = {
      ...values,
      organizationId: organizationId,
    };

    // Call API
    mutate(payload, {
      onSuccess: () => {
        message.success("User created successfully!");
        form.resetFields();
        onCancel();
      },
      onError: (error) => {
        console.error("Error creating user:", error);
        message.error(
          error?.response?.data?.message || "Failed to create user"
        );
      },
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  // Prepare role options from API response
  const roleOptions =
    rolesData?.data?.map((role) => ({
      value: role.id,
      label: `${role.roleCode} - ${role.description.split(" - ")[0]}`,
    })) || [];

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      className="flex flex-col rounded-md"
      width={900}
      footer={null}
      destroyOnClose={true}
      maskClosable={false}
      centered={true}
    >
      <div className="p-4">
        <h2 className="text-2xl font-semibold mb-6">Create User</h2>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="space-y-2"
        >
          <div className="grid grid-cols-2 gap-x-6">
            {/* Email */}
            <Form.Item
              name="email"
              label={
                <span className="text-sm font-medium text-gray-700">
                  Email Address
                </span>
              }
              rules={[
                { required: true, message: "Please enter email address" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input
                placeholder="Enter email address"
                size="large"
                type="email"
              />
            </Form.Item>

            {/* Username */}
            <Form.Item
              name="username"
              label={
                <span className="text-sm font-medium text-gray-700">
                  Username
                </span>
              }
              rules={[{ required: true, message: "Please enter username" }]}
            >
              <Input placeholder="Enter username" size="large" />
            </Form.Item>

            {/* First Name */}
            <Form.Item
              name="firstName"
              label={
                <span className="text-sm font-medium text-gray-700">
                  First Name
                </span>
              }
              rules={[{ required: true, message: "Please enter first name" }]}
            >
              <Input placeholder="Enter first name" size="large" />
            </Form.Item>

            {/* Last Name */}
            <Form.Item
              name="lastName"
              label={
                <span className="text-sm font-medium text-gray-700">
                  Last Name
                </span>
              }
              rules={[{ required: true, message: "Please enter last name" }]}
            >
              <Input placeholder="Enter last name" size="large" />
            </Form.Item>

            {/* Phone */}
            <Form.Item
              name="phone"
              label={
                <span className="text-sm font-medium text-gray-700">
                  Phone Number
                </span>
              }
              rules={[{ required: true, message: "Please enter phone number" }]}
            >
              <Input placeholder="Enter phone number" size="large" />
            </Form.Item>

            {/* Role ID */}
            <Form.Item
              name="roleId"
              label={
                <span className="text-sm font-medium text-gray-700">Role</span>
              }
              rules={[{ required: true, message: "Please select role" }]}
            >
              <Select
                placeholder="Select role"
                size="large"
                options={roleOptions}
                loading={isLoadingRoles}
              />
            </Form.Item>

            {/* Password */}
            <Form.Item
              name="password"
              label={
                <span className="text-sm font-medium text-gray-700">
                  Password
                </span>
              }
              rules={[
                { required: true, message: "Please enter password" },
                { min: 8, message: "Password must be at least 8 characters" },
              ]}
            >
              <Input.Password placeholder="Enter password" size="large" />
            </Form.Item>

            {/* DID */}
            <Form.Item
              name="did"
              label={
                <span className="text-sm font-medium text-gray-700">DID</span>
              }
              rules={[{ required: true, message: "Please enter DID" }]}
            >
              <Input placeholder="Enter DID" size="large" />
            </Form.Item>

            {/* Department */}
            <Form.Item
              name="department"
              label={
                <span className="text-sm font-medium text-gray-700">
                  Department
                </span>
              }
              rules={[{ required: true, message: "Please enter department" }]}
            >
              <Input placeholder="Enter department" size="large" />
            </Form.Item>

            {/* Designation */}
            <Form.Item
              name="designation"
              label={
                <span className="text-sm font-medium text-gray-700">
                  Designation
                </span>
              }
              rules={[{ required: true, message: "Please enter designation" }]}
            >
              <Input placeholder="Enter designation" size="large" />
            </Form.Item>

            {/* Job Title */}
            <Form.Item
              name="jobTitle"
              label={
                <span className="text-sm font-medium text-gray-700">
                  Job Title
                </span>
              }
              rules={[{ required: true, message: "Please enter job title" }]}
            >
              <Input placeholder="Enter job title" size="large" />
            </Form.Item>

            {/* Created By */}
            <Form.Item
              name="createdBy"
              label={
                <span className="text-sm font-medium text-gray-700">
                  Created By
                </span>
              }
              rules={[{ required: true, message: "Please enter creator name" }]}
            >
              <Input placeholder="Enter creator name" size="large" />
            </Form.Item>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 mt-8 pt-4">
            <Button onClick={handleCancel} className="px-8 h-10">
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isPending}
              className="px-8 h-10 bg-cyan-500 hover:bg-cyan-600"
            >
              Create
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
}
