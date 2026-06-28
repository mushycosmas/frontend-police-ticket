import React, { useState, useCallback, useEffect } from "react";

import { useChannels } from "../../../hooks/useChannels";
import { useTeams } from "../../../hooks/useTeams";

import {
  createChannel,
  updateChannel,
  deleteChannel,
} from "../../../api/channelApi";

// ✅ FIX: correct type source
import { Channel } from "../../../types/channel";

import {
  ChannelHeader,
  ChannelSearch,
  ChannelTable,
  DeleteConfirmModal,
  MessageToast,
} from "../../../components/channels/ChannelComponents";

import { ChannelFormModal } from "../../../components/channels/ChannelFormModal";

export const Channels: React.FC = () => {
  const { channels, loading, error: loadError } = useChannels();
  const { teams, loading: teamsLoading } = useTeams();

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [editingChannel, setEditingChannel] = useState<Channel | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Channel | null>(null);

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // error handling
  useEffect(() => {
    if (loadError) {
      setMessage({ type: "error", text: loadError });
    }
  }, [loadError]);

  const showMessage = useCallback((type: any, text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  }, []);

  // =========================
  // CREATE / UPDATE
  // =========================
  const handleSubmit = useCallback(
    async (data: {
      name: string;
      status: "private" | "public";
      teamId: number;
    }) => {
      try {
        const payload = {
          name: data.name,
          status: data.status,
          teamId: data.teamId,
        };

        if (editingChannel) {
          await updateChannel(editingChannel.id, payload);
          showMessage("success", "Channel updated successfully");
        } else {
          await createChannel(payload);
          showMessage("success", "Channel created successfully");
        }

        setShowModal(false);
        setEditingChannel(null);

        window.location.reload(); // later replace with refetch
      } catch (error: any) {
        console.error(error);
        showMessage(
          "error",
          error.response?.data?.message || "Failed to save channel"
        );
      }
    },
    [editingChannel, showMessage]
  );

  // =========================
  // DELETE
  // =========================
  const handleDelete = useCallback(async () => {
    if (!deleteConfirm) return;

    try {
      await deleteChannel(deleteConfirm.id);
      showMessage("success", "Channel deleted successfully");
      window.location.reload();
    } catch (error: any) {
      showMessage("error", "Failed to delete channel");
    } finally {
      setDeleteConfirm(null);
    }
  }, [deleteConfirm, showMessage]);

  const filteredChannels = channels.filter((ch) =>
    ch.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">

      <ChannelHeader
        onNewChannel={() => {
          setEditingChannel(null);
          setShowModal(true);
        }}
      />

      <ChannelSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        totalCount={filteredChannels.length}
      />

      {message && (
        <MessageToast message={message} onClose={() => setMessage(null)} />
      )}

      <ChannelTable
        channels={filteredChannels}
        loading={loading}
        onEdit={(channel) => {
          setEditingChannel(channel);
          setShowModal(true);
        }}
        onDelete={setDeleteConfirm}
        onNewChannel={() => {
          setEditingChannel(null);
          setShowModal(true);
        }}
        onClearSearch={() => setSearchTerm("")}
      />

      <DeleteConfirmModal
        channel={deleteConfirm}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm(null)}
      />

      <ChannelFormModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingChannel(null);
        }}
        onSubmit={handleSubmit}
        editingChannel={editingChannel}
        teams={teams}
        loading={teamsLoading}
      />
    </div>
  );
};