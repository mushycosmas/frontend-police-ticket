import React from "react";
import { useSettingsForm } from "../hooks/useSettingsForm";

import { SettingsHeader } from "../components/settings/SettingsHeader";
import { SettingsAlert } from "../components/settings/SettingsAlert";
import { ProfileCard } from "../components/settings/ProfileCard";
import { PreferencesCard } from "../components/settings/PreferencesCard";
import { SLAPolicyCard } from "../components/settings/SLAPolicyCard";

export const Settings = () => {
  const {
    user,
    form,
    setForm,
    saved,
    handleSave,
  } = useSettingsForm();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <SettingsHeader />

      <SettingsAlert show={saved} />

      <ProfileCard
        user={user}
        form={form}
        setForm={setForm}
        onSave={handleSave}
      />

      <PreferencesCard />

      <SLAPolicyCard />
    </div>
  );
};

export default Settings;