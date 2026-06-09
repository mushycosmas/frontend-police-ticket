import React, { useEffect, useState } from "react";
import { Role } from "../../pages/admin/Roles";

/* =========================
   TYPES
========================= */
type RoleForm = {
  name: string;
  description: string;
  is_active: boolean;
};

interface Props {
  editMode: boolean;
  role: Role | null;
  onClose: () => void;
  onSave: (data: RoleForm) => void;
}

/* =========================
   COMPONENT
========================= */
const RoleFormModal: React.FC<Props> = ({
  editMode,
  role,
  onClose,
  onSave,
}) => {
  const [form, setForm] = useState<RoleForm>({
    name: "",
    description: "",
    is_active: true,
  });

  /* =========================
     LOAD ROLE INTO FORM
  ========================= */
  useEffect(() => {
    if (role) {
      setForm({
        name: role.name || "",
        description: role.description || "",
        is_active: role.is_active ?? true,
      });
    } else {
      setForm({
        name: "",
        description: "",
        is_active: true,
      });
    }
  }, [role]);

  /* =========================
     HANDLE CHANGE
  ========================= */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      is_active: e.target.checked,
    }));
  };

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = () => {
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-5 w-96 rounded-lg shadow-lg">

        {/* TITLE */}
        <h3 className="text-lg font-semibold mb-4">
          {editMode ? "Edit Role" : "Create Role"}
        </h3>

        {/* NAME */}
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Role Name"
          className="border w-full p-2 rounded mb-3"
        />

        {/* DESCRIPTION */}
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="border w-full p-2 rounded mb-3"
        />

        {/* ACTIVE */}
        <label className="flex items-center gap-2 mb-3">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={handleCheckbox}
          />
          Active
        </label>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-3 py-2 bg-blue-600 text-white rounded"
          >
            Save
          </button>
        </div>

      </div>
    </div>
  );
};

export default RoleFormModal;