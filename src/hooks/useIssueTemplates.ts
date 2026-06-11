import { useState, useCallback, useEffect } from "react";

import {
  getIssueTemplates,
  getIssueTemplate,
  createIssueTemplate,
  updateIssueTemplate,
  deleteIssueTemplate,
  IssueTemplate as ApiIssueTemplate,
  Category as ApiCategory,
} from "../api/issueTemplateApi";

import { getCategories } from "../api/categoryApi";
import { getPriorities } from "../api/priorityApi";
import { getChannels, Channel } from "../api/channelApi";

// ======================
// TYPES
// ======================
export type IssueTemplate = ApiIssueTemplate;
export type Category = ApiCategory;

export interface Priority {
  id: number;
  name: string;
}

// 🔥 FIXED FORM (NO priority_id ANYMORE)
export interface TemplateForm {
  name: string;
  description: string;

  category_id: string;
  suggested_priority: string;   // ✅ ONLY THIS

  channel_ids: number[];

  steps_to_reproduce: string;
}

// ======================
// HELPERS
// ======================
const normalizeList = (res: any) => {
  if (Array.isArray(res?.data?.results)) return res.data.results;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res)) return res;
  return [];
};

// ======================
// HOOK
// ======================
export const useIssueTemplates = () => {
  const [templates, setTemplates] = useState<IssueTemplate[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingPriorities, setLoadingPriorities] = useState(true);
  const [loadingChannels, setLoadingChannels] = useState(true);

  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // ======================
  // MESSAGE
  // ======================
  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const clearMessage = () => setMessage(null);

  // ======================
  // LOAD DATA
  // ======================
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setLoadingCategories(true);
      setLoadingPriorities(true);
      setLoadingChannels(true);

      const [
        templatesRes,
        categoriesRes,
        prioritiesRes,
        channelsRes,
      ] = await Promise.all([
        getIssueTemplates(),
        getCategories(),
        getPriorities(),
        getChannels(),
      ]);

      setTemplates(normalizeList(templatesRes));
      setCategories(normalizeList(categoriesRes));
      setPriorities(normalizeList(prioritiesRes));
      setChannels(normalizeList(channelsRes));
    } catch (error) {
      console.error("Load error:", error);
      showMessage("error", "Failed to load data");
    } finally {
      setLoading(false);
      setLoadingCategories(false);
      setLoadingPriorities(false);
      setLoadingChannels(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ======================
  // SAVE TEMPLATE
  // ======================
  const saveTemplate = async (
    form: TemplateForm,
    editing: IssueTemplate | null
  ) => {
    if (!form.name.trim()) {
      showMessage("error", "Name is required");
      return false;
    }

    if (!form.channel_ids || form.channel_ids.length === 0) {
      showMessage("error", "Select at least one channel");
      return false;
    }

    try {
      setSaving(true);

      const payload = {
        name: form.name,
        description: form.description,

        category: form.category_id ? Number(form.category_id) : null,

        // 🔥 FIXED HERE (NO priority_id ANYMORE)
        suggested_priority: form.suggested_priority
          ? Number(form.suggested_priority)
          : null,

        channels: form.channel_ids,

        steps_to_reproduce: form.steps_to_reproduce,
      };

      if (editing) {
        await updateIssueTemplate(editing.id, payload);
        showMessage("success", "Updated successfully");
      } else {
        await createIssueTemplate(payload);
        showMessage("success", "Created successfully");
      }

      await loadData();
      return true;
    } catch (error: any) {
      console.error("Save error:", error);
      showMessage(
        "error",
        error?.response?.data?.message || "Save failed"
      );
      return false;
    } finally {
      setSaving(false);
    }
  };

  // ======================
  // DELETE
  // ======================
  const deleteTemplate = async (template: IssueTemplate) => {
    try {
      await deleteIssueTemplate(template.id);
      showMessage("success", "Deleted successfully");
      await loadData();
      return true;
    } catch (error) {
      console.error("Delete error:", error);
      showMessage("error", "Delete failed");
      return false;
    }
  };

  // ======================
  // FETCH SINGLE
  // ======================
  const fetchTemplate = async (id: number) => {
    try {
      const res = await getIssueTemplate(id);
      return res.data;
    } catch (error) {
      showMessage("error", "Failed to load template");
      return null;
    }
  };

  // ======================
  // RETURN
  // ======================
  return {
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

    loadData,
    saveTemplate,
    deleteTemplate,
    fetchTemplate,

    showMessage,
    clearMessage,
  };
};