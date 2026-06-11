import React, { useState, useMemo } from "react";
import {
  useIssueTemplates,
  IssueTemplate,
} from "../../../hooks/useIssueTemplates";

import { TemplateHeader } from "../../../components/issue-templates/TemplateHeader";
import { TemplateSearch } from "../../../components/issue-templates/TemplateSearch";
import { Toast } from "../../../components/common/Toast";
import { TemplateTable } from "../../../components/issue-templates/TemplateTable";
import { TemplateFormModal } from "../../../components/issue-templates/TemplateFormModal";
import { DeleteConfirmModal } from "../../../components/common/DeleteConfirmModal";

const ITEMS_PER_PAGE = 8;

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
  const [page, setPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<IssueTemplate | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<IssueTemplate | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    category_id: "",
    suggested_priority: "",
    channel_ids: [] as number[],
    steps_to_reproduce: "",
  });

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return templates;
    return templates.filter((t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [templates, searchTerm]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const paginated = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, page]);

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

  // ✅ FIXED EDIT (NO DEAD BLOCKING)
  const openEdit = (template: IssueTemplate) => {
    setEditingTemplate(template);

    setForm({
      name: template.name,
      description: template.description,
      category_id: template.category?.toString() || "",
      suggested_priority: template.suggested_priority?.toString() || "",
      channel_ids: template.channels || [],
      steps_to_reproduce: template.steps_to_reproduce || "",
    });

    setShowModal(true);
  };

  const handleSubmit = async () => {
    const ok = await saveTemplate(form, editingTemplate);
    if (ok) {
      setShowModal(false);
      setEditingTemplate(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    await deleteTemplate(deleteConfirm);
    setDeleteConfirm(null);
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">

      <TemplateHeader onNew={openCreate} />

      <TemplateSearch
        searchTerm={searchTerm}
        onSearchChange={(v) => {
          setSearchTerm(v);
          setPage(1);
        }}
      />

      {message && (
        <Toast
          message={message.text}
          type={message.type}
          onClose={clearMessage}
        />
      )}

      <TemplateTable
        templates={paginated}
        loading={loading}
        page={page}
        itemsPerPage={ITEMS_PER_PAGE}
        totalPages={totalPages}
        onEdit={openEdit}
        onDelete={setDeleteConfirm}
        onPageChange={setPage}
      />

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
        onClose={() => setShowModal(false)}
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