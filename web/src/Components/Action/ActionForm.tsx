import React, { useState, useRef } from "react";
import { Form, Select, Input, Button, Row, Col, Upload, message, DatePicker, InputNumber, Checkbox } from "antd";
import { useTranslation } from "react-i18next";
import {
  ActionType,
  ActionStatus,
  ActionSector,
  ActionInstrument,
  ActionNationalAnchor,
  CreateActionRequest,
} from "../../Definitions/Entities/action.entity";
import "./ActionForm.scss";

interface ActionFormProps {
  onSubmit: (values: CreateActionRequest) => Promise<void>;
  loading?: boolean;
}

export const ActionForm: React.FC<ActionFormProps> = ({ onSubmit, loading = false }) => {
  const { t } = useTranslation(["common"]);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const formContainerRef = useRef<HTMLDivElement>(null);

  // Helper function to get the popup container for Select dropdowns
  const getPopupContainer = (triggerNode: HTMLElement) => {
    if (formContainerRef.current) {
      return formContainerRef.current;
    }
    // Fallback: find the closest container with position relative
    let element: HTMLElement | null = triggerNode;
    while (element) {
      const style = window.getComputedStyle(element);
      if (style.position === 'relative' || style.position === 'absolute' || element.classList.contains('action-form-container') || element.classList.contains('content-card')) {
        return element;
      }
      element = element.parentElement;
    }
    return document.body;
  };

  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      const payload: CreateActionRequest = {
        type: values.type,
        title: values.title,
        description: values.description,
        objectives: values.objectives,
        sectorAffected: values.sectorAffected,
        startYear: values.startYear,
        status: values.status || ActionStatus.Planned,
        instrumentTypes: values.instrumentTypes || [],
        nationalAnchors: values.nationalAnchors || [],
        remarks: values.remarks,
      };
      await onSubmit(payload);
      form.resetFields();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="action-form-container" ref={formContainerRef}>
      <Form form={form} onFinish={handleSubmit} layout="vertical" autoComplete="off">
        <Row gutter={[16, 16]}>
          {/* TYPE */}
          <Col xs={24} md={12}>
            <Form.Item
              label={t("common:type") || "Type"}
              name="type"
              rules={[{ required: true, message: t("common:typeRequired") || "Type is required" }]}
            >
              <Select 
                size="large" 
                placeholder={t("common:selectType") || "Select Type"}
                getPopupContainer={getPopupContainer}
              >
                {Object.values(ActionType).map((type) => (
                  <Select.Option key={type} value={type}>
                    {type}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          {/* TITLE */}
          <Col xs={24} md={12}>
            <Form.Item
              label={t("common:title") || "Title of Action"}
              name="title"
              rules={[{ required: true, message: t("common:titleRequired") || "Title is required" }]}
            >
              <Input size="large" placeholder={t("common:enterTitle") || "Enter title"} />
            </Form.Item>
          </Col>

          {/* DESCRIPTION */}
          <Col xs={24}>
            <Form.Item
              label={t("common:description") || "Description"}
              name="description"
              rules={[{ required: true, message: t("common:descriptionRequired") || "Description is required" }]}
            >
              <Input.TextArea
                placeholder={t("common:enterDescription") || "Enter Description"}
                rows={3}
              />
            </Form.Item>
          </Col>

          {/* OBJECTIVES */}
          <Col xs={24}>
            <Form.Item
              label={t("common:objectives") || "Action Objectives"}
              name="objectives"
              rules={[{ required: true, message: t("common:objectivesRequired") || "Objectives are required" }]}
            >
              <Input.TextArea
                placeholder={t("common:enterObjectives") || "Enter Objectives"}
                rows={3}
              />
            </Form.Item>
          </Col>

          {/* INSTRUMENT TYPES */}
          <Col xs={24} md={12}>
            <Form.Item
              label={t("common:instrumentTypes") || "Type of Instrument(s)"}
              name="instrumentTypes"
            >
              <Select
                size="large"
                mode="multiple"
                placeholder={t("common:selectInstruments") || "Select instruments"}
                getPopupContainer={getPopupContainer}
              >
                {Object.values(ActionInstrument).map((instrument) => (
                  <Select.Option key={instrument} value={instrument}>
                    {instrument}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          {/* STATUS */}
          <Col xs={24} md={12}>
            <Form.Item
              label={t("common:status") || "Action Status"}
              name="status"
              initialValue={ActionStatus.Planned}
            >
              <Select 
                size="large" 
                placeholder={t("common:selectStatus") || "Select Status"}
                getPopupContainer={getPopupContainer}
              >
                {Object.values(ActionStatus).map((status) => (
                  <Select.Option key={status} value={status}>
                    {status}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          {/* SECTOR */}
          <Col xs={24} md={12}>
            <Form.Item
              label={t("common:sector") || "Sector Affected"}
              name="sectorAffected"
              rules={[{ required: true, message: t("common:sectorRequired") || "Sector is required" }]}
            >
              <Select 
                size="large" 
                placeholder={t("common:selectSector") || "Select Sector"}
                getPopupContainer={getPopupContainer}
              >
                {Object.values(ActionSector).map((sector) => (
                  <Select.Option key={sector} value={sector}>
                    {sector}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          {/* START YEAR */}
          <Col xs={24} md={12}>
            <Form.Item
              label={t("common:startYear") || "Start Year"}
              name="startYear"
              rules={[
                { required: true, message: t("common:startYearRequired") || "Start year is required" },
                { type: "number", min: 2013, max: 2050, message: "Year must be between 2013 and 2050" },
              ]}
            >
              <InputNumber
                size="large"
                min={2013}
                max={2050}
                placeholder="Enter Year (2013–2050)"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          {/* NATIONAL ANCHORS */}
          <Col xs={24}>
            <Form.Item
              label={t("common:nationalAnchors") || "Anchored in a National Strategy"}
              name="nationalAnchors"
            >
              <Select
                size="large"
                mode="multiple"
                placeholder={t("common:selectAnchors") || "Select national strategies"}
                getPopupContainer={getPopupContainer}
              >
                {Object.values(ActionNationalAnchor).map((anchor) => (
                  <Select.Option key={anchor} value={anchor}>
                    {anchor}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          {/* REMARKS */}
          <Col xs={24}>
            <Form.Item
              label={t("common:remarks") || "Remarks"}
              name="remarks"
            >
              <Input.TextArea
                placeholder={t("common:enterRemarks") || "Enter Remarks (optional)"}
                rows={2}
              />
            </Form.Item>
          </Col>

          {/* SUBMIT BUTTON */}
          <Col xs={24} className="form-actions">
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              loading={submitting || loading}
              disabled={submitting || loading}
            >
              {t("common:submit") || "Submit"}
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default ActionForm;
