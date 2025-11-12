import React, { useState, useEffect } from "react";
import { Card, List, Tag, Button, Spin, Empty, Row, Col, Statistic } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useConnection } from "../Context/ConnectionContext/connectionContext";
import { API_PATHS } from "../../Config/apiConfig";
import {
  Action,
  ActionType,
  ActionStatus,
  ActionSector,
} from "../../Definitions/Entities/action.entity";
import "./ActionDashboardWidget.scss";

const ActionDashboardWidget: React.FC = () => {
  const { t } = useTranslation(["common"]);
  const navigate = useNavigate();
  const { post } = useConnection();
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    planned: 0,
    adopted: 0,
    implemented: 0,
  });

  useEffect(() => {
    loadRecentActions();
  }, []);

  const loadRecentActions = async () => {
    try {
      setLoading(true);
      const response: any = await post(API_PATHS.ACTION_QUERY, {
        page: 1,
        size: 5,
      });

      if (response && response.data) {
        const actionList = Array.isArray(response.data)
          ? response.data
          : response.data.data || [];
        setActions(actionList);

        // Calculate stats
        const total = response.data.total || response.response?.data?.total || 0;
        const planned = actionList.filter(
          (a: Action) => a.status === ActionStatus.Planned
        ).length;
        const adopted = actionList.filter(
          (a: Action) => a.status === ActionStatus.Adopted
        ).length;
        const implemented = actionList.filter(
          (a: Action) => a.status === ActionStatus.Implemented
        ).length;

        setStats({ total, planned, adopted, implemented });
      }
    } catch (error: any) {
      console.error("Error loading actions:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type: ActionType) => {
    const colorMap: any = {
      Mitigation: "blue",
      Adaptation: "green",
      "Cross-cutting": "orange",
      Transparency: "purple",
      Other: "default",
    };
    return colorMap[type] || "default";
  };

  const getStatusColor = (status: ActionStatus) => {
    const colorMap: any = {
      Planned: "default",
      Adopted: "processing",
      Implemented: "success",
    };
    return colorMap[status] || "default";
  };

  return (
    <Card
      title={t("common:climateActions") || "Climate Actions"}
      className="action-dashboard-widget"
      extra={
        <Button type="link" onClick={() => navigate("/actionManagement")}>
          {t("common:viewAll") || "View All"}
          <ArrowRightOutlined />
        </Button>
      }
    >
      {loading ? (
        <Spin />
      ) : (
        <>
          {/* Stats Row */}
          <Row gutter={[16, 16]} className="stats-row" style={{ marginBottom: 24 }}>
            <Col xs={12} sm={6}>
              <Statistic
                title={t("common:total") || "Total"}
                value={stats.total}
                valueStyle={{ color: "#1890ff" }}
              />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic
                title={t("common:planned") || "Planned"}
                value={stats.planned}
                valueStyle={{ color: "#faad14" }}
              />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic
                title={t("common:adopted") || "Adopted"}
                value={stats.adopted}
                valueStyle={{ color: "#1890ff" }}
              />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic
                title={t("common:implemented") || "Implemented"}
                value={stats.implemented}
                valueStyle={{ color: "#52c41a" }}
              />
            </Col>
          </Row>

          {/* Recent Actions List */}
          {actions.length > 0 ? (
            <List
              dataSource={actions}
              renderItem={(action: Action) => (
                <List.Item
                  className="action-list-item"
                  onClick={() => navigate(`/actionManagement?id=${action.id}`)}
                >
                  <List.Item.Meta
                    title={
                      <div className="action-title">
                        <span>{action.title}</span>
                        <div className="action-tags">
                          <Tag color={getTypeColor(action.type)}>
                            {action.type}
                          </Tag>
                          <Tag color={getStatusColor(action.status)}>
                            {action.status}
                          </Tag>
                        </div>
                      </div>
                    }
                    description={
                      <div className="action-description">
                        <p>
                          <strong>{t("common:sector")}:</strong> {action.sectorAffected}
                        </p>
                        <p>
                          <strong>{t("common:startYear")}:</strong> {action.startYear}
                        </p>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          ) : (
            <Empty description={t("common:noActions") || "No actions yet"} />
          )}
        </>
      )}
    </Card>
  );
};

export default ActionDashboardWidget;
