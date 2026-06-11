// src/api/issueTemplateApi.ts
import api from './axios';

// ======================
// TYPES
// ======================

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface IssueTemplate {
  id: number;
  name: string;
  description: string;
  category: Category | null;
  suggested_priority: 'low' | 'medium' | 'high' | 'critical' | '';
  steps_to_reproduce: string;
  is_active?: boolean;
  order?: number;
}

export interface IssueTemplateCreate {
  name: string;
  description: string;
  category?: number | null;
  suggested_priority?: string | null;
  steps_to_reproduce?: string;
}

export interface IssueTemplateUpdate extends Partial<IssueTemplateCreate> {}

// ======================
// API FUNCTIONS
// ======================

/**
 * Get all active issue templates (for ticket creation)
 */
export const getIssueTemplates = () =>
  api.get<IssueTemplate[]>('/tickets/issue-templates/');

/**
 * Get a single issue template by ID
 */
export const getIssueTemplate = (id: number) =>
  api.get<IssueTemplate>(`/tickets/issue-templates/${id}/`);

/**
 * Create a new issue template (admin only)
 */
export const createIssueTemplate = (data: IssueTemplateCreate) =>
  api.post<IssueTemplate>('/tickets/issue-templates/', data);

/**
 * Update an existing issue template (admin only)
 */
export const updateIssueTemplate = (id: number, data: IssueTemplateUpdate) =>
  api.patch<IssueTemplate>(`/tickets/issue-templates/${id}/`, data);

/**
 * Delete an issue template (admin only)
 */
export const deleteIssueTemplate = (id: number) =>
  api.delete(`/tickets/issue-templates/${id}/`);

// ======================
// HELPER FUNCTIONS
// ======================

/**
 * Apply placeholders like {user_name} in template text
 */
export const applyTemplatePlaceholders = (
  text: string,
  replacements: Record<string, string>
): string => {
  let result = text;
  Object.entries(replacements).forEach(([key, value]) => {
    result = result.replace(new RegExp(`{${key}}`, 'g'), value);
  });
  return result;
};