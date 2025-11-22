import { Modal, Typography, Tag, Divider, Card, Row, Col, Empty } from "antd";
import { Calendar, MapPin, FileText, Clock, CheckCircle } from "lucide-react";

const { Title, Text } = Typography;

export default function ViewTemplate({ open, onCancel, data }) {
  if (!data) return <Empty />;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      width={900}
      centered
      title="Request Details"
      bodyStyle={{ padding: "24px", maxHeight: "80vh", overflowY: "auto" }}
    >
      {/* CITIZEN INFORMATION */}
      <div className="mb-6">
        <Title level={4} className="flex items-center gap-2">
          <CheckCircle size={20} className="text-green-600" />
          Citizen Information
        </Title>
        <Divider />
        <Card className="border-0 bg-gray-50">
          <Row gutter={[24, 16]}>
            <Col xs={24} sm={12}>
              <div>
                <Text className="text-gray-600 text-sm">Full Name</Text>
                <p className="font-semibold text-base mt-1">
                  {data?.sharedAttributes?.fullName}
                </p>
              </div>
            </Col>
            <Col xs={24} sm={12}>
              <div>
                <Text className="text-gray-600 text-sm">NIC</Text>
                <p className="font-semibold text-base mt-1 font-mono">
                  {data?.sharedAttributes?.nic}
                </p>
              </div>
            </Col>
            <Col xs={24} sm={12}>
              <div>
                <Text className="text-gray-600 text-sm">DID</Text>
                <p className="font-semibold text-sm mt-1 font-mono break-all">
                  {data?.sharedAttributes?.id}
                </p>
              </div>
            </Col>
            <Col xs={24} sm={12}>
              <div>
                <Text className="text-gray-600 text-sm">Age</Text>
                <p className="font-semibold text-base mt-1">
                  {data?.sharedAttributes?.age} years
                </p>
              </div>
            </Col>
            <Col xs={24} sm={12}>
              <div>
                <Text className="text-gray-600 text-sm">Date of Birth</Text>
                <p className="font-semibold text-base mt-1">
                  {new Date(
                    data?.sharedAttributes?.dateOfBirth
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </Col>
            <Col xs={24} sm={12}>
              <div>
                <Text className="text-gray-600 text-sm">Blood Group</Text>
                <p className="font-semibold text-base mt-1">
                  <Tag color="red">{data?.sharedAttributes?.bloodGroup}</Tag>
                </p>
              </div>
            </Col>
          </Row>
        </Card>
      </div>

      {/* ADDRESS INFORMATION */}
      <div className="mb-6">
        <Title level={4} className="flex items-center gap-2">
          <MapPin size={20} className="text-orange-600" />
          Address
        </Title>
        <Divider />
        <Card className="border-0 bg-gray-50">
          <Row gutter={[24, 16]}>
            <Col xs={24}>
              <Text className="text-gray-700 block">
                {data?.sharedAttributes?.address?.street},{" "}
                {data?.sharedAttributes?.address?.city}
              </Text>
            </Col>
            <Col xs={24} sm={12}>
              <div>
                <Text className="text-gray-600 text-sm">District</Text>
                <p className="font-semibold text-base mt-1">
                  {data?.sharedAttributes?.address?.district}
                </p>
              </div>
            </Col>
            <Col xs={24} sm={12}>
              <div>
                <Text className="text-gray-600 text-sm">Province</Text>
                <p className="font-semibold text-base mt-1">
                  {data?.sharedAttributes?.address?.province}
                </p>
              </div>
            </Col>
            <Col xs={24} sm={12}>
              <div>
                <Text className="text-gray-600 text-sm">Postal Code</Text>
                <p className="font-semibold text-base mt-1">
                  {data?.sharedAttributes?.address?.postalCode}
                </p>
              </div>
            </Col>
            <Col xs={24} sm={12}>
              <div>
                <Text className="text-gray-600 text-sm">
                  Divisional Secretariat
                </Text>
                <p className="font-semibold text-base mt-1">
                  {data?.sharedAttributes?.address?.divisionalSecretariat}
                </p>
              </div>
            </Col>
          </Row>
        </Card>
      </div>

      {/* TIMELINE */}
      <div className="mb-6">
        <Title level={4} className="flex items-center gap-2">
          <Clock size={20} className="text-purple-600" />
          Timeline
        </Title>
        <Divider />
        <Card className="border-0 bg-gray-50">
          <Row gutter={[24, 16]}>
            <Col xs={24} sm={12}>
              <div>
                <Text className="text-gray-600 text-sm">Requested At</Text>
                <p className="font-semibold text-sm mt-1">
                  {formatDate(data?.createdAt)}
                </p>
              </div>
            </Col>
            <Col xs={24} sm={12}>
              <div>
                <Text className="text-gray-600 text-sm">Fulfilled At</Text>
                <p className="font-semibold text-sm mt-1">
                  {data?.fulfilledAt ? formatDate(data?.fulfilledAt) : "N/A"}
                </p>
              </div>
            </Col>
            <Col xs={24} sm={12}>
              <div>
                <Text className="text-gray-600 text-sm">Expires At</Text>
                <p className="font-semibold text-sm mt-1">
                  {formatDate(data?.expiresAt)}
                </p>
              </div>
            </Col>
            <Col xs={24} sm={12}>
              <div>
                <Text className="text-gray-600 text-sm">Holder DID</Text>
                <p className="font-semibold text-xs mt-1 font-mono break-all">
                  {data?.holderDid}
                </p>
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    </Modal>
  );
}
