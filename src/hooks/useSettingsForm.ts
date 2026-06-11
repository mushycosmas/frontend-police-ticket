import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export const useSettingsForm = () => {
  const { user } = useAuth();

  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    fullName: user?.first_name ?? "",
    email: user?.email ?? "",
    currentPassword: "",
    newPassword: "",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  return {
    user,
    form,
    setForm,
    saved,
    handleSave,
  };
};