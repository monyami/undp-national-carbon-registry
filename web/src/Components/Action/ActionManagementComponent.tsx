import React, { useState, useEffect } from "react";
import { Table, Button, Space, Input, Select, message, Modal, Popconfirm, Tag, Empty, Spin } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useConnection } from "../../Context/ConnectionContext/connectionContext";
import { API_PATHS } from "../../Config/apiConfig";
import {
  Action,
  ActionType,
  ActionStatus,
  ActionSector,
  UpdateActionRequest,
} from "../../Definitions/Entities/action.entity";
import "./ActionManagementComponent.scss";

interface ActionManagementComponentProps {
  refreshKey?: number;
}

const ActionManagementComponent: React.FC<ActionManagementComponentProps> = ({ refreshKey = 0 }) => {
  const { t } = useTranslation(["common"]);
  const { post, put, delete: deleteRequest } = useConnection();
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, size: 10, total: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<ActionType | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<ActionStatus | undefined>();
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);

  useEffect(() => {
    loadActions();
  }, [pagination.page, refreshKey]);

  const loadActions = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: pagination.page,
        size: pagination.size,
      };

      if (searchTerm) {
        params.search = searchTerm;
      }
      if (selectedType) {
        params.type = selectedType;
      }
      if (selectedStatus) {
        params.status = selectedStatus;
      }

      const response: any = await post(API_PATHS.ACTION_QUERY, params);
      if (response && response.data) {
        setActions(Array.isArray(response.data) ? response.data : response.data.data || []);
        setPagination((prev) => ({
          ...prev,
          total: response.data.total || response.response?.data?.total || 0,
        }));
      }
    } catch (error: any) {
      console.error("Error loading actions:", error);
      message.error(error?.message || t("common:errorLoadingActions") || "Error loading actions");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleDelete = async (actionId: number) => {
    try {
      setLoading(true);
      const response: any = await deleteRequest(API_PATHS.ACTION_DELETE(actionId.toString()));
      if (response && response.status === 200) {
        message.success(t("common:actionDeletedSuccessfully") || "Action deleted successfully!");
        loadActions();
      }
    } catch (error: any) {
      console.error("Error deleting action:", error);
      message.error(error?.message || t("common:errorDeletingAction") || "Error deleting action");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (action: Action) => {
    setSelectedAction(action);
    setDetailsModalVisible(true);
  };

  const columns: any = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: 200,
      render: (text: string) => <span className="title-cell">{text}</span>,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 120,
      render: (type: ActionType) => {
        const colorMap: any = {
          Mitigation: "blue",
          Adaptation: "green",
          "Cross-cutting": "orange",
          Transparency: "purple",
          Other: "default",
        };
        return <Tag color={colorMap[type]}>{type}</Tag>;
      },
    },
    {
      title: "Sector",
      dataIndex: "sectorAffected",
      key: "sectorAffected",
      width: 140,
      render: (sector: ActionSector) => <span>{sector}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 110,
      render: (status: ActionStatus) => {
        const statusColorMap: any = {
          Planned: "default",
          Adopted: "processing",
          Implemented: "success",
        };
        return <Tag color={statusColorMap[status]}>{status}</Tag>;
      },
    },
    {
      title: "Start Year",
      dataIndex: "startYear",
      key: "startYear",
      width: 100,
      render: (year: number) => <span>{year}</span>,
    },
    {
      title: "Actions",
      key: "actions",
      width: 140,
      render: (_, record: Action) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
            title={t("common:view") || "View"}
          />
          <Popconfirm
            title={t("common:deleteConfirm") || "Are you sure? This action cannot be undone."}
            onConfirm={() => handleDelete(record.id)}
            okText={t("common:yes") || "Yes"}
            cancelText={t("common:no") || "No"}
          >
            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
              title={t("common:delete") || "Delete"}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="action-management-component">
      <div className="filters-section">
        <Input.Search
          size="large"
          placeholder={t("common:searchByTitle") || "Search by title..."}
          allowClear
          onSearch={handleSearch}
          style={{ width: 250 }}
        />
        <Select
          size="large"
          placeholder={t("common:filterByType") || "Filter by Type"}
          allowClear
          style={{ width: 150 }}
          onChange={(value) => {
            setSelectedType(value);
            setPagination((prev) => ({ ...prev, page: 1 }));
          }}
        >
          {Object.values(ActionType).map((type) => (
            <Select.Option key={type} value={type}>
              {type}
            </Select.Option>
          ))}
        </Select>
        <Select
          size="large"
          placeholder={t("common:filterByStatus") || "Filter by Status"}
          allowClear
          style={{ width: 150 }}
          onChange={(value) => {
            setSelectedStatus(value);
            setPagination((prev) => ({ ...prev, page: 1 }));
          }}
        >
          {Object.values(ActionStatus).map((status) => (
            <Select.Option key={status} value={status}>
              {status}
            </Select.Option>
          ))}
        </Select>
        <Button size="large" type="primary" onClick={loadActions} loading={loading}>
          {t("common:refresh") || "Refresh"}
        </Button>
      </div>

      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={actions}
          rowKey="id"
          pagination={{
            current: pagination.page,
            pageSize: pagination.size,
            total: pagination.total,
            onChange: (page) => setPagination((prev) => ({ ...prev, page })),
          }}
          locale={{
            emptyText: <Empty description={t("common:noData") || "No data"} />,
          }}
        />
      </Spin>

      {/* Details Modal */}
      <Modal
        title={t("common:actionDetails") || "Action Details"}
        visible={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedAction && (
          <div className="action-details">
            <div className="detail-row">
              <span className="label">{t("common:title") || "Title"}:</span>
              <span className="value">{selectedAction.title}</span>
            </div>
            <div className="detail-row">
              <span className="label">{t("common:type") || "Type"}:</span>
              <span className="value">{selectedAction.type}</span>
            </div>
            <div className="detail-row">
              <span className="label">{t("common:description") || "Description"}:</span>
              <span className="value">{selectedAction.description}</span>
            </div>
            <div className="detail-row">
              <span className="label">{t("common:objectives") || "Objectives"}:</span>
              <span className="value">{selectedAction.objectives}</span>
            </div>
            <div className="detail-row">
              <span className="label">{t("common:sector") || "Sector"}:</span>
              <span className="value">{selectedAction.sectorAffected}</span>
            </div>
            <div className="detail-row">
              <span className="label">{t("common:startYear") || "Start Year"}:</span>
              <span className="value">{selectedAction.startYear}</span>
            </div>
            <div className="detail-row">
              <span className="label">{t("common:status") || "Status"}:</span>
              <span className="value">
                <Tag color={selectedAction.status === "Implemented" ? "green" : selectedAction.status === "Adopted" ? "blue" : "default"}>
                  {selectedAction.status}
                </Tag>
              </span>
            </div>
            {selectedAction.remarks && (
              <div className="detail-row">
                <span className="label">{t("common:remarks") || "Remarks"}:</span>
                <span className="value">{selectedAction.remarks}</span>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ActionManagementComponent;
