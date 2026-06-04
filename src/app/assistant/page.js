"use client";
import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Bot, Send, User, Sparkles, FileText, HelpCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function AssistantPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm your AI study assistant. I can help you with:\n\n📚 **Generate study plans**\n📝 **Create study notes**\n❓ **Solve doubts**\n\nWhat would you like help with?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("chat");
  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState("");
  const [notes, setNotes] = useState("");
  const [notesLoading, setNotesLoading] = useState(false);
  const chatEnd = useRef(null);

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });
      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply || "Sorry, I could not process that.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error connecting to AI service." },
      ]);
    }
    setLoading(false);
  };

  const generateNotes = async () => {
    if (!topic || !subject) {
      toast.error("Enter both topic and subject");
      return;
    }
    setNotesLoading(true);
    try {
      const response = await fetch("/api/ai/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, subject }),
      });
      const data = await response.json();
      setNotes(data.notes || "Unable to generate notes.");
    } catch {
      setNotes("Error generating notes.");
    }
    setNotesLoading(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white">AI Assistant</h1>
        <p className="text-gray-400 mt-1">Your intelligent study companion</p>
      </div>

      <div className="flex gap-2 mb-4">
        {[
          { id: "chat", label: "Chat", icon: Bot },
          { id: "notes", label: "Notes", icon: FileText },
          { id: "doubts", label: "Doubts", icon: HelpCircle },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setMode(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              mode === id
                ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                : "bg-white/5 text-gray-400 border border-white/10 hover:text-white"
            }`}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {mode === "chat" && (
        <Card className="h-[600px] flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    msg.role === "user"
                      ? "bg-indigo-600/20 text-white border border-indigo-500/20"
                      : "bg-white/5 text-gray-300 border border-white/10"
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {msg.content}
                  </div>
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="flex gap-1">
                    <div
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEnd} />
          </div>
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your studies..."
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && sendMessage()
              }
              className="flex-1"
            />
            <Button onClick={sendMessage} disabled={loading || !input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}

      {mode === "notes" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">
              Generate Notes
            </h3>
            <div className="space-y-4">
              <Input
                label="Topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Photosynthesis"
              />
              <Input
                label="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Biology"
              />
              <Button
                onClick={generateNotes}
                disabled={notesLoading}
                className="w-full"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {notesLoading ? "Generating..." : "Generate Notes"}
              </Button>
            </div>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">
              Generated Notes
            </h3>
            {notes ? (
              <div className="prose prose-invert max-w-none text-gray-300 text-sm whitespace-pre-wrap">
                {notes}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500">
                  Enter a topic and subject to generate notes
                </p>
              </div>
            )}
          </Card>
        </div>
      )}

      {mode === "doubts" && (
        <Card>
          <h3 className="text-lg font-semibold text-white mb-2">
            Solve Your Doubts
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            Use the chat mode above or ask your question here and I'll explain
            step by step.
          </p>
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your doubt here..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1"
            />
            <Button
              onClick={() => {
                setMode("chat");
                sendMessage();
              }}
              disabled={!input.trim()}
            >
              <HelpCircle className="w-4 h-4 mr-2" /> Ask
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
