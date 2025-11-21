import { Modal, Form, Input, Select, Button, Switch } from "antd";
import React, { useState } from "react";
import { useTemplateCreate } from "../../../hooks/organization";

const { TextArea } = Input;

export default function Create({ open, onCancel }) {
  const [form] = Form.useForm();
  const [userRoles, setUserRoles] = useState([
    { role: "", permissions: [], isAdmin: false, description: "" },
  ]);

  const { mutate, isPending } = useTemplateCreate();

  const roleOptions = [
    { value: "admin", label: "Admin" },
    { value: "officer", label: "Officer" },
    { value: "inspector", label: "Inspector" },
    { value: "data_entry", label: "DataEntry" },
  ];

  const basePermissionOptions = [
    "vehicle:register",
    "vehicle:view",
    "vehicle:update",
    "vehicle:transfer",
    "vehicle:history:read",
    "license:read",
    "license:issue",
    "license:renew",
    "license:update",
    "license:suspend",
    "license:revoke",
    "license:history:read",
    "citizen:view",
    "identity:read",
    "identity:verify",
    "identity:search",
    "violation:create",
    "violation:read",
    "violation:update",
    "fine:create",
    "fine:read",
    "fine:update",
    "organization:user:create",
    "organization:user:view",
    "organization:user:update",
    "organization:user:delete",
  ].map((p) => ({ value: p, label: p }));

  // Helper: avoid selecting same role twice
  const getAvailableRoles = (currentIndex) => {
    const selectedRoles = userRoles
      .map((ur, idx) => (idx !== currentIndex ? ur.role : null))
      .filter(Boolean);
    return roleOptions.filter(
      (option) => !selectedRoles.includes(option.value)
    );
  };

  const handleRoleChange = (index, value) => {
    const updatedRoles = [...userRoles];
    updatedRoles[index] = { role: value, permissions: [], isAdmin: false };
    setUserRoles(updatedRoles);
  };

  const handlePermissionChange = (index, values) => {
    const updatedRoles = [...userRoles];
    updatedRoles[index].permissions = values;
    setUserRoles(updatedRoles);
  };

  const handleAdminToggle = (index, checked) => {
    const updatedRoles = [...userRoles];
    updatedRoles[index].isAdmin = checked;
    setUserRoles(updatedRoles);
  };

  const addRolePermissionPair = () => {
    setUserRoles([...userRoles, { role: "", permissions: [], isAdmin: false }]);
  };

  const removeRolePermissionPair = (index) => {
    const updatedRoles = userRoles.filter((_, i) => i !== index);
    setUserRoles(updatedRoles);
  };

  const allRolesSelected =
    userRoles.filter((ur) => ur.role).length >= roleOptions.length;

  const handleSubmit = (values) => {
    // Construct the final payload for backend
    const payload = {
      templateCode: values.templateCode,
      name: values.templateName,
      category: values.category,
      description: values.description,
      basePermissions: values.basePermission,
      predefinedRoles: userRoles.map((ur) => ({
        roleCode: ur.role.toUpperCase(),
        permissions: ur.permissions,
        isAdmin: ur.isAdmin,
        description: ur.description,
      })),
    };

    //console.log("Final Payload:", payload);

    // Pass data to backend via hook
    mutate(payload, {
      onSuccess: () => {
        form.resetFields();
        setUserRoles([
          { role: "", permissions: [], isAdmin: false, description: "" },
        ]);
        onCancel();
      },
    });
  };

  const handleCancel = () => {
    form.resetFields();
    setUserRoles([{ role: "", permissions: [], isAdmin: false }]);
    onCancel();
  };

  const handleDescriptionChange = (index, value) => {
    const updatedRoles = [...userRoles];
    updatedRoles[index].description = value;
    setUserRoles(updatedRoles);
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      width={900}
      footer={null}
      destroyOnClose
      maskClosable={false}
      centered
    >
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-6">Create Template</h2>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          {/* --- Basic Info Section --- */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Form.Item
              label="Template Code"
              name="templateCode"
              rules={[
                { required: true, message: "Please enter template code" },
              ]}
            >
              <Input placeholder="Enter template code" />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              className="row-span-3"
              rules={[{ required: true, message: "Please enter description" }]}
            >
              <TextArea
                placeholder="Enter description"
                style={{ height: "200px" }}
              />
            </Form.Item>

            <Form.Item
              label="Template Name"
              name="templateName"
              rules={[
                { required: true, message: "Please enter template name" },
              ]}
            >
              <Input placeholder="Enter template name" />
            </Form.Item>

            <Form.Item
              label="Category"
              name="category"
              rules={[{ required: true, message: "Please enter category" }]}
            >
              <Input placeholder="Enter category" />
            </Form.Item>
          </div>

          {/* --- Base Permission Section --- */}
          <Form.Item
            label="Base Permission"
            name="basePermission"
            rules={[
              {
                required: true,
                message: "Please select at least one permission",
              },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Select Base Permissions"
              options={basePermissionOptions}
              allowClear
              className="w-full"
            />
          </Form.Item>

          {/* --- Role Permission Section --- */}
          {userRoles.map((rolePermission, index) => (
            <div
              key={index}
              className="grid grid-cols-2 gap-4 mb-4 p-4 border border-gray-200 rounded-md relative"
            >
              {userRoles.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRolePermissionPair(index)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xl font-bold"
                >
                  ×
                </button>
              )}

              {/* Role Selector */}
              <Form.Item
                label="User Role"
                required
                rules={[{ required: true, message: "Please select user role" }]}
              >
                <Select
                  placeholder="Select Role"
                  value={rolePermission.role || undefined}
                  onChange={(value) => handleRoleChange(index, value)}
                  options={getAvailableRoles(index)}
                />
              </Form.Item>

              {/* Admin Toggle */}
              <div className="flex items-center gap-3 mt-2">
                <label className="font-medium text-sm">Is Admin?</label>
                <Switch
                  checked={rolePermission.isAdmin}
                  onChange={(checked) => handleAdminToggle(index, checked)}
                />
              </div>

              {/* Permission Selector */}
              <Form.Item label="User Permission" className="col-span-2">
                <Select
                  mode="multiple"
                  placeholder="Select Permissions"
                  value={rolePermission.permissions}
                  onChange={(values) => handlePermissionChange(index, values)}
                  options={basePermissionOptions}
                  disabled={!rolePermission.role}
                />
              </Form.Item>

              {/* Role Description */}
              <Form.Item label="Role Description" className="col-span-2">
                <TextArea
                  placeholder="Enter description for this role"
                  value={rolePermission.description}
                  onChange={(e) =>
                    handleDescriptionChange(index, e.target.value)
                  }
                  rows={3}
                />
              </Form.Item>
            </div>
          ))}

          <Button
            type="dashed"
            onClick={addRolePermissionPair}
            className="w-full mb-4"
            disabled={allRolesSelected}
          >
            + Add Another Role & Permission
          </Button>

          {/* --- Footer Buttons --- */}
          <div className="flex justify-end gap-3 mt-6">
            <Button onClick={handleCancel} className="px-6">
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="px-6 bg-teal-500 hover:bg-teal-600"
              loading={isPending}
            >
              Create
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
}
