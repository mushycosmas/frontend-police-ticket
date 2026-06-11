// src/pages/admin/issue-template/IssueTemplate.tsx
import React, { useState } from "react";
import { useIssueTemplates, IssueTemplate } from "../../../hooks/useIssueTemplates";

import { TemplateHeader } from "../../../components/issue-templates/TemplateHeader";
import { TemplateSearch } from "../../../components/issue-templates/TemplateSearch";
import { Toast } from "../../../components/common/Toast";
import { TemplateTable } from "../../../components/issue-templates/TemplateTable";
import { TemplateFormModal } from "../../../components/issue-templates/TemplateFormModal";
import { DeleteConfirmModal } from "../../../components/common/DeleteConfirmModal";

export const IssueTemplateManager: React.FC = () => {
  const {
    templates,
    categories,
    priorities,
    channels,
    loading,
    loadingCategories,
    loadingPriorities,
    loadingChannels,
    saving,
    message,
    saveTemplate,
    deleteTemplate,
    fetchTemplate,
    clearMessage,
  } = useIssueTemplates();

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] =
    useState<IssueTemplate | null>(null);
  const [deleteConfirm, setDeleteConfirm] =
    useState<IssueTemplate | null>(null);

  // ✅ CLEAN FORM STATE (NO priority_id ANYMORE)
  const [form, setForm] = useState({
    name: "",
    description: "",
    category_id: "",
    suggested_priority: "", // ✅ ONLY THIS
    channel_ids: [] as number[],
    steps_to_reproduce: "",
  });

  const filteredTemplates = templates.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ======================
  // CREATE
  // ======================
  const openCreate = () => {
    setEditingTemplate(null);

    setForm({
      name: "",
      description: "",
      category_id: "",
      suggested_priority: "",
      channel_ids: [],
      steps_to_reproduce: "",
    });

    setShowModal(true);
  };

  // ======================
  // EDIT
  // ======================
  const openEdit = async (template: IssueTemplate) => {
    const t = await fetchTemplate(template.id);
    if (!t) return;

    console.log("🔍 TEMPLATE LOADED:", t);

    setEditingTemplate(t);

    setForm({
      name: t.name || "",
      description: t.description || "",
      category_id: t.category ? String(t.category) : "",
      suggested_priority: t.suggested_priority
        ? String(t.suggested_priority)
        : "",
      channel_ids: Array.isArray(t.channels) ? t.channels : [],
      steps_to_reproduce: t.steps_to_reproduce || "",
    });
  };

  // ======================
  // SUBMIT
  // ======================
  const handleSubmit = async () => {
    console.log("🔥 FORM BEFORE SUBMIT:", form);

    const ok = await saveTemplate(form, editingTemplate);

    console.log("🔥 SAVE RESULT:", ok);

    if (ok) {
      console.log("✅ TEMPLATE SAVED SUCCESSFULLY");
      console.log("📦 PRIORITY SENT:", form.suggested_priority);

      setShowModal(false);
      setEditingTemplate(null);
    } else {
      console.log("❌ TEMPLATE SAVE FAILED");
    }
  };

  // ======================
  // DELETE
  // ======================
  const handleDelete = async () => {
    if (!deleteConfirm) return;
    await deleteTemplate(deleteConfirm);
    setDeleteConfirm(null);
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">

      <TemplateHeader onNew={openCreate} />

      <TemplateSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {message && (
        <Toast
          message={message.text}
          type={message.type}
          onClose={clearMessage}
        />
      )}

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <TemplateTable
          templates={filteredTemplates}
          loading={loading}
          onEdit={openEdit}
          onDelete={setDeleteConfirm}
        />
      </div>

      <TemplateFormModal
        show={showModal}
        editingTemplate={editingTemplate}
        categories={categories}
        priorities={priorities}
        channels={channels}
        loadingCategories={loadingCategories}
        loadingPriorities={loadingPriorities}
        loadingChannels={loadingChannels}
        saving={saving}
        form={form}
        onFormChange={setForm}
        onSubmit={handleSubmit}
        onClose={() => {
          setShowModal(false);
          setEditingTemplate(null);
        }}
      />

      <DeleteConfirmModal
        show={!!deleteConfirm}
        itemName={deleteConfirm?.name || ""}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
};