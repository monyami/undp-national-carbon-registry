import React, { useState } from "react";
import { Button, Row, Col } from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ActionManagementComponent from "../../Components/Action/ActionManagementComponent";
import "./ActionManagement.scss";

interface ActionManagementProps {}

const ActionManagement: React.FC<ActionManagementProps> = () => {
  const { t } = useTranslation(["common"]);
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="content-container">
      <div className="title-bar">
        <div className="body-title">{((t("common:viewActions") as unknown as string) || "View Actions").replace(/([a-z])([A-Z])/g, '$1 $2').replace(/\b\w/g, (c) => c.toUpperCase())}</div>
      </div>
      <div className="content-card">
        <Row className="table-actions-section">
          <Col md={8} xs={24}>
            <div className="action-bar">
              <Button type="primary" size="large" block onClick={() => navigate("/actionManagement/addAction")}>Add Action</Button>
            </div>
          </Col>
        </Row>
        <div style={{ padding: 24 }}>
          <ActionManagementComponent refreshKey={refreshKey} />
        </div>
      </div>
    </div>
  );
};

export default ActionManagement;
