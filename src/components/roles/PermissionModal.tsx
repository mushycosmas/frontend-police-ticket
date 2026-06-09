import React, { useMemo, useState, useCallback } from "react";
import { Role, Permission } from "../../pages/admin/Roles";

interface Props {
  role: Role;
  permissions: Permission[];
  selectedPermissions: number[];
  setSelectedPermissions: (ids: number[]) => void;
  onClose: () => void;
  onSave: (ids: number[]) => void;
  saving?: boolean;
}

const PermissionModal: React.FC<Props> = ({
  role,
  permissions,
  selectedPermissions,
  setSelectedPermissions,
  onClose,
  onSave,
  saving = false,
}) => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Get permission category from codename
  const getPermissionCategory = useCallback((codename: string): string => {
    const parts = codename.split('_');
    if (parts.length > 1) {
      const modelName = parts.slice(1).join(' ');
      return modelName.charAt(0).toUpperCase() + modelName.slice(1);
    }
    return "General";
  }, []);

  // Get permission action (add, view, change, delete)
  const getPermissionAction = useCallback((codename: string) => {
    const action = codename.split('_')[0];
    const actionConfig: Record<string, { label: string; color: string; bgColor: string }> = {
      add: { label: "Create", color: "text-green-700", bgColor: "bg-green-50 border-green-200" },
      view: { label: "View", color: "text-blue-700", bgColor: "bg-blue-50 border-blue-200" },
      change: { label: "Edit", color: "text-orange-700", bgColor: "bg-orange-50 border-orange-200" },
      delete: { label: "Delete", color: "text-red-700", bgColor: "bg-red-50 border-red-200" },
    };
    return actionConfig[action] || { 
      label: action.charAt(0).toUpperCase() + action.slice(1), 
      color: "text-gray-700", 
      bgColor: "bg-gray-50 border-gray-200" 
    };
  }, []);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    permissions.forEach((p) => {
      cats.add(getPermissionCategory(p.codename));
    });
    return Array.from(cats).sort();
  }, [permissions, getPermissionCategory]);

  // Filter permissions based on search and category
  const filteredPermissions = useMemo(() => {
    let filtered = permissions.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.codename.toLowerCase().includes(search.toLowerCase())
    );
    
    if (activeCategory !== "all") {
      filtered = filtered.filter((p) => {
        const category = getPermissionCategory(p.codename);
        return category === activeCategory;
      });
    }
    
    return filtered;
  }, [permissions, search, activeCategory, getPermissionCategory]);

  // Group permissions by category
  const groupedPermissions = useMemo(() => {
    const grouped: Record<string, Permission[]> = {};
    filteredPermissions.forEach((permission) => {
      const category = getPermissionCategory(permission.codename);
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(permission);
    });
    return grouped;
  }, [filteredPermissions, getPermissionCategory]);

  const togglePermission = useCallback(
    (id: number) => {
      setSelectedPermissions(
        selectedPermissions.includes(id)
          ? selectedPermissions.filter((p) => p !== id)
          : [...selectedPermissions, id]
      );
    },
    [selectedPermissions, setSelectedPermissions]
  );

  const selectAll = () => {
    setSelectedPermissions(permissions.map((p) => p.id));
  };

  const clearAll = () => {
    setSelectedPermissions([]);
  };

  const selectedCount = selectedPermissions.length;
  const totalCount = permissions.length;
  const selectedPercentage = totalCount > 0 ? (selectedCount / totalCount) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">

        {/* HEADER with Gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-5 rounded-t-2xl flex-shrink-0">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <h2 className="text-xl font-bold">Manage Permissions</h2>
              </div>
              <p className="text-blue-100">
                Role: <span className="font-semibold text-white">{role.name}</span>
                {role.description && <span className="text-blue-200"> — {role.description}</span>}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-all text-2xl leading-none hover:scale-110"
            >
              ✕
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* Stats Bar */}
          <div className="mb-5 bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex flex-wrap justify-between items-center gap-3">
              <div className="flex gap-6">
                <div>
                  <span className="text-xs text-gray-500 uppercase">Total</span>
                  <p className="text-2xl font-bold text-blue-600">{totalCount}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase">Selected</span>
                  <p className="text-2xl font-bold text-green-600">{selectedCount}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase">Remaining</span>
                  <p className="text-2xl font-bold text-orange-600">{totalCount - selectedCount}</p>
                </div>
              </div>
              <div className="flex-1 max-w-xs">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
                    style={{ width: `${selectedPercentage}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1 text-right">{Math.round(selectedPercentage)}% selected</p>
              </div>
            </div>
          </div>

          {/* Search and Actions */}
          <div className="flex flex-col lg:flex-row gap-4 mb-5">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" 
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search permissions by name or codename..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={selectAll}
                className="px-4 py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 rounded-xl transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Select All
              </button>
              <button
                onClick={clearAll}
                className="px-4 py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 rounded-xl transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear All
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          {categories.length > 0 && (
            <div className="mb-5 overflow-x-auto">
              <div className="flex gap-2 pb-2">
                <button
                  onClick={() => setActiveCategory("all")}
                  className={`px-4 py-2 text-sm font-medium rounded-xl transition-all whitespace-nowrap ${
                    activeCategory === "all"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All ({permissions.length})
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 text-sm font-medium rounded-xl transition-all whitespace-nowrap ${
                      activeCategory === category
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Permissions List */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            {filteredPermissions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <svg className="w-16 h-16 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-500 font-medium">No permissions found</p>
                <p className="text-gray-400 text-sm mt-1">
                  {search ? "Try adjusting your search" : "No permissions available"}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                {Object.entries(groupedPermissions).map(([category, perms]) => (
                  <div key={category} className="p-4 hover:bg-gray-50/50">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
                      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        {category}
                      </h3>
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                        {perms.length}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {perms.map((permission) => {
                        const action = getPermissionAction(permission.codename);
                        const isSelected = selectedPermissions.includes(permission.id);
                        
                        return (
                          <label
                            key={permission.id}
                            className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                              isSelected
                                ? `${action.bgColor} ring-2 ring-blue-400 shadow-sm`
                                : 'bg-white hover:shadow-md hover:border-gray-300'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => togglePermission(permission.id)}
                              className="mt-0.5 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 accent-blue-600 cursor-pointer"
                            />
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center flex-wrap gap-2 mb-1">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${action.color} bg-white shadow-sm`}>
                                  {action.label}
                                </span>
                                <p className="text-sm font-medium text-gray-800 truncate">
                                  {permission.name}
                                </p>
                              </div>
                              <p className="text-xs text-gray-500 font-mono break-all">
                                {permission.codename}
                              </p>
                            </div>
                            
                            {isSelected && (
                              <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex flex-col sm:flex-row justify-between items-center gap-3 flex-shrink-0">
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-blue-600">{selectedCount}</span> of{' '}
            <span className="font-semibold">{totalCount}</span> permissions selected
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-white border border-gray-300 hover:bg-gray-50 rounded-xl transition-all font-medium text-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(selectedPermissions)}
              disabled={saving}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md"
            >
              {saving ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Permissions
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionModal;