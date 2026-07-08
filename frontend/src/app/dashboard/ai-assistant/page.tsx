"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Bot,
  Send,
  Trash2,
  Sparkles,
  AlertTriangle,
  Loader2,
  ThumbsUp,
  ThumbsDown,
  Copy,
  RotateCcw,
  Check,
  Droplet,
  ThermometerSnowflake,
  Activity,
  XCircle,
  Wrench,
  FileText,
  Home,
  Layers,
  ShieldCheck,
  ChevronRight,
  X,
  Plus,
  Search,
  MessageSquare,
  Edit2,
  Pin,
  Menu,
  Paperclip,
  Mic
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

interface Message {
  id: string;
  role: "system" | "user" | "assistant";
  content: string;
  modelUsed?: string;
  timestamp: Date;
  isTypingEnabled?: boolean;
}

interface ChatResponse {
  content: string;
  modelUsed: string;
  conversationId: string;
}

interface AiApplianceContext {
  name: string;
  brand?: string | null;
  model?: string | null;
  purchaseDate?: string | null;
  warrantyExpiry?: string | null;
  maintenance?: string | null;
}

interface AiRoomContext {
  name: string;
  appliances: AiApplianceContext[];
}

interface AiContextResponse {
  homeName?: string | null;
  homeType?: string | null;
  roomsCount: number;
  appliancesCount: number;
  warrantyTracking: boolean;
  rooms: AiRoomContext[];
}

interface ConversationSummary {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

interface ConversationDetail {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: {
    role: string;
    content: string;
    timestamp: string;
  }[];
}

interface SuggestedAction {
  label: string;
  actionType: "book" | "reminder" | "schedule" | "note";
  description: string;
}

const PRESETS = [
  {
    label: "Diagnose my AC",
    desc: "Troubleshoot cooling or airflow issues",
    prompt: "My air conditioner is blowing warm air instead of cool air. How can I diagnose and troubleshoot this?",
    icon: Droplet,
    color: "from-blue-500/10 to-indigo-500/10 text-blue-600 hover:border-blue-300"
  },
  {
    label: "Check refrigerator cooling",
    desc: "Verify fridge/freezer temp imbalances",
    prompt: "The refrigerator compartment is warm but the freezer is cold. What should I check to diagnose the cooling issue?",
    icon: ThermometerSnowflake,
    color: "from-sky-500/10 to-blue-500/10 text-sky-600 hover:border-sky-300"
  },
  {
    label: "Washing machine maintenance",
    desc: "Step-by-step drum & filter cleanup guide",
    prompt: "What is the step-by-step process to clean the drum, filter, and seal of a front-load washing machine?",
    icon: Wrench,
    color: "from-emerald-500/10 to-teal-500/10 text-emerald-600 hover:border-emerald-300"
  },
  {
    label: "Decode appliance error code",
    desc: "Get troubleshooting steps for fault codes",
    prompt: "My dishwasher is displaying error code E15 and won't start. What does this mean and how do I troubleshoot it?",
    icon: AlertTriangle,
    color: "from-rose-500/10 to-orange-500/10 text-rose-600 hover:border-rose-300"
  },
  {
    label: "Warranty advice",
    desc: "Understand claims coverage guidelines",
    prompt: "How can I verify if an appliance is still under warranty, and what documents do I need to make a claim?",
    icon: FileText,
    color: "from-amber-500/10 to-yellow-500/10 text-amber-600 hover:border-amber-300"
  },
  {
    label: "Energy saving tips",
    desc: "Optimize power consumption on appliances",
    prompt: "What are some practical energy-saving tips to reduce electricity bills on my heavy home appliances?",
    icon: Sparkles,
    color: "from-indigo-500/10 to-purple-500/10 text-indigo-600 hover:border-indigo-300"
  }
];

function CodeBlock({ language, value }: { language: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <div className="relative my-4 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 text-slate-100 font-mono text-xs md:text-sm shadow-lg">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800 bg-slate-950 text-[10px] md:text-xs text-slate-400">
        <span>{language ? language.toUpperCase() : "CODE"}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-bold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="m-0 leading-normal scrollbar-thin">
          <code>{value}</code>
        </pre>
      </div>
    </div>
  );
}

const markdownComponents = {
  code({ className, children, ...props }: any) {
    const match = /language-(\w+)/.exec(className || "");
    const isInline = !className || !className.startsWith("language-");
    const codeContent = String(children).replace(/\n$/, "");

    return !isInline ? (
      <CodeBlock language={match ? match[1] : ""} value={codeContent} />
    ) : (
      <code className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 font-mono text-xs md:text-sm" {...props}>
        {children}
      </code>
    );
  },
  table({ children }: any) {
    return (
      <div className="my-4 overflow-x-auto rounded-2xl border border-slate-200 shadow-sm max-w-full scrollbar-thin">
        <table className="min-w-full divide-y divide-slate-200 text-xs md:text-sm">
          {children}
        </table>
      </div>
    );
  },
  thead({ children }: any) {
    return <thead className="bg-slate-50">{children}</thead>;
  },
  tbody({ children }: any) {
    return <tbody className="divide-y divide-slate-100 bg-white">{children}</tbody>;
  },
  tr({ children }: any) {
    return <tr className="hover:bg-slate-50/50 transition-colors odd:bg-slate-50/20">{children}</tr>;
  },
  th({ children }: any) {
    return <th className="px-4 py-3 text-left font-bold text-slate-900 border-b border-slate-200">{children}</th>;
  },
  td({ children }: any) {
    return <td className="px-4 py-3 text-slate-700">{children}</td>;
  },
  h1: ({ children }: any) => <h1 className="text-xl md:text-2xl font-extrabold text-slate-950 mt-6 mb-2 tracking-tight">{children}</h1>,
  h2: ({ children }: any) => <h2 className="text-lg md:text-xl font-bold text-slate-900 mt-5 mb-2 tracking-tight">{children}</h2>,
  h3: ({ children }: any) => <h3 className="text-md md:text-lg font-bold text-slate-800 mt-4 mb-1.5 tracking-tight">{children}</h3>,
  ul: ({ children }: any) => <ul className="list-disc pl-6 my-3 space-y-1.5 text-slate-700 text-xs md:text-sm">{children}</ul>,
  ol: ({ children }: any) => <ol className="list-decimal pl-6 my-3 space-y-1.5 text-slate-700 text-xs md:text-sm">{children}</ol>,
  li: ({ children }: any) => <li className="leading-relaxed">{children}</li>,
  blockquote: ({ children }: any) => (
    <blockquote className="border-l-4 border-primary bg-slate-50/70 pl-4 py-2 my-4 rounded-r-xl text-slate-600 italic text-xs md:text-sm">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-6 border-t border-slate-200" />,
  p: ({ children }: any) => <p className="leading-relaxed my-2.5 text-slate-700 text-xs md:text-sm">{children}</p>,
  a: ({ href, children }: any) => (
    <a href={href} className="text-primary hover:underline font-semibold" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  )
};

function TypewriterText({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index += 4;
      if (index >= text.length) {
        setDisplayedText(text);
        clearInterval(interval);
        onComplete?.();
      } else {
        setDisplayedText(text.substring(0, index));
      }
    }, 10);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={markdownComponents}
    >
      {displayedText}
    </ReactMarkdown>
  );
}

