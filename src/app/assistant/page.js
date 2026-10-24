import { useState, useRef, useEffect } from "react";
import { API_BASE, authHeaders } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Bot, Send, User, Sparkles, FileText, HelpCircle, Copy, Check, Download } from "lucide-react";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Renders AI markdown with styled elements matching the dark theme
function MarkdownMessage({ content }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // Headings
        h1: ({ children }) => (
          <h1 className="text-base font-bold text-white mt-3 mb-1">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-sm font-bold text-white mt-3 mb-1">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-sm font-semibold text-indigo-300 mt-2 mb-1">{children}</h3>
        ),
        // Paragraph — tight spacing
        p: ({ children }) => (
          <p className="text-sm text-gray-300 leading-relaxed mb-2 last:mb-0">{children}</p>
        ),
        // Bold
        strong: ({ children }) => (
          <strong className="font-semibold text-white">{children}</strong>
        ),
        // Italic
        em: ({ children }) => (
          <em className="italic text-gray-200">{children}</em>
        ),
        // Unordered list
        ul: ({ children }) => (
          <ul className="list-none space-y-1 my-2 pl-1">{children}</ul>
        ),
        // Ordered list
        ol: ({ children }) => (
          <ol className="list-decimal list-inside space-y-1 my-2 pl-1">{children}</ol>
        ),
        // List item — custom bullet
        li: ({ children }) => (
          <li className="flex items-start gap-2 text-sm text-gray-300">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
            <span>{children}</span>
          </li>
        ),
        // Inline code
        code: ({ inline, children }) =>
          inline ? (
            <code className="px-1.5 py-0.5 rounded bg-white/10 text-indigo-300 text-xs font-mono">
              {children}
            </code>
          ) : (
            <code className="block text-xs font-mono text-green-300 bg-black/40 rounded-lg p-3 my-2 overflow-x-auto whitespace-pre">
              {children}
            </code>
          ),
        // Code block wrapper
        pre: ({ children }) => <>{children}</>,
        // Horizontal rule
        hr: () => <hr className="border-white/10 my-3" />,
        // Blockquote
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-indigo-500 pl-3 my-2 text-gray-400 italic text-sm">
            {children}
          </blockquote>
        ),
        // Table
        table: ({ children }) => (
          <div className="overflow-x-auto my-3">
            <table className="w-full text-xs border-collapse">{children}</table>
          </div>
        ),
        th: ({ children }) => (
          <th className="px-3 py-1.5 text-left text-white font-semibold bg-white/10 border border-white/10">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-3 py-1.5 text-gray-300 border border-white/10">{children}</td>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

// Copy button for assistant messages
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handle = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={handle}
      className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto mt-1 p-1 rounded text-gray-600 hover:text-gray-300"
      title="Copy"
    >
      {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
    </button>
  );
}

