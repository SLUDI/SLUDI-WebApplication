import { Modal, Typography, Tag, Divider } from "antd";
const { Title, Text } = Typography;

export default function ViewTemplate({ open, onCancel, data }) {
  if (!data) return null;

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      width={800}
      centered
      title="Template Details"
    >
      {/* BASIC INFO */}
      <div className="mb-4">
        <Title level={5}>Basic Information</Title>
        <p>
          <b>Template Code:</b> {data.templateCode}
        </p>
        <p>
          <b>Name:</b> {data.name}
        </p>
        <p>
          <b>Category:</b> {data.category}
        </p>
        <p>
          <b>Description:</b> {data.description}
        </p>
      </div>

      <Divider />

      {/* BASE PERMISSIONS */}
      <div className="mb-4">
        <Title level={5}>Base Permissions</Title>
        <div className="flex flex-wrap gap-2">
          {data.basePermissions?.map((perm, idx) => (
            <Tag color="blue" key={idx}>
              {perm}
            </Tag>
          ))}
        </div>
      </div>

      <Divider />

      {/* ROLES */}
      <div>
        <Title level={5}>Predefined Roles</Title>

        {data.predefinedRoles?.map((role, idx) => (
          <div key={idx} className="border rounded-lg p-4 mb-3 bg-gray-50">
            <p>
              <b>Role Code:</b> {role.roleCode}
            </p>
            <p>
              <b>Description:</b> {role.description}
            </p>
            <p>
              <b>Is Admin: </b>
              {role.isAdmin ? (
                <Tag color="red">Yes</Tag>
              ) : (
                <Tag color="green">No</Tag>
              )}
            </p>

            <p className="mt-2 mb-1">
              <b>Permissions:</b>
            </p>
            <div className="flex flex-wrap gap-2">
              {role.permissions?.map((p, i) => (
                <Tag key={i} color="purple">
                  {p}
                </Tag>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}
