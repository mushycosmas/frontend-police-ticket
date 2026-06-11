import api from "./axios";

// ======================
// TYPES
// ======================

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface Priority {
  id: number;
  name: string;
  color?: string;
}

export interface Channel {
  id: number;
  name: string;
}

// ======================
// ISSUE TEMPLATE (MATCH BACKEND)
// ======================
export interface IssueTemplate {
  id: number;
  name: string;
  description: string;

  // FK IDs (backend uses IDs)
  category: number | null;
  category_name?: string;

  suggested_priority: number | null;
  priority_name?: string;

  channels: number[];
  channel_names?: string[];

  steps_to_reproduce: string;
  is_active?: boolean;
  created_at?: string;
}

// ======================
// CREATE / UPDATE
// ======================
export interface IssueTemplateCreate {
  name: string;
  description: string;

  category?: number | null;
  suggested_priority?: number | null;

  channels?: number[];

  steps_to_reproduce?: string;
}

export interface IssueTemplateUpdate
  extends Partial<IssueTemplateCreate> {}

// ======================
// PAGINATED RESPONSE
// ======================
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ======================
// API CALLS
// ======================

// GET ALL
export const getIssueTemplates = () =>
  api.get<PaginatedResponse<IssueTemplate>>(
    "/tickets/issue-templates/"
  );

// GET ONE
export const getIssueTemplate = (id: number) =>
  api.get<IssueTemplate>(
    `/tickets/issue-templates/${id}/`
  );

// CREATE
export const createIssueTemplate = (data: IssueTemplateCreate) =>
  api.post<IssueTemplate>(
    "/tickets/issue-templates/",
    data
  );

// UPDATE
export const updateIssueTemplate = (
  id: number,
  data: IssueTemplateUpdate
) =>
  api.patch<IssueTemplate>(
    `/tickets/issue-templates/${id}/`,
    data
  );

// DELETE
export const deleteIssueTemplate = (id: number) =>
  api.delete(`/tickets/issue-templates/${id}/`);