import React, { useState } from "react";
import { message } from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useConnection } from "../../Context/ConnectionContext/connectionContext";
import { API_PATHS } from "../../Config/apiConfig";
import ActionForm from "../../Components/Action/ActionForm";
import { CreateActionRequest } from "../../Definitions/Entities/action.entity";
import "./ActionManagement.scss";

const AddAction: React.FC = () => {
  const { t } = useTranslation(["common"]);
  const navigate = useNavigate();
  const { post } = useConnection();
  const [loading, setLoading] = useState(false);

  const handleCreateAction = async (values: CreateActionRequest) => {
    try {
      setLoading(true);
      const response: any = await post(API_PATHS.ACTION_CREATE, values);
      if (response && response.status === 201) {
        message.success(t("common:actionCreatedSuccessfully") || "Action created successfully!");
        navigate("/actionManagement", { replace: true });
      }
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error("Error creating action:", error);
      message.error(error?.message || t("common:errorCreatingAction") || "Error creating action");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-container">
      <div className="title-bar">
        <div className="body-title">{t("common:addAction") || "Add Action"}</div>
      </div>
      <div className="content-card" style={{ padding: 24 }}>
        <ActionForm onSubmit={handleCreateAction} loading={loading} />
      </div>
    </div>
  );
};

export default AddAction;


