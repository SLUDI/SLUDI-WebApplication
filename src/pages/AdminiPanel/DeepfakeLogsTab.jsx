import React, { useState } from "react";
import {
    Table,
    Card,
    Tag,
    Button,
    Modal,
    Image,
    Statistic,
    Row,
    Col,
    Spin,
    Empty,
    Switch,
    Progress,
} from "antd";
import {
    EyeOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    WarningOutlined,
    SafetyCertificateOutlined,
    ReloadOutlined,
} from "@ant-design/icons";
import { useDeepfakeLogs, useDeepfakeStats } from "../../services/deepfakeLogService";

const DeepfakeLogsTab = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [deepfakeOnly, setDeepfakeOnly] = useState(false);
    const [selectedLog, setSelectedLog] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const { data: logsData, isLoading: logsLoading, refetch } = useDeepfakeLogs(
        currentPage,
        pageSize,
        deepfakeOnly
    );

    const { data: statsData, isLoading: statsLoading } = useDeepfakeStats();

    const logs = logsData?.data?.logs || [];
    const totalItems = logsData?.data?.totalItems || 0;
    const stats = statsData?.data || {};

    const handleViewDetails = (record) => {
        setSelectedLog(record);
        setModalVisible(true);
    };

    const getAuthResultTag = (result) => {
        switch (result) {
            case "SUCCESS":
                return <Tag color="green" icon={<CheckCircleOutlined />}>Success</Tag>;
            case "FAILED_DEEPFAKE":
                return <Tag color="red" icon={<WarningOutlined />}>Deepfake Detected</Tag>;
            case "FAILED_MATCH":
                return <Tag color="orange" icon={<CloseCircleOutlined />}>Face Mismatch</Tag>;
            case "FAILED_LIVENESS":
                return <Tag color="purple" icon={<CloseCircleOutlined />}>Liveness Failed</Tag>;
            default:
                return <Tag>{result}</Tag>;
        }
    };

    const columns = [
        {
            title: "Citizen",
            key: "citizen",
            render: (_, record) => (
                <div>
                    <div className="font-medium">{record.citizenName || "Unknown"}</div>
                    <div className="text-xs text-gray-500">{record.citizenDid?.substring(0, 20)}...</div>
                </div>
            ),
        },
        {
            title: "Timestamp",
            dataIndex: "detectedAt",
            key: "detectedAt",
            render: (date) => new Date(date).toLocaleString(),
        },
        {
            title: "Result",
            dataIndex: "authResult",
            key: "authResult",
            render: getAuthResultTag,
        },
        {
            title: "Deepfake",
            dataIndex: "deepfakeDetected",
            key: "deepfakeDetected",
            render: (detected) =>
                detected ? (
                    <Tag color="red" icon={<WarningOutlined />}>Yes</Tag>
                ) : (
                    <Tag color="green" icon={<SafetyCertificateOutlined />}>No</Tag>
                ),
        },
        {
            title: "Confidence",
            dataIndex: "confidence",
            key: "confidence",
            render: (val) => (
                <Progress
                    percent={Math.round((val || 0) * 100)}
                    size="small"
                    strokeColor={val >= 0.5 ? "#ff4d4f" : "#52c41a"}
                    format={(percent) => `${percent}%`}
                />
            ),
        },
        {
            title: "Similarity",
            dataIndex: "similarityScore",
            key: "similarityScore",
            render: (val) => `${((val || 0) * 100).toFixed(1)}%`,
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Button
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={() => handleViewDetails(record)}
                >
                    View
                </Button>
            ),
        },
    ];

    return (
        <div className="p-4">
            {/* Statistics Cards */}
            <Row gutter={[16, 16]} className="mb-6">
                <Col xs={12} md={6}>
                    <Card className="shadow-sm">
                        <Statistic
                            title="Total Attempts"
                            value={stats.totalAttempts || 0}
                            loading={statsLoading}
                        />
                    </Card>
                </Col>
                <Col xs={12} md={6}>
                    <Card className="shadow-sm">
                        <Statistic
                            title="Deepfakes Detected"
                            value={stats.deepfakesDetected || 0}
                            valueStyle={{ color: "#cf1322" }}
                            loading={statsLoading}
                        />
                    </Card>
                </Col>
                <Col xs={12} md={6}>
                    <Card className="shadow-sm">
                        <Statistic
                            title="Successful Auths"
                            value={stats.successfulAuthentications || 0}
                            valueStyle={{ color: "#3f8600" }}
                            loading={statsLoading}
                        />
                    </Card>
                </Col>
                <Col xs={12} md={6}>
                    <Card className="shadow-sm">
                        <Statistic
                            title="Detection Rate"
                            value={stats.deepfakeDetectionRate?.toFixed(1) || 0}
                            suffix="%"
                            loading={statsLoading}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Filters and Table */}
            <Card className="shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold m-0">Authentication Logs</h3>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm">Deepfake Only</span>
                            <Switch
                                checked={deepfakeOnly}
                                onChange={(checked) => {
                                    setDeepfakeOnly(checked);
                                    setCurrentPage(0);
                                }}
                            />
                        </div>
                        <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
                            Refresh
                        </Button>
                    </div>
                </div>

                {logsLoading ? (
                    <div className="flex justify-center py-12">
                        <Spin size="large" />
                    </div>
                ) : logs.length === 0 ? (
                    <Empty description="No authentication logs found" />
                ) : (
                    <Table
                        dataSource={logs}
                        columns={columns}
                        rowKey="id"
                        pagination={{
                            current: currentPage + 1,
                            pageSize: pageSize,
                            total: totalItems,
                            onChange: (page, size) => {
                                setCurrentPage(page - 1);
                                setPageSize(size);
                            },
                        }}
                    />
                )}
            </Card>

            {/* Details Modal */}
            <Modal
                title="Authentication Log Details"
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                width={800}
            >
                {selectedLog && (
                    <div className="space-y-6">
                        {/* Basic Info */}
                        <Card title="Basic Information" size="small">
                            <Row gutter={16}>
                                <Col span={12}>
                                    <p><strong>Citizen:</strong> {selectedLog.citizenName}</p>
                                    <p><strong>DID:</strong> {selectedLog.citizenDid}</p>
                                    <p><strong>Timestamp:</strong> {new Date(selectedLog.detectedAt).toLocaleString()}</p>
                                </Col>
                                <Col span={12}>
                                    <p><strong>Result:</strong> {getAuthResultTag(selectedLog.authResult)}</p>
                                    <p><strong>Processing Time:</strong> {selectedLog.processingTimeMs?.toFixed(0)}ms</p>
                                    <p><strong>Threshold:</strong> {(selectedLog.thresholdUsed * 100).toFixed(0)}%</p>
                                </Col>
                            </Row>
                        </Card>

                        {/* Detection Details */}
                        <Card title="Detection Details" size="small">
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Statistic
                                        title="Deepfake Detected"
                                        value={selectedLog.deepfakeDetected ? "Yes" : "No"}
                                        valueStyle={{ color: selectedLog.deepfakeDetected ? "#cf1322" : "#3f8600" }}
                                    />
                                </Col>
                                <Col span={8}>
                                    <Statistic
                                        title="Confidence"
                                        value={((selectedLog.confidence || 0) * 100).toFixed(1)}
                                        suffix="%"
                                    />
                                </Col>
                                <Col span={8}>
                                    <Statistic
                                        title="Similarity Score"
                                        value={((selectedLog.similarityScore || 0) * 100).toFixed(1)}
                                        suffix="%"
                                    />
                                </Col>
                            </Row>
                            <Row gutter={16} className="mt-4">
                                <Col span={8}>
                                    <Statistic
                                        title="Liveness Check"
                                        value={selectedLog.livenessCheckPassed ? "Passed" : "Failed"}
                                        valueStyle={{ color: selectedLog.livenessCheckPassed ? "#3f8600" : "#cf1322" }}
                                    />
                                </Col>
                                <Col span={8}>
                                    <Statistic title="Blinks Detected" value={selectedLog.blinksDetected || 0} />
                                </Col>
                            </Row>
                        </Card>

                        {/* Visualizations */}
                        {(selectedLog.heatmapBase64 || selectedLog.overlayBase64 || selectedLog.originalImageBase64) && (
                            <Card title="Grad-CAM Visualizations" size="small">
                                <p className="text-gray-500 text-sm mb-4">
                                    These visualizations show which areas of the image triggered the deepfake detection.
                                    Red areas indicate higher attention from the AI model.
                                </p>
                                <Row gutter={16}>
                                    {selectedLog.originalImageBase64 && (
                                        <Col xs={24} md={8} className="text-center mb-4">
                                            <p className="font-medium mb-2">Original</p>
                                            <Image
                                                src={`data:image/png;base64,${selectedLog.originalImageBase64}`}
                                                alt="Original"
                                                style={{ maxHeight: 150, objectFit: "contain" }}
                                            />
                                        </Col>
                                    )}
                                    {selectedLog.heatmapBase64 && (
                                        <Col xs={24} md={8} className="text-center mb-4">
                                            <p className="font-medium mb-2">Heatmap</p>
                                            <Image
                                                src={`data:image/png;base64,${selectedLog.heatmapBase64}`}
                                                alt="Heatmap"
                                                style={{ maxHeight: 150, objectFit: "contain" }}
                                            />
                                        </Col>
                                    )}
                                    {selectedLog.overlayBase64 && (
                                        <Col xs={24} md={8} className="text-center mb-4">
                                            <p className="font-medium mb-2">Overlay</p>
                                            <Image
                                                src={`data:image/png;base64,${selectedLog.overlayBase64}`}
                                                alt="Overlay"
                                                style={{ maxHeight: 150, objectFit: "contain" }}
                                            />
                                        </Col>
                                    )}
                                </Row>
                            </Card>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default DeepfakeLogsTab;