export default function AssistantPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm **Sage** — your academic assistant.\n\nAsk me to:\n- Explain any concept\n- Solve a doubt step by step\n- Summarise a topic\n- Help with exam prep\n\n*I only answer study-related questions.*",
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
      const response = await fetch(`${API_BASE}/api/ai/chat`, {
        method: "POST",
        headers: await authHeaders(),
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });
      let data
      try { data = await response.json() } catch { throw new Error('server_down') }
      const content = response.status === 401
        ? "Your session has expired. Please sign in again."
        : data.reply || "Sorry, I could not process that.";
      setMessages((prev) => [...prev, { role: "assistant", content }]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: e.message === 'server_down'
            ? "**AI server is not running.**\n\nOpen a new terminal and run:\n```\nnpm run server\n```\nThen try again."
            : "Error connecting to AI service.",
        },
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
      const response = await fetch(`${API_BASE}/api/ai/notes`, {
        method: "POST",
        headers: await authHeaders(),
        body: JSON.stringify({ topic, subject }),
      });
      const data = await response.json();
      setNotes(response.status === 401
        ? "Your session has expired. Please sign in again."
        : data.notes || "Unable to generate notes.");
    } catch {
      setNotes("Error generating notes.");
    }
    setNotesLoading(false);
  };

  const downloadNotesPDF = async () => {
    if (!notes) return;
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 15;
      const maxWidth = pageWidth - 2 * margin;

      // Title
      doc.setFontSize(16);
      doc.setFont(undefined, "bold");
      doc.text(`${subject || "Study"} – ${topic || "Notes"}`, margin, 20);

      // Subtitle
      doc.setFontSize(10);
      doc.setFont(undefined, "normal");
      doc.setTextColor(100);
      doc.text(`Generated by Sage — StudyAI`, margin, 27);
      doc.setTextColor(0);

      // Strip markdown for plain-text PDF (basic cleanup)
      let plainText = notes
        .replace(/#{1,6}\s?/g, "") // Remove headings
        .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold
        .replace(/\*(.*?)\*/g, "$1") // Remove italic
        .replace(/`{1,3}(.*?)`{1,3}/g, "$1") // Remove code backticks
        .replace(/^\s*[-*+]\s+/gm, "• ") // Convert lists to bullets
        .replace(/^\s*\d+\.\s+/gm, (match) => match); // Keep numbered lists

      // Split text into lines and wrap
      doc.setFontSize(11);
      const lines = doc.splitTextToSize(plainText, maxWidth);
      let y = 35;

      lines.forEach((line) => {
        if (y > doc.internal.pageSize.getHeight() - 20) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, margin, y);
        y += 6;
      });

      doc.save(`${subject || "Study"}_${topic || "Notes"}.pdf`);
      toast.success("PDF downloaded!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white">Sage</h1>
        <p className="text-gray-400 mt-1">Your intelligent academic assistant</p>
      </div>

      {/* Mode tabs */}
      <div className="flex gap-2">
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

      {/* ── Chat mode ── */}
      {mode === "chat" && (
        <Card className="h-[600px] flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={`group max-w-[82%] px-4 py-3 rounded-2xl ${
                    msg.role === "user"
                      ? "bg-indigo-600/20 text-white border border-indigo-500/20"
                      : "bg-white/5 border border-white/10"
                  }`}
                >
                  {msg.role === "user" ? (
                    <p className="text-sm text-white leading-relaxed">{msg.content}</p>
                  ) : (
                    <div className="flex flex-col">
                      <MarkdownMessage content={msg.content} />
                      <CopyButton text={msg.content} />
                    </div>
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-4 h-4 text-gray-300" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                  <div className="flex gap-1.5 items-center h-4">
                    {[0, 150, 300].map((delay) => (
                      <div
                        key={delay}
                        className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"
                        style={{ animationDelay: `${delay}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEnd} />
          </div>

          {/* Input */}
          <div className="flex gap-2 pt-3 border-t border-white/[0.06]">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your studies..."
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              className="flex-1"
            />
            <Button onClick={sendMessage} disabled={loading || !input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* ── Notes mode ── */}
      {mode === "notes" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Generate Notes</h3>
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
              <Button onClick={generateNotes} disabled={notesLoading} className="w-full">
                <Sparkles className="w-4 h-4 mr-2" />
                {notesLoading ? "Generating..." : "Generate Notes"}
              </Button>
            </div>
          </Card>
          <Card className="overflow-y-auto max-h-[500px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Generated Notes</h3>
              {notes && (
                <button
                  onClick={downloadNotesPDF}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all"
                >
                  <Download className="w-3.5 h-3.5" /> Download PDF
                </button>
              )}
            </div>
            {notes ? (
              <MarkdownMessage content={notes} />
            ) : (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500">Enter a topic and subject to generate notes</p>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* ── Doubts mode ── */}
      {mode === "doubts" && (
        <Card>
          <h3 className="text-lg font-semibold text-white mb-2">Solve Your Doubts</h3>
          <p className="text-gray-400 text-sm mb-4">
            Type your doubt and I&apos;ll explain it step by step.
          </p>
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. Why does current flow from high to low potential?"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setMode("chat");
                  setTimeout(sendMessage, 0);
                }
              }}
              className="flex-1"
            />
            <Button
              onClick={() => { setMode("chat"); setTimeout(sendMessage, 0); }}
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
