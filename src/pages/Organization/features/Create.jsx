import { Modal, Form, Input, Select, Button, message } from "antd";
import React from "react";
import { useOrganizationCreate } from "../../../hooks/organization";

export default function Create({ open, onCancel }) {
  const [form] = Form.useForm();
  const { mutate, isPending } = useOrganizationCreate();

  const handleSubmit = (values) => {
    //console.log("Form values:", values);

    // Call API
    mutate(values, {
      onSuccess: () => {
        message.success("Organization created successfully!");
        form.resetFields();
        onCancel();
      },
      onError: (error) => {
        console.error("Error creating organization:", error);
        message.error(
          error?.response?.data?.message || "Failed to create organization"
        );
      },
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

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
        <h2 className="text-2xl font-semibold mb-6">Create Organization</h2>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="space-y-2"
        >
          <div className="grid grid-cols-2 gap-x-6">
            {/* Name of The Organization */}
            <Form.Item
              name="name"
              label={
                <span className="text-sm font-medium text-gray-700">
                  Name of The Organization
                </span>
              }
              rules={[
                { required: true, message: "Please enter organization name" },
              ]}
            >
              <Input placeholder="Text field data" size="large" />
            </Form.Item>

            {/* Template ID */}
            <Form.Item
              name="templateId"
              label={
                <span className="text-sm font-medium text-gray-700">
                  Template ID
                </span>
              }
              rules={[{ required: true, message: "Please select template ID" }]}
            >
              <Select
                placeholder="Dropdown Field Data"
                size="large"
                options={[
                  { value: "1", label: "Template 1" },
                  { value: "2", label: "Template 2" },
                  { value: "3", label: "Template 3" },
                  { value: "4", label: "Template 4" },
                ]}
              />
            </Form.Item>

            {/* Registration Number */}
            <Form.Item
              name="registrationNumber"
              label={
                <span className="text-sm font-medium text-gray-700">
                  Registration Number
                </span>
              }
              rules={[
                { required: true, message: "Please enter registration number" },
              ]}
            >
              <Input placeholder="Text field data" size="large" />
            </Form.Item>

            {/* Organization Type */}
            <Form.Item
              name="organizationType"
              label={
                <span className="text-sm font-medium text-gray-700">
                  Organization Type
                </span>
              }
              rules={[
                { required: true, message: "Please select organization type" },
              ]}
            >
              <Select
                placeholder="Dropdown Field Data"
                size="large"
                options={[
                  { value: "FINANCIAL", label: "Financial" },
                  { value: "PRIVATE", label: "Private" },
                  { value: "GOVERNMENT", label: "Government" },
                  { value: "NGO", label: "NGO" },
                ]}
              />
            </Form.Item>

            {/* Email Address */}
            <Form.Item
              name="contactEmail"
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
              <Input placeholder="Text field data" size="large" type="email" />
            </Form.Item>

            {/* Phone Number */}
            <Form.Item
              name="contactPhone"
              label={
                <span className="text-sm font-medium text-gray-700">
                  Phone Number
                </span>
              }
              rules={[{ required: true, message: "Please enter phone number" }]}
            >
              <Input placeholder="Text field data" size="large" />
            </Form.Item>

            {/* Address */}
            <Form.Item
              name="address"
              label={
                <span className="text-sm font-medium text-gray-700">
                  Address
                </span>
              }
              rules={[{ required: true, message: "Please enter address" }]}
            >
              <Input placeholder="Text field data" size="large" />
            </Form.Item>

            {/* City */}
            <Form.Item
              name="city"
              label={
                <span className="text-sm font-medium text-gray-700">City</span>
              }
              rules={[{ required: true, message: "Please enter city" }]}
            >
              <Input placeholder="Text field data" size="large" />
            </Form.Item>

            {/* Postal Code */}
            <Form.Item
              name="postalCode"
              label={
                <span className="text-sm font-medium text-gray-700">
                  Postal Code
                </span>
              }
              rules={[{ required: true, message: "Please enter postal code" }]}
            >
              <Input placeholder="Text field data" size="large" />
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