export default function AIAssistantPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userInitials, setUserInitials] = useState("U");
  const [helpfulMap, setHelpfulMap] = useState<Record<string, "helpful" | "unhelpful">>({});
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [aiContext, setAiContext] = useState<AiContextResponse | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Voice Input States
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  // File Attachment States
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  // Input States lifecycle
  const [inputState, setInputState] = useState<"idle" | "typing" | "listening" | "uploading" | "sending">("idle");

  const togglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPinnedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // History states
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [dismissedRecommendations, setDismissedRecommendations] = useState<string[]>([]);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [actualAppliances, setActualAppliances] = useState<any[]>([]);
  const [bookingApplianceId, setBookingApplianceId] = useState("");
  const [bookingProblem, setBookingProblem] = useState("");
  const [bookingServiceType, setBookingServiceType] = useState("Repair Check");
  const [bookingCost, setBookingCost] = useState("1500");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("10:00 AM - 12:00 PM");
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    fetch("/api/v1/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data?.user?.fullName) {
          const names = data.user.fullName.trim().split(/\s+/);
          const initials = names.map((n: string) => n[0]).join("").substring(0, 2).toUpperCase();
          setUserInitials(initials || "U");
        }
      })
      .catch(() => setUserInitials("U"));

    apiClient<AiContextResponse>("/api/v1/ai/context")
      .then((data) => setAiContext(data))
      .catch((err) => console.error("Error fetching AI Context:", err));

    loadConversations();
  }, []);

  const loadConversations = (search = searchQuery) => {
    const url = `/api/v1/ai/conversations${search ? `?search=${encodeURIComponent(search)}` : ""}`;
    apiClient<ConversationSummary[]>(url)
      .then((data) => setConversations(data))
      .catch((err) => console.error("Error loading conversations list:", err));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    loadConversations(e.target.value);
  };

  const handleSelectConversation = async (id: string) => {
    setActiveConversationId(id);
    setError(null);
    setLoading(true);
    try {
      const details = await apiClient<ConversationDetail>(`/api/v1/ai/conversations/${id}`);
      const mapped: Message[] = details.messages.map((m, idx) => ({
        id: `${id}_${idx}`,
        role: m.role as any,
        content: m.content,
        timestamp: new Date(m.timestamp)
      }));
      setMessages(mapped);
    } catch (err: any) {
      console.error("Failed to load conversation details:", err);
      setError("Failed to load conversation messages.");
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setActiveConversationId(null);
    setMessages([]);
    setError(null);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleBackToHome = () => {
    setActiveConversationId(null);
    setMessages([]);
    setError(null);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleRename = async (id: string) => {
    if (!editTitle.trim()) return;
    try {
      await apiClient(`/api/v1/ai/conversations/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ title: editTitle })
      });
      setEditingId(null);
      loadConversations();
    } catch (err) {
      console.error("Failed to rename conversation:", err);
    }
  };

  const handleDeleteConversation = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await apiClient(`/api/v1/ai/conversations/${id}`, {
        method: "DELETE"
      });
      if (activeConversationId === id) {
        handleNewChat();
      }
      loadConversations();
    } catch (err) {
      console.error("Failed to delete conversation:", err);
    }
  };

  const handleSend = async (text: string) => {
    let msgText = text.trim();
    
    if (selectedFile) {
      showToast("The current AI model does not support document analysis.");
      if (!msgText) {
        return;
      }
    } else {
      if (!msgText) return;
    }

    setInputState("sending");
    setLoading(true);
    setError(null);

    const userMsg: Message = {
      id: Math.random().toString(36).substring(7),
      role: "user",
      content: msgText,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      const chatHistory = [
        { role: "system", content: "You are Dwellix AI, a premium intelligent home co-pilot. You specialize in diagnosing appliance errors, suggesting preventive home maintenance schedules, and offering troubleshooting tips for home systems. Always give highly professional, concise, actionable, and structured advice." },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: "user", content: msgText }
      ];

      const response = await apiClient<ChatResponse>("/api/v1/ai/chat", {
        method: "POST",
        body: JSON.stringify({
          messages: chatHistory,
          conversationId: activeConversationId
        })
      });

      const assistantMsg: Message = {
        id: Math.random().toString(36).substring(7),
        role: "assistant",
        content: response.content,
        modelUsed: response.modelUsed,
        timestamp: new Date(),
        isTypingEnabled: true
      };

      setMessages((prev) => [...prev, assistantMsg]);
      showToast("Message sent");
      
      if (!activeConversationId) {
        setActiveConversationId(response.conversationId);
      }
      loadConversations();
    } catch (err: any) {
      console.error("AI Assistant request error:", err);
      setError(err?.message ?? "An error occurred while getting response from the AI co-pilot. Please try again.");
    } finally {
      setLoading(false);
      setInputState("idle");
    }
  };

  const handleCopyMessage = async (messageId: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  const handleRegenerate = () => {
    const userMessages = messages.filter((m) => m.role === "user");
    if (userMessages.length === 0) return;
    const lastUserMsg = userMessages[userMessages.length - 1];

    setMessages((prev) => {
      const next = [...prev];
      if (next.length > 0 && next[next.length - 1].role === "assistant") {
        next.pop();
      }
      return next;
    });
    handleSend(lastUserMsg.content);
  };

  const handleClear = () => {
    setMessages([]);
    setError(null);
  };

  const handleOpenBookingModal = (promptText: string) => {
    setBookingProblem(promptText);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setBookingDate(tomorrow.toISOString().split("T")[0]);
    
    setLoading(true);
    apiClient<any[]>("/api/v1/appliances")
      .then((data) => {
        setActualAppliances(data);
        if (data.length > 0) {
          setBookingApplianceId(data[0].id);
        }
        setIsBookingModalOpen(true);
      })
      .catch((err) => {
        console.error("Failed to load appliances for booking modal:", err);
        showToast("Failed to prepare booking details.");
      })
      .finally(() => setLoading(false));
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingApplianceId || !bookingServiceType.trim() || !bookingProblem.trim() || !bookingDate || !bookingTime.trim()) {
      showToast("Please fill in all booking fields.");
      return;
    }

    setBookingSubmitting(true);
    try {
      const res = await apiClient<any>("/api/v1/bookings", {
        method: "POST",
        body: JSON.stringify({
          applianceId: bookingApplianceId,
          serviceType: bookingServiceType.trim(),
          problemDescription: bookingProblem.trim(),
          bookingDate,
          bookingTime: bookingTime.trim(),
          status: "PENDING",
          estimatedCost: parseFloat(bookingCost) || 1500.0
        })
      });

      showToast("Technician booked successfully.");
      setIsBookingModalOpen(false);
      setTimeout(() => {
        router.push(`/dashboard/bookings/${res.id}`);
      }, 1000);
    } catch (err) {
      console.error("Failed to submit booking:", err);
      showToast("Booking failed. Please try again.");
    } finally {
      setBookingSubmitting(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Microphone toggle recognition function
  const handleVoiceInput = async () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast("Voice input is not supported by this browser.");
      return;
    }

    if (isListening) {
      if (recognition) {
        recognition.stop();
      }
      setIsListening(false);
      setInputState("idle");
      return;
    }

    try {
      // Request mic permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());

      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "en-US";

      rec.onstart = () => {
        setIsListening(true);
        setInputState("listening");
        showToast("Listening...");
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput(prev => prev + (prev ? " " : "") + transcript);
          showToast("Speech recognized");
        }
      };

      rec.onerror = (event: any) => {
        console.error("Speech recognition error", event);
        if (event.error === "not-allowed") {
          showToast("Microphone permission denied.");
        } else {
          showToast("Voice input is not supported by this browser.");
        }
        setIsListening(false);
        setInputState("idle");
      };

      rec.onend = () => {
        setIsListening(false);
        setInputState("idle");
      };

      rec.start();
      setRecognition(rec);
    } catch (err: any) {
      console.error("Mic permission request failed", err);
      showToast("Microphone permission denied.");
      setIsListening(false);
      setInputState("idle");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      showToast("Attachment selected");
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFeedback = (messageId: string, type: "helpful" | "unhelpful") => {
    setHelpfulMap((prev) => ({ ...prev, [messageId]: type }));
  };

  const shouldRecommendService = (content: string) => {
    const keywords = ["technician", "professional", "servicing", "repair", "mechanic", "book", "dispatch", "plumber", "electrician"];
    const text = content.toLowerCase();
    return keywords.some(kw => text.includes(kw));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleActionClick = (label: string) => {
    setToastMessage(`Action Completed: ${label}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const getSuggestedActions = (content: string): SuggestedAction[] => {
    if (!content) return [];
    const lower = content.toLowerCase();
    const actions: SuggestedAction[] = [];

    if (lower.includes("repair") || lower.includes("broken") || lower.includes("technician")) {
      actions.push({
        label: "Book Technician",
        actionType: "book",
        description: "Schedule a professional Dwellix technician to fix the issue."
      });
    }

    if (lower.includes("maintenance") || lower.includes("schedule")) {
      actions.push({
        label: "Schedule Maintenance",
        actionType: "schedule",
        description: "Plan a recurring preventive maintenance routine for this appliance."
      });
    }

    if (lower.includes("clean") || lower.includes("wash") || lower.includes("coil") || lower.includes("filter")) {
      actions.push({
        label: "Save Note",
        actionType: "note",
        description: "Log DIY cleaning recommendations to your appliance notes."
      });
    }

    if (lower.includes("inspection") || lower.includes("inspect") || lower.includes("check")) {
      actions.push({
        label: "Create Reminder",
        actionType: "reminder",
        description: "Set a notification reminder to perform a DIY system checkup."
      });
    }

    if (lower.includes("replacement") || lower.includes("replace") || lower.includes("warranty")) {
      actions.push({
        label: "Create Reminder",
        actionType: "reminder",
        description: "Set a calendar reminder for component replacement timelines."
      });
    }

    return actions.filter((v, i, a) => a.findIndex(t => t.label === v.label) === i);
  };

  // Group conversations by date
  const groupedConversations = useMemo(() => {
    const today: ConversationSummary[] = [];
    const yesterday: ConversationSummary[] = [];
    const last7Days: ConversationSummary[] = [];
    const older: ConversationSummary[] = [];

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday.getTime() - 24 * 60 * 60 * 1000);
    const startOf7DaysAgo = new Date(startOfToday.getTime() - 7 * 24 * 60 * 60 * 1000);

    const filtered = conversations.filter(c => !pinnedIds.includes(c.id));

    filtered.forEach((c) => {
      const date = new Date(c.updatedAt);
      if (date >= startOfToday) {
        today.push(c);
      } else if (date >= startOfYesterday) {
        yesterday.push(c);
      } else if (date >= startOf7DaysAgo) {
        last7Days.push(c);
      } else {
        older.push(c);
      }
    });

    return { today, yesterday, last7Days, older };
  }, [conversations, pinnedIds]);

  const pinnedConversations = useMemo(() => {
    return conversations.filter(c => pinnedIds.includes(c.id));
  }, [conversations, pinnedIds]);

  const renderHistoryGroup = (title: string, list: ConversationSummary[], isPinnedSection = false) => {
    if (list.length === 0) return null;
    return (
      <div className="space-y-1 mt-4">
        <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 px-3 py-1 flex items-center justify-between">
          <span>{title}</span>
          {isPinnedSection && <Pin className="h-3 w-3 text-primary" />}
        </h4>
        {list.map((c) => {
          const isPinned = pinnedIds.includes(c.id);
          return (
            <div
              key={c.id}
              onClick={() => {
                handleSelectConversation(c.id);
                setIsMobileSidebarOpen(false);
              }}
              className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer text-xs transition-all ${
                activeConversationId === c.id
                  ? "bg-primary/10 text-primary font-bold shadow-sm"
                  : "text-slate-650 hover:bg-slate-50/80"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <MessageSquare className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                {editingId === c.id ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onBlur={() => handleRename(c.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleRename(c.id);
                      if (e.key === "Escape") setEditingId(null);
                    }}
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                    className="w-full bg-white border border-slate-200 px-1.5 py-0.5 rounded outline-none"
                  />
                ) : (
                  <span className="truncate pr-1">{c.title}</span>
                )}
              </div>

              {editingId !== c.id && (
                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingId(c.id);
                      setEditTitle(c.title);
                    }}
                    className="hover:text-primary text-slate-400 p-0.5 transition-colors"
                    title="Rename"
                  >
                    <Edit2 className="h-3 w-3" />
                  </button>
                  <button
                    onClick={(e) => togglePin(c.id, e)}
                    className={`p-0.5 transition-colors ${isPinned ? "text-primary hover:text-slate-400" : "text-slate-400 hover:text-primary"}`}
                    title={isPinned ? "Unpin" : "Pin"}
                  >
                    <Pin className="h-3 w-3" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteConversation(c.id, e)}
                    className="hover:text-rose-600 text-slate-400 p-0.5 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Warranty Statistics calculations
  const warrantyStats = useMemo(() => {
    let safe = 0;
    let expiring = 0;
    let expired = 0;
    let active = 0;
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    aiContext?.rooms?.forEach((room) => {
      room.appliances?.forEach((app) => {
        if (app.warrantyExpiry) {
          const expiry = new Date(app.warrantyExpiry);
          if (expiry < today) {
            expired++;
          } else {
            active++;
            if (expiry <= thirtyDaysFromNow) {
              expiring++;
            } else {
              safe++;
            }
          }
        }
      });
    });

    return { safe, expiring, expired, active };
  }, [aiContext]);

  // Overall Health Score calculation
  const overallHealthScore = useMemo(() => {
    if (!aiContext || aiContext.appliancesCount === 0) return 100;
    let score = 88;
    if (warrantyStats.expired > 0) {
      score -= Math.min(warrantyStats.expired * 8, 30);
    }
    return Math.max(score, 60);
  }, [aiContext, warrantyStats]);

  // Upcoming Services calculation
  const upcomingServicesCount = useMemo(() => {
    let count = 0;
    aiContext?.rooms?.forEach(room => {
      room.appliances?.forEach(app => {
        if (app.maintenance) count++;
      });
    });
    return count || 1;
  }, [aiContext]);

  const HealthScoreCircle = ({ score }: { score: number }) => {
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
      <div className="relative flex items-center justify-center h-20 w-20 mx-auto">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="40"
            cy="40"
            r={radius}
            className="stroke-slate-100 fill-none"
            strokeWidth="6"
          />
          <motion.circle
            cx="40"
            cy="40"
            r={radius}
            className="stroke-primary fill-none"
            strokeWidth="6"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute text-center">
          <span className="text-lg font-extrabold text-slate-800">{score}%</span>
          <span className="text-[7px] text-slate-400 block font-bold tracking-wider uppercase">Health</span>
        </div>
      </div>
    );
  };

  const ContextPanelContent = () => (
    <div className="space-y-4 text-left">
      {/* 🏠 Home Overview */}
      <div className="bg-white border border-slate-200/50 shadow-sm rounded-2xl p-4 space-y-3">
        <h3 className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
          <Home className="h-4 w-4 text-primary" />
          <span>Home Overview</span>
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-2.5">
            <span className="text-[9px] text-slate-400 block font-bold uppercase">Rooms</span>
            <span className="text-sm font-extrabold text-slate-800">{aiContext?.roomsCount ?? 0}</span>
          </div>
          <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-2.5">
            <span className="text-[9px] text-slate-400 block font-bold uppercase">Appliances</span>
            <span className="text-sm font-extrabold text-slate-800">{aiContext?.appliancesCount ?? 0}</span>
          </div>
          <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-2.5">
            <span className="text-[9px] text-slate-400 block font-bold uppercase">Active Warranties</span>
            <span className="text-sm font-extrabold text-slate-800">{warrantyStats.active}</span>
          </div>
          <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-2.5">
            <span className="text-[9px] text-slate-400 block font-bold uppercase">Upcoming services</span>
            <span className="text-sm font-extrabold text-slate-800">{upcomingServicesCount}</span>
          </div>
        </div>
      </div>

      {/* ⭐ Appliance Health Score */}
      <div className="bg-white border border-slate-200/50 shadow-sm rounded-2xl p-4 text-center space-y-3">
        <h3 className="text-xs font-extrabold text-slate-800 flex items-center justify-center gap-1.5 uppercase tracking-wider">
          <Activity className="h-4 w-4 text-indigo-500" />
          <span>Appliance Health Score</span>
        </h3>
        <HealthScoreCircle score={overallHealthScore} />
        <p className="text-[10px] text-slate-400 leading-normal">
          Calculated dynamically across active devices, warranty ages, and recent checks.
        </p>
      </div>

      {/* Warranty Status */}
      <div className="bg-white border border-slate-200/50 shadow-sm rounded-2xl p-4 space-y-3">
        <h3 className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span>Warranty Status</span>
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Safe / Covered</span>
            </span>
            <span className="font-extrabold text-slate-800">{warrantyStats.safe}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <span>Expiring Soon</span>
            </span>
            <span className="font-extrabold text-slate-800">{warrantyStats.expiring}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              <span>Expired</span>
            </span>
            <span className="font-extrabold text-slate-800">{warrantyStats.expired}</span>
          </div>
        </div>
      </div>

      {/* Recent Diagnostics / Upcoming Maintenance */}
      <div className="bg-white border border-slate-200/50 shadow-sm rounded-2xl p-4 space-y-3">
        <h3 className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
          <Sparkles className="h-4 w-4 text-amber-500" />
          <span>Recent Diagnostics</span>
        </h3>
        <div className="space-y-2 text-xs">
          <div className="border-l-2 border-indigo-500 pl-2.5 py-0.5">
            <div className="font-bold text-slate-800">HVAC System check</div>
            <div className="text-[10px] text-slate-400">Health index at 94%</div>
          </div>
          <div className="border-l-2 border-emerald-500 pl-2.5 py-0.5">
            <div className="font-bold text-slate-800">RO Water Purifier</div>
            <div className="text-[10px] text-slate-400">Filter status checks OK</div>
          </div>
        </div>
      </div>

      {/* Today's AI Tips */}
      <div className="bg-white border border-slate-200/50 shadow-sm rounded-2xl p-4 space-y-2">
        <h3 className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
          <Bot className="h-4 w-4 text-primary animate-pulse" />
          <span>Today's AI Tips</span>
        </h3>
        <ul className="text-[11px] text-slate-505 list-disc pl-4 space-y-1.5 leading-relaxed">
          <li>Perform seasonal service check for heavy appliances.</li>
          <li>Scan and upload recent purchasing warranty receipts.</li>
          <li>Washing machine drum cleaning extends motor longevity.</li>
        </ul>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-slate-200/50 shadow-sm rounded-2xl p-4 space-y-2">
        <h3 className="text-xs font-extrabold text-slate-850 uppercase tracking-wider">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-2 text-[10px]">
          <Button
            type="button"
            onClick={() => handleOpenBookingModal("Routine system checkup")}
            variant="outline"
            className="h-8 rounded-lg font-bold border-slate-200 text-slate-650 hover:bg-primary/5 hover:text-primary transition-all text-[10px] px-2 cursor-pointer"
          >
            Schedule Tech
          </Button>
          <Button
            type="button"
            onClick={() => router.push("/onboarding/appliances")}
            variant="outline"
            className="h-8 rounded-lg font-bold border-slate-200 text-slate-650 hover:bg-primary/5 hover:text-primary transition-all text-[10px] px-2 cursor-pointer"
          >
            Add Appliance
          </Button>
          <Button
            type="button"
            onClick={() => router.push("/dashboard/warranty-vault")}
            variant="outline"
            className="h-8 rounded-lg font-bold border-slate-200 text-slate-650 hover:bg-primary/5 hover:text-primary transition-all text-[10px] px-2 cursor-pointer"
          >
            Warranty Vault
          </Button>
          <Button
            type="button"
            onClick={() => router.push("/dashboard/marketplace")}
            variant="outline"
            className="h-8 rounded-lg font-bold border-slate-200 text-slate-650 hover:bg-primary/5 hover:text-primary transition-all text-[10px] px-2 cursor-pointer"
          >
            Marketplace
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-80px)] w-full max-w-[1600px] mx-auto p-3 md:p-5 gap-5 relative overflow-hidden text-left bg-slate-50/20">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 10 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-xs md:text-sm font-bold px-5 py-3 rounded-2xl shadow-xl z-50 flex items-center gap-2"
          >
            <ShieldCheck className="h-4.5 w-4.5" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEFT SIDEBAR - 320px */}
      <div className="w-[300px] xl:w-[320px] shrink-0 border border-slate-200/60 bg-white shadow-xl shadow-slate-100/30 rounded-3xl flex flex-col overflow-hidden hidden lg:flex">
        <div className="p-4 border-b border-slate-100 space-y-3 flex-shrink-0">
          <Button
            onClick={handleNewChat}
            className="w-full rounded-2xl font-bold text-xs h-10 gap-2 flex items-center justify-center shadow bg-primary text-white cursor-pointer hover:bg-primary/95 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>New Chat</span>
          </Button>

          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search chats..."
              className="pl-9 h-10 rounded-xl border-slate-200 focus:ring-primary focus:border-primary text-xs"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 scrollbar-thin space-y-3">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-450 text-center space-y-1.5 px-3">
              <MessageSquare className="h-6 w-6 opacity-40" />
              <span className="text-xs font-semibold">No chats found</span>
            </div>
          ) : (
            <>
              {pinnedConversations.length > 0 && renderHistoryGroup("Pinned", pinnedConversations, true)}
              {renderHistoryGroup("Today", groupedConversations.today)}
              {renderHistoryGroup("Yesterday", groupedConversations.yesterday)}
              {renderHistoryGroup("Last 7 Days", groupedConversations.last7Days)}
              {renderHistoryGroup("Older", groupedConversations.older)}
            </>
          )}
        </div>
      </div>

      {/* CENTER PANEL (AI Workspace) */}
      <div className="flex-1 min-w-0 flex flex-col rounded-3xl border border-slate-200/60 bg-white shadow-xl shadow-slate-100/30 overflow-hidden relative">
        
        {/* Unified Responsive Sticky Top Navigation */}
        <div className="px-4 md:px-6 py-3 border-b border-slate-100 bg-white flex items-center justify-between flex-shrink-0 z-20">
          {/* Left Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile Sidebar Hamburger */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="rounded-xl h-8 w-8 lg:hidden flex-shrink-0"
            >
              <Menu className="h-4 w-4 text-slate-600" />
            </Button>
            <button
              onClick={handleBackToHome}
              className="text-xs font-extrabold text-slate-700 hover:text-primary flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              ← AI Home
            </button>
          </div>

          {/* Center Title (only on mobile) */}
          <div className="text-xs font-heading font-extrabold text-slate-800 lg:hidden truncate max-w-[120px] sm:max-w-none">
            Dwellix AI
          </div>

          {/* Right Actions / Context Details */}
          <div className="flex items-center gap-3">
            {aiContext && aiContext.homeName && (
              <div className="hidden lg:flex items-center gap-4 text-[10px] uppercase font-bold text-slate-400">
                <span>{aiContext.homeName}</span>
                <span>•</span>
                <span>{aiContext.roomsCount} Rooms</span>
                <span>•</span>
                <span>{aiContext.appliancesCount} Devices</span>
              </div>
            )}
            
            {/* Mobile Context Trigger */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDrawerOpen(true)}
              className="rounded-xl h-8 w-8 lg:hidden flex-shrink-0"
            >
              <Sparkles className="h-4 w-4 text-primary" />
            </Button>

            {/* Desktop Context Trigger (only when xl is hidden) */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDrawerOpen(true)}
              className="hidden lg:flex xl:hidden text-xs text-primary font-bold items-center gap-1 rounded-xl hover:bg-primary/5 cursor-pointer animate-pulse"
            >
              <span>Context Details</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto flex flex-col scrollbar-thin">
          <AnimatePresence mode="wait">
            {messages.length === 0 ? (
              /* Preset suggestions empty workspace view */
              <motion.div
                key="empty-workspace"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 text-center"
              >
                {/* Premium Abstract Illustration */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-indigo-500/30 rounded-full filter blur-xl opacity-60 animate-pulse scale-125" />
                  <div className="relative h-20 w-20 rounded-[2rem] bg-gradient-to-tr from-primary to-indigo-650 text-white flex items-center justify-center shadow-lg shadow-primary/20">
                    <Bot className="h-10 w-10 animate-bounce" />
                  </div>
                </div>

                <h1 className="text-2xl md:text-3xl font-heading font-extrabold tracking-tight text-slate-900 mb-1">
                  Dwellix AI Assistant
                </h1>
                <p className="text-xs md:text-sm text-slate-500 max-w-md mb-8 leading-relaxed">
                  Your intelligent home maintenance expert powered by AI.
                </p>

                {aiContext && aiContext.appliancesCount === 0 && (
                  <div className="p-4 mb-6 rounded-2xl bg-amber-50 border border-amber-100 text-amber-800 text-xs md:text-sm font-semibold flex items-center gap-2.5 max-w-xl mx-auto shadow-sm text-left">
                    <AlertTriangle className="h-4.5 w-4.5 text-amber-600 flex-shrink-0 animate-bounce" />
                    <span>No registered appliances. Complete onboarding to unlock personalized AI.</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl w-full">
                  {PRESETS.map((preset, idx) => {
                    const Icon = preset.icon;
                    return (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.015 }}
                        whileTap={{ scale: 0.985 }}
                        onClick={() => handleSend(preset.prompt)}
                        className="group text-left p-4 rounded-2xl border border-slate-200 bg-white hover:border-primary/40 hover:shadow-lg hover:shadow-slate-100/50 transition-all duration-300 flex items-start gap-4 cursor-pointer"
                      >
                        <div className={`h-10 w-10 rounded-xl bg-gradient-to-tr ${preset.color} flex items-center justify-center shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform duration-300`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="space-y-0.5">
                          <h3 className="text-xs font-bold text-slate-800 group-hover:text-primary mb-1">
                            {preset.label}
                          </h3>
                          <p className="text-[10px] md:text-[11px] text-slate-450 line-clamp-2 leading-relaxed">
                            {preset.desc}
                          </p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              /* Chat log container */
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin">
                <AnimatePresence initial={false}>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex gap-4 w-full ${
                        message.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                      }`}
                    >
                      {/* Avatar */}
                      {message.role === "user" ? (
                        <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs md:text-sm shadow-sm shadow-primary/20 flex-shrink-0">
                          {userInitials[0]}
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-indigo-650 text-white flex items-center justify-center shadow-md shadow-primary/20 flex-shrink-0">
                          <Bot className="h-5 w-5" />
                        </div>
                      )}

                      {/* Bubble */}
                      <div className={`space-y-1.5 max-w-[75%] flex flex-col ${message.role === "user" ? "items-end" : "items-start"}`}>
                        <div className="flex items-end gap-2">
                          {message.role === "user" && (
                            <span className="text-[9px] text-slate-400 font-medium select-none self-end pb-1.5">
                              {formatTime(message.timestamp)}
                            </span>
                          )}
                          
                          <div
                            className={`p-4 md:p-5 rounded-[20px] text-sm leading-relaxed shadow-xs text-left ${
                              message.role === "user"
                                ? "bg-gradient-to-tr from-primary to-indigo-650 text-white rounded-tr-none shadow-md shadow-primary/10"
                                : "bg-slate-50/50 border border-slate-100 text-slate-800 rounded-tl-none shadow-md shadow-slate-100/20"
                            }`}
                          >
                            {message.role === "assistant" && message.isTypingEnabled ? (
                              <TypewriterText
                                text={message.content}
                                onComplete={() => {
                                  setMessages((prev) =>
                                    prev.map((m) =>
                                      m.id === message.id ? { ...m, isTypingEnabled: false } : m
                                    )
                                  );
                                }}
                              />
                            ) : (
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeHighlight]}
                                components={markdownComponents}
                              >
                                {message.content}
                              </ReactMarkdown>
                            )}
                          </div>

                          {message.role === "assistant" && (
                            <span className="text-[9px] text-slate-400 font-medium select-none self-end pb-1.5">
                              {formatTime(message.timestamp)}
                            </span>
                          )}
                        </div>

                        {message.role === "assistant" && !message.isTypingEnabled && shouldRecommendService(message.content) && !dismissedRecommendations.includes(message.id) && (
                          <div className="mt-2.5 p-4 border border-indigo-100 bg-indigo-50/20 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full max-w-lg shadow-sm">
                            <div className="space-y-1">
                              <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                                <Wrench className="h-4 w-4 text-primary animate-pulse" />
                                <span>Professional Service Recommended</span>
                              </h4>
                              <p className="text-[11px] text-slate-500">
                                Our AI believes this issue may require a certified technician.
                              </p>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                              <Button
                                onClick={() => {
                                  const promptText = messages.find(m => m.role === 'user')?.content || "Troubleshoot appliance fault";
                                  handleOpenBookingModal(promptText);
                                }}
                                className="h-8 rounded-xl px-3.5 font-bold text-[10px] bg-primary text-white cursor-pointer"
                              >
                                Book Technician
                              </Button>
                              <Button
                                onClick={() => {
                                  setDismissedRecommendations(prev => [...prev, message.id]);
                                }}
                                variant="outline"
                                className="h-8 rounded-xl px-3 font-bold text-[10px] border-slate-200 text-slate-500 cursor-pointer bg-white"
                              >
                                Dismiss
                              </Button>
                            </div>
                          </div>
                        )}

                        {message.role === "assistant" && !message.isTypingEnabled && getSuggestedActions(message.content).length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 w-full max-w-md">
                            {getSuggestedActions(message.content).map((action, aIdx) => (
                              <button
                                key={aIdx}
                                onClick={() => handleActionClick(action.label)}
                                className="flex items-start gap-2.5 p-3 rounded-2xl border border-indigo-50 bg-indigo-50/20 hover:bg-indigo-50/50 hover:border-indigo-100 transition-all text-left group cursor-pointer"
                              >
                                <div className="h-7 w-7 rounded-lg bg-indigo-100/50 text-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                                  {action.actionType === "book" && <Wrench className="h-3.5 w-3.5" />}
                                  {action.actionType === "reminder" && <ShieldCheck className="h-3.5 w-3.5" />}
                                  {action.actionType === "schedule" && <Activity className="h-3.5 w-3.5" />}
                                  {action.actionType === "note" && <FileText className="h-3.5 w-3.5" />}
                                </div>
                                <div>
                                  <div className="font-bold text-slate-800 text-[11px] group-hover:text-primary transition-colors">
                                    {action.label}
                                  </div>
                                  <div className="text-[9px] text-slate-500 leading-normal line-clamp-1">
                                    {action.description}
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Message Actions */}
                        {message.role === "assistant" && (
                          <div className="flex flex-wrap items-center gap-4 px-2 text-[10px] md:text-xs text-slate-450 font-medium mt-1">
                            {message.modelUsed && (
                              <span className="flex items-center gap-1 font-bold text-slate-450">
                                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                                <span>Model: {message.modelUsed}</span>
                              </span>
                            )}

                            <div className="flex items-center gap-3.5">
                              <button
                                onClick={() => handleFeedback(message.id, "helpful")}
                                className={`hover:text-primary transition-colors cursor-pointer flex items-center gap-1 ${
                                  helpfulMap[message.id] === "helpful" ? "text-emerald-500 font-bold" : ""
                                }`}
                              >
                                <ThumbsUp className="h-3.5 w-3.5" />
                                <span>Helpful</span>
                              </button>
                              <button
                                onClick={() => handleFeedback(message.id, "unhelpful")}
                                className={`hover:text-rose-500 transition-colors cursor-pointer flex items-center gap-1 ${
                                  helpfulMap[message.id] === "unhelpful" ? "text-rose-500 font-bold" : ""
                                }`}
                              >
                                <ThumbsDown className="h-3.5 w-3.5" />
                                <span>Not Helpful</span>
                              </button>
                              <button
                                onClick={() => handleCopyMessage(message.id, message.content)}
                                className="hover:text-primary transition-colors cursor-pointer flex items-center gap-1"
                              >
                                {copiedMessageId === message.id ? (
                                  <>
                                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                                    <span className="text-emerald-500 font-bold">Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3.5 w-3.5" />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                              {messages[messages.length - 1].id === message.id && (
                                <button
                                  onClick={handleRegenerate}
                                  className="hover:text-primary transition-colors cursor-pointer flex items-center gap-1"
                                >
                                  <RotateCcw className="h-3.5 w-3.5" />
                                  <span>Regenerate</span>
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Loading State */}
                {loading && (
                  <div className="flex gap-4 max-w-4xl mr-auto">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-indigo-650 text-white flex items-center justify-center shadow-md flex-shrink-0 animate-pulse">
                      <Bot className="h-5 w-5" />
                    </div>
                    <div className="p-4 rounded-[20px] rounded-tl-none bg-slate-50 border border-slate-100 shadow-sm flex flex-col gap-2 min-w-[200px]">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold animate-pulse">
                        <Sparkles className="h-3.5 w-3.5 text-primary/60" />
                        <span>Dwellix AI is computing...</span>
                      </div>
                      <div className="flex items-center gap-1 px-1.5 py-1">
                        <span className="h-2 w-2 bg-primary/70 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="h-2 w-2 bg-primary/70 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="h-2 w-2 bg-primary/70 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Banner */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-start gap-4 p-5 rounded-2xl bg-rose-50 border border-rose-100 text-rose-800 text-xs md:text-sm font-medium max-w-2xl mx-auto shadow-sm text-left"
                  >
                    <AlertTriangle className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <div className="font-extrabold text-rose-900">Inference Request Failed</div>
                      <p className="text-rose-700 leading-relaxed">{error}</p>
                      <button
                        onClick={handleRegenerate}
                        className="mt-2 flex items-center gap-1 text-[11px] font-extrabold text-rose-800 hover:text-rose-900 border-b border-rose-800/40 hover:border-rose-900 cursor-pointer"
                      >
                        <RotateCcw className="h-3 w-3" />
                        <span>Retry request</span>
                      </button>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Large Rounded 24px floating prompt box */}
        <div className="p-4 border-t border-slate-100 bg-white flex-shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="max-w-4xl mx-auto w-full"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*,application/pdf"
              className="hidden"
            />

            <div className="relative rounded-[24px] bg-slate-50/50 border border-slate-200/80 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 shadow-lg shadow-slate-100/50 p-2.5 transition-all flex flex-col gap-2 bg-white">
              
              {/* Selected File Preview Panel */}
              {selectedFile && (
                <div className="flex flex-col gap-1 ml-2 self-start">
                  <div className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-200/60 rounded-2xl max-w-sm">
                    {filePreview ? (
                      <img
                        src={filePreview}
                        alt="Preview"
                        className="h-10 w-10 object-cover rounded-lg border border-slate-200"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[10px] font-extrabold text-indigo-600">
                        PDF
                      </div>
                    )}
                    <div className="min-w-0 flex-1 text-left">
                      <div className="text-xs font-bold text-slate-800 truncate">{selectedFile.name}</div>
                      <div className="text-[9px] text-slate-400">{(selectedFile.size / 1024).toFixed(1)} KB</div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={handleRemoveFile}
                      className="h-7 w-7 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 flex-shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <span className="text-[10px] text-amber-600 font-semibold flex items-center gap-1.5 mt-0.5 text-left animate-pulse">
                    <AlertTriangle className="h-3 w-3" />
                    <span>The current AI model does not support document analysis.</span>
                  </span>
                </div>
              )}

              {/* Waveform Recording Animation */}
              {isListening && (
                <div className="flex items-center gap-1.5 px-4 py-1.5 bg-rose-50/50 border border-rose-100 rounded-xl animate-pulse self-start ml-2">
                  <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                  <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Listening & Recording...</span>
                  <div className="flex items-center gap-0.5 ml-2">
                    <span className="h-3 w-0.5 bg-rose-500 animate-[bounce_0.8s_infinite]" style={{ animationDelay: "0ms" }} />
                    <span className="h-4 w-0.5 bg-rose-500 animate-[bounce_0.8s_infinite]" style={{ animationDelay: "150ms" }} />
                    <span className="h-2.5 w-0.5 bg-rose-500 animate-[bounce_0.8s_infinite]" style={{ animationDelay: "300ms" }} />
                    <span className="h-4.5 w-0.5 bg-rose-500 animate-[bounce_0.8s_infinite]" style={{ animationDelay: "450ms" }} />
                  </div>
                </div>
              )}

              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                rows={1}
                disabled={loading || isListening}
                placeholder={isListening ? "Listening..." : "Ask anything about your appliances..."}
                className="w-full px-4 py-2 bg-transparent text-sm resize-none overflow-y-auto leading-relaxed outline-none border-0 focus:ring-0 focus:border-0 scrollbar-none min-h-[40px] max-h-[140px] text-slate-800"
              />
              
              <div className="flex items-center justify-between border-t border-slate-100 pt-2 px-1">
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-9 w-9 rounded-xl text-slate-400 hover:text-slate-650 hover:bg-slate-100 cursor-pointer"
                    title="Attach File"
                    disabled={loading || isListening}
                  >
                    <Paperclip className="h-4.5 w-4.5" />
                  </Button>
                  <Button
                    type="button"
                    variant={isListening ? "secondary" : "ghost"}
                    size="icon"
                    onClick={handleVoiceInput}
                    className={`h-9 w-9 rounded-xl transition-all cursor-pointer ${
                      isListening
                        ? "bg-rose-500 text-white hover:bg-rose-600 animate-pulse"
                        : "text-slate-400 hover:text-slate-650 hover:bg-slate-100"
                    }`}
                    title={isListening ? "Stop Listening" : "Voice Input"}
                    disabled={loading}
                  >
                    <Mic className="h-4.5 w-4.5" />
                  </Button>
                </div>
                <Button
                  type="submit"
                  disabled={loading || isListening || !input.trim()}
                  className="h-9 rounded-xl px-4 bg-primary hover:bg-primary/95 text-white flex items-center justify-center gap-1.5 font-bold text-xs shadow-md shadow-primary/10 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <span>Send</span>
                      <Send className="h-3.5 w-3.5" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* RIGHT PANEL (AI Context Panel - 340px) */}
      <div className="w-[320px] xl:w-[340px] shrink-0 border border-slate-200/60 bg-white/70 backdrop-blur-md shadow-xl shadow-slate-100/30 rounded-3xl hidden xl:flex flex-col overflow-y-auto p-4 space-y-4 scrollbar-thin">
        <ContextPanelContent />
      </div>

      {/* Mobile Context Drawer Overlay */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-black z-50 cursor-pointer xl:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white shadow-2xl z-50 flex flex-col p-6 overflow-y-auto xl:hidden"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4 flex-shrink-0">
                <div className="text-left">
                  <h2 className="text-sm font-heading font-extrabold text-slate-900 flex items-center gap-2">
                    <Bot className="h-4.5 w-4.5 text-primary" />
                    <span>AI Context Insights</span>
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDrawerOpen(false)}
                  className="rounded-full h-8 w-8 hover:bg-slate-100"
                >
                  <X className="h-4 w-4 text-slate-500" />
                </Button>
              </div>
              <ContextPanelContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Sidebar History Drawer */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black z-50 md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-72 bg-white z-50 flex flex-col p-4 md:hidden border-r border-slate-200"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-shrink-0">
                <span className="text-xs font-extrabold font-heading text-slate-800">History</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="rounded-full h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="py-3 flex-shrink-0">
                <Button
                  onClick={() => {
                    handleNewChat();
                    setIsMobileSidebarOpen(false);
                  }}
                  className="w-full rounded-xl font-bold text-xs h-9 gap-1.5 flex items-center justify-center bg-primary text-white"
                >
                  <Plus className="h-4 w-4" />
                  <span>New Chat</span>
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 text-left">
                {conversations.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs">No chats found</div>
                ) : (
                  <>
                    {pinnedConversations.length > 0 && renderHistoryGroup("Pinned", pinnedConversations, true)}
                    {renderHistoryGroup("Today", groupedConversations.today)}
                    {renderHistoryGroup("Yesterday", groupedConversations.yesterday)}
                    {renderHistoryGroup("Last 7 Days", groupedConversations.last7Days)}
                    {renderHistoryGroup("Older", groupedConversations.older)}
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Booking Modal */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-slate-200/60 p-6 max-w-lg w-full shadow-2xl space-y-4 text-left relative overflow-hidden"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-extrabold text-slate-950 flex items-center gap-1.5">
                  <Wrench className="h-5 w-5 text-primary" />
                  <span>AI Recommended Booking</span>
                </h3>
                <button
                  onClick={() => setIsBookingModalOpen(false)}
                  className="rounded-full hover:bg-slate-100 p-1 transition-colors cursor-pointer"
                >
                  <X className="h-4.5 w-4.5 text-slate-500" />
                </button>
              </div>

              <form onSubmit={handleConfirmBooking} className="space-y-4 text-xs text-slate-700">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-slate-400">Select Appliance *</label>
                  {actualAppliances.length === 0 ? (
                    <div className="p-3 border border-amber-100 bg-amber-50/50 rounded-xl text-amber-800">
                      No appliances found. Add one first.
                    </div>
                  ) : (
                    <select
                      value={bookingApplianceId}
                      onChange={(e) => setBookingApplianceId(e.target.value)}
                      className="w-full h-10 rounded-xl border border-slate-200 bg-white text-xs px-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-700"
                    >
                      {actualAppliances.map((app) => (
                        <option key={app.id} value={app.id}>
                          {app.name} ({app.brand} - {app.model})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase text-slate-400">Recommended Service *</label>
                    <select
                      value={bookingServiceType}
                      onChange={(e) => setBookingServiceType(e.target.value)}
                      className="w-full h-10 rounded-xl border border-slate-200 bg-white text-xs px-3 focus:outline-none text-slate-700"
                    >
                      <option value="Repair Check">Repair Check</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Deep Cleaning">Deep Cleaning</option>
                      <option value="Installation">Installation</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase text-slate-400">Estimated Cost (₹)</label>
                    <Input
                      type="number"
                      value={bookingCost}
                      onChange={(e) => setBookingCost(e.target.value)}
                      className="h-10 rounded-xl text-xs border-slate-200"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase text-slate-400">Preferred Date *</label>
                    <Input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="h-10 rounded-xl text-xs border-slate-200"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase text-slate-400">Preferred Time Slot *</label>
                    <select
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full h-10 rounded-xl border border-slate-200 bg-white text-xs px-3 focus:outline-none text-slate-700"
                    >
                      <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
                      <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
                      <option value="01:00 PM - 03:00 PM">01:00 PM - 03:00 PM</option>
                      <option value="03:00 PM - 05:00 PM">03:00 PM - 05:00 PM</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-slate-400">Problem Description *</label>
                  <textarea
                    value={bookingProblem}
                    onChange={(e) => setBookingProblem(e.target.value)}
                    rows={3}
                    className="w-full rounded-xl border border-slate-200 bg-white text-xs p-3 focus:outline-none text-slate-700 leading-relaxed resize-none font-medium"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsBookingModalOpen(false)}
                    className="rounded-xl text-xs font-bold h-9 border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={bookingSubmitting || actualAppliances.length === 0}
                    className="rounded-xl text-xs font-bold h-9 bg-primary text-white hover:bg-primary/95 cursor-pointer"
                  >
                    {bookingSubmitting ? "Booking..." : "Confirm Booking"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

