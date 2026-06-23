// pages/admin/Faqs.tsx
import React, { useEffect, useState, useCallback } from "react";
import {
  useFaqs,
  useFaqMutations,
  useFaqSearch,
  FAQ
} from "../../hooks/useFaqs";
import { useCategories } from "../../hooks/useCategories";
import { useChannels } from "../../hooks/useChannels";
import { FaqFormModal } from "../../components/faqs/FaqFormModal";

const Faqs: React.FC = () => {
  const { faqs, loading, refetch } = useFaqs();
  const { create, update, remove } = useFaqMutations();
  const { results, search } = useFaqSearch();
  const { categories } = useCategories();
  const { channels } = useChannels();

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<FAQ | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Show message toast
  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  // Handle search with debounce
  useEffect(() => {
    if (!searchTerm.trim()) return;

    const timeout = setTimeout(() => {
      search(searchTerm);
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchTerm, search]);

  // Open create modal
  const openCreate = () => {
    setEditingFaq(null);
    setShowModal(true);
  };

  // Open edit modal
  const openEdit = (faq: FAQ) => {
    setEditingFaq(faq);
    setShowModal(true);
  };

  // Handle create/update submit
  const handleSubmit = async (data: any) => {
    try {
      if (editingFaq) {
        await update(editingFaq.id, data);
        showMessage('success', 'FAQ updated successfully');
      } else {
        await create(data);
        showMessage('success', 'FAQ created successfully');
      }
      setShowModal(false);
      setEditingFaq(null);
      refetch();
    } catch (error: any) {
      console.error("Submit error:", error);
      showMessage('error', error?.response?.data?.message || 'Failed to save FAQ');
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await remove(deleteConfirm.id);
      showMessage('success', 'FAQ deleted successfully');
      refetch();
    } catch (error: any) {
      console.error("Delete error:", error);
      showMessage('error', error?.response?.data?.message || 'Failed to delete FAQ');
    } finally {
      setDeleteConfirm(null);
    }
  };

  // Determine which FAQs to display
  const displayFaqs = searchTerm.trim().length > 0 ? results : faqs;

  // Status badge component
  const StatusBadge = ({ isActive }: { isActive: boolean }) => {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isActive 
          ? 'bg-green-100 text-green-800' 
          : 'bg-gray-100 text-gray-800'
      }`}>
        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isActive ? 'bg-green-500' : 'bg-gray-500'}`} />
        {isActive ? 'Active' : 'Inactive'}
      </span>
    );
  };

  // Featured badge
  const FeaturedBadge = ({ isFeatured }: { isFeatured: boolean }) => {
    return isFeatured ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        Featured
      </span>
    ) : null;
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">FAQ Management</h1>
            <p className="text-gray-500 text-sm mt-1">Manage frequently asked questions</p>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New FAQ
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="mb-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>
        <div className="text-sm text-gray-500 self-center">
          {displayFaqs.length} {displayFaqs.length === 1 ? 'FAQ' : 'FAQs'} found
        </div>
      </div>

      {/* Message Toast */}
      {message && (
        <div className={`mb-4 p-3 rounded-lg flex items-center justify-between ${
          message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          <div className="flex items-center gap-2">
            {message.type === 'success' ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className="text-sm">{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-gray-400 hover:text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* FAQs Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-gray-500">Loading FAQs...</p>
          </div>
        ) : displayFaqs.length === 0 ? (
          <div className="text-center py-16">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mt-2 text-gray-500 font-medium">No FAQs found</p>
            {searchTerm ? (
              <button onClick={() => setSearchTerm("")} className="mt-2 text-blue-600 hover:underline text-sm">
                Clear search
              </button>
            ) : (
              <button onClick={openCreate} className="mt-2 text-blue-600 hover:underline text-sm">
                Create your first FAQ
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Question
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Channel
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {displayFaqs.map((faq) => (
                  <tr key={faq.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{faq.question}</p>
                          {faq.answer && (
                            <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                              {faq.answer.length > 100 ? faq.answer.substring(0, 100) + '...' : faq.answer}
                            </p>
                          )}
                          {faq.is_featured && (
                            <div className="mt-1">
                              <FeaturedBadge isFeatured={faq.is_featured} />
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {faq.category_name || faq.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {faq.channel_name || faq.channel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge isActive={faq.is_active} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {faq.views}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEdit(faq)}
                          className="text-yellow-600 hover:text-yellow-900 transition-colors p-1 rounded hover:bg-yellow-50"
                          title="Edit FAQ"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(faq)}
                          className="text-red-600 hover:text-red-900 transition-colors p-1 rounded hover:bg-red-50"
                          title="Delete FAQ"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-center text-gray-900 mb-2">Delete FAQ</h3>
            <p className="text-gray-500 text-center text-sm mb-6">
              Are you sure you want to delete <span className="font-medium text-gray-700">"{deleteConfirm.question}"</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Form Modal */}
      <FaqFormModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingFaq(null);
        }}
        onSubmit={handleSubmit}
        editingFaq={editingFaq}
        categories={categories}
        channels={channels}
      />
    </div>
  );
};

export default Faqs;