"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Plus, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { getStatusColor, getStatusLabel } from "@/utils/helpers";

export default function SubjectDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [subject, setSubject] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [editTopic, setEditTopic] = useState(null);
  const [topicForm, setTopicForm] = useState({
    name: "",
    description: "",
    status: "pending",
  });
  const supabase = createClient();

  const load = async () => {
    const { data: subj } = await supabase
      .from("subjects")
      .select("*")
      .eq("id", id)
      .single();
    const { data: t } = await supabase
      .from("topics")
      .select("*")
      .eq("subject_id", id)
      .order("created_at", { ascending: true });
    setSubject(subj);
    setTopics(t || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleTopicSubmit = async (e) => {
    e.preventDefault();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (editTopic) {
      const { error } = await supabase
        .from("topics")
        .update(topicForm)
        .eq("id", editTopic.id);
      if (error) toast.error(error.message);
      else toast.success("Topic updated");
    } else {
      const { error } = await supabase
        .from("topics")
        .insert({ ...topicForm, subject_id: id, user_id: user.id });
      if (error) toast.error(error.message);
      else toast.success("Topic added");
    }
    setShowTopicModal(false);
    setEditTopic(null);
    setTopicForm({ name: "", description: "", status: "pending" });
    load();
  };

  const handleDeleteTopic = async (topicId) => {
    if (!confirm("Delete this topic?")) return;
    const { error } = await supabase.from("topics").delete().eq("id", topicId);
    if (error) toast.error(error.message);
    else toast.success("Topic deleted");
    load();
  };

  const handleRevisionToggle = async (topicId, revision) => {
    const topic = topics.find((t) => t.id === topicId);

    if (!topic) return;

    const updatedTopic = {
      ...topic,
      [revision]: !topic[revision],
    };

    const allDone =
      updatedTopic.revision_1 &&
      updatedTopic.revision_2 &&
      updatedTopic.revision_3;

    const anyDone =
      updatedTopic.revision_1 ||
      updatedTopic.revision_2 ||
      updatedTopic.revision_3;

    let status = "pending";

    if (allDone) {
      status = "completed";
    } else if (anyDone) {
      status = "in_progress";
    }

    const { error } = await supabase
      .from("topics")
      .update({
        revision_1: updatedTopic.revision_1,
        revision_2: updatedTopic.revision_2,
        revision_3: updatedTopic.revision_3,
        status,
      })
      .eq("id", topicId);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Revision updated");
      load();
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <button
        onClick={() => router.push("/subjects")}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Subjects
      </button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">{subject?.name}</h1>
          {subject?.description && (
            <p className="text-gray-400 mt-1">{subject.description}</p>
          )}
        </div>
        <Button
          onClick={() => {
            setEditTopic(null);
            setTopicForm({ name: "", description: "", status: "pending" });
            setShowTopicModal(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" /> Add Topic
        </Button>
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-white mb-4">Topics</h2>
        {topics.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            No topics yet. Add your first topic.
          </p>
        ) : (
          <div className="space-y-2">
            {topics.map((topic) => (
              <div
                key={topic.id}
                className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-white font-medium">{topic.name}</h3>
                    <Badge
                      variant={
                        topic.status === "completed"
                          ? "success"
                          : topic.status === "in_progress"
                            ? "info"
                            : "warning"
                      }
                    >
                      {getStatusLabel(topic.status)}
                    </Badge>
                  </div>
                  {topic.description && (
                    <p className="text-gray-400 text-sm mt-1">
                      {topic.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    {["revision_1", "revision_2", "revision_3"].map(
                      (rev, idx) => (
                        <button
                          key={rev}
                          onClick={() => handleRevisionToggle(topic.id, rev)}
                          className={`text-xs px-2 py-1 rounded-lg border transition-all ${
                            topic[rev]
                              ? "bg-green-500/10 text-green-400 border-green-500/30"
                              : "bg-white/5 text-gray-500 border-white/10 hover:text-gray-300"
                          }`}
                        >
                          R{idx + 1} {topic[rev] ? "✓" : ""}
                        </button>
                      ),
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditTopic(topic);
                      setTopicForm({
                        name: topic.name,
                        description: topic.description || "",
                        status: topic.status,
                      });
                      setShowTopicModal(true);
                    }}
                    className="text-gray-500 hover:text-white p-1"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteTopic(topic.id)}
                    className="text-gray-500 hover:text-red-400 p-1"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal
        isOpen={showTopicModal}
        onClose={() => setShowTopicModal(false)}
        title={editTopic ? "Edit Topic" : "Add Topic"}
      >
        <form onSubmit={handleTopicSubmit} className="space-y-4">
          <Input
            label="Topic Name"
            value={topicForm.name}
            onChange={(e) =>
              setTopicForm({ ...topicForm, name: e.target.value })
            }
            placeholder="e.g. Calculus"
            required
          />
          <Input
            label="Description (optional)"
            value={topicForm.description}
            onChange={(e) =>
              setTopicForm({ ...topicForm, description: e.target.value })
            }
            placeholder="Brief description"
          />
          {editTopic && (
            <Select
              label="Status"
              value={topicForm.status}
              onChange={(e) =>
                setTopicForm({ ...topicForm, status: e.target.value })
              }
              options={statusOptions}
            />
          )}
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowTopicModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit">{editTopic ? "Update" : "Add Topic"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
