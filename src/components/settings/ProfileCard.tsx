import React from "react";
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import { getRoleLabel } from "../../utils/helpers";

interface Props {
  user: any;
  form: any;
  setForm: React.Dispatch<React.SetStateAction<any>>;
  onSave: (e: React.FormEvent) => void;
}

export const ProfileCard: React.FC<Props> = ({
  user,
  form,
  setForm,
  onSave,
}) => {
  return (
    <div className="card">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-2xl bg-brand-primary flex items-center justify-center shadow-md">
          <span className="text-white text-2xl font-bold">
            {user?.fullName?.charAt(0).toUpperCase()}
          </span>
        </div>

        <div>
          <p className="text-lg font-bold text-brand-primary">
            {user?.fullName}
          </p>

          <p className="text-sm text-brand-muted">
            {user?.email}
          </p>

          <span className="inline-block mt-1 px-2.5 py-0.5 bg-brand-gray text-brand-primary text-xs font-semibold rounded-full border border-brand-border">
            {getRoleLabel(user?.role ?? "")}
          </span>
        </div>
      </div>

      <form onSubmit={onSave} className="space-y-4">

        {/* Profile Inputs */}

        {/* Password Inputs */}

        <div className="flex justify-end">
          <Button type="submit">
            Save Changes
          </Button>
        </div>

      </form>
    </div>
  );
};