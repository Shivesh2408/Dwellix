"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import {
  Bot, Send, Trash2, Sparkles, AlertTriangle, Loader2, ThumbsUp, ThumbsDown, Copy, RotateCcw,
  Check, Droplet, ThermometerSnowflake, Activity, XCircle, Wrench, FileText, Home, Layers,
  ShieldCheck, ChevronRight, X, Plus, Search, MessageSquare, Edit2, Pin, Menu, Paperclip, Mic,
  Bell, Settings, LayoutDashboard, Database, HelpCircle, User, LogOut, ChevronDown, CheckCircle2,
  Trash, Volume2
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
    label: "Diagnose AC issue",
    desc: "cooling or airflow anomalies",
    prompt: "My air conditioner is blowing warm air instead of cool air. How can I diagnose and troubleshoot this?",
    icon: Droplet,
    color: "bg-blue-50/50 border-blue-100 text-blue-600"
  },
  {
    label: "Check fridge cooling",
    desc: "refrigerator temp imbalance guide",
    prompt: "The refrigerator compartment is warm but the freezer is cold. What should I check to diagnose the cooling issue?",
    icon: ThermometerSnowflake,
    color: "bg-sky-50/50 border-sky-100 text-sky-600"
  },
  {
    label: "Drum & filter cleanup",
    desc: "washing machine motor longevity",
    prompt: "What is the step-by-step process to clean the drum, filter, and seal of a front-load washing machine?",
    icon: Wrench,
    color: "bg-emerald-50/50 border-emerald-100 text-emerald-600"
  },
  {
    label: "Decode error code E15",
    desc: "dishwasher fault resolutions",
    prompt: "My dishwasher is displaying error code E15 and won't start. What does this mean and how do I troubleshoot it?",
    icon: AlertTriangle,
    color: "bg-rose-50/50 border-rose-100 text-rose-600"
  },
  {
    label: "Warranty advice",
    desc: "registry coverage & claim steps",
    prompt: "How can I verify if an appliance is still under warranty, and what documents do I need to make a claim?",
    icon: FileText,
    color: "bg-amber-50/50 border-amber-100 text-amber-600"
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
    <div className="relative my-4 overflow-hidden rounded-2xl border border-[#ECECEC] bg-slate-900 text-slate-150 font-mono text-xs md:text-sm shadow-md">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-950 text-[10px] md:text-xs text-slate-450 border-b border-[#333333]/30">
        <span>{language ? language.toUpperCase() : "CODE"}</span>
        <button
          type="button"
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
      <div className="p-4 overflow-x-auto text-[#E2E8F0]">
        <pre className="m-0 leading-normal scrollbar-none">
          <code>{value}</code>
        </pre>
      </div>
    </div>
  );
}

const markdownComponents = {
  code({ className, children, ...props }: React.ComponentPropsWithoutRef<"code">) {
    const match = /language-(\w+)/.exec(className || "");
    const isInline = !className || !className.startsWith("language-");
    const codeContent = String(children).replace(/\n$/, "");

    return !isInline ? (
      <CodeBlock language={match ? match[1] : ""} value={codeContent} />
    ) : (
      <code className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 font-mono text-xs md:text-sm font-semibold" {...props}>
        {children}
      </code>
    );
  },
  table({ children }: React.ComponentPropsWithoutRef<"table">) {
    return (
      <div className="my-4 overflow-x-auto rounded-2xl border border-[#ECECEC] shadow-sm max-w-full scrollbar-thin bg-white">
        <table className="min-w-full divide-y divide-[#ECECEC] text-xs md:text-sm">
          {children}
        </table>
      </div>
    );
  },
  thead({ children }: React.ComponentPropsWithoutRef<"thead">) {
    return <thead className="bg-slate-50">{children}</thead>;
  },
  tbody({ children }: React.ComponentPropsWithoutRef<"tbody">) {
    return <tbody className="divide-y divide-slate-100 bg-white">{children}</tbody>;
  },
  tr({ children }: React.ComponentPropsWithoutRef<"tr">) {
    return <tr className="hover:bg-slate-50/50 transition-colors">{children}</tr>;
  },
  th({ children }: React.ComponentPropsWithoutRef<"th">) {
    return <th className="px-4 py-3 text-left font-bold text-[#111111] border-b border-[#ECECEC]">{children}</th>;
  },
  td({ children }: React.ComponentPropsWithoutRef<"td">) {
    return <td className="px-4 py-3 text-[#6B7280]">{children}</td>;
  },
  h1: ({ children }: React.ComponentPropsWithoutRef<"h1">) => <h1 className="text-xl md:text-2xl font-extrabold text-[#111111] mt-6 mb-2 tracking-tight">{children}</h1>,
  h2: ({ children }: React.ComponentPropsWithoutRef<"h2">) => <h2 className="text-lg md:text-xl font-bold text-[#111111] mt-5 mb-2 tracking-tight">{children}</h2>,
  h3: ({ children }: React.ComponentPropsWithoutRef<"h3">) => <h3 className="text-md md:text-lg font-bold text-[#111111] mt-4 mb-1.5 tracking-tight">{children}</h3>,
  ul: ({ children }: React.ComponentPropsWithoutRef<"ul">) => <ul className="list-disc pl-6 my-3 space-y-1.5 text-[#6B7280] text-xs md:text-sm">{children}</ul>,
  ol: ({ children }: React.ComponentPropsWithoutRef<"ol">) => <ol className="list-decimal pl-6 my-3 space-y-1.5 text-[#6B7280] text-xs md:text-sm">{children}</ol>,
  li: ({ children }: React.ComponentPropsWithoutRef<"li">) => <li className="leading-relaxed">{children}</li>,
  blockquote: ({ children }: React.ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote className="border-l-4 border-blue-600 bg-slate-50 pl-4 py-2.5 my-4 rounded-r-xl text-slate-650 italic text-xs md:text-sm">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-6 border-t border-[#ECECEC]" />,
  p: ({ children }: React.ComponentPropsWithoutRef<"p">) => <p className="leading-relaxed my-2.5 text-[#6B7280] text-xs md:text-sm font-medium">{children}</p>,
  a: ({ href, children }: React.ComponentPropsWithoutRef<"a">) => (
    <a href={href} className="text-blue-600 hover:underline font-semibold" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  )
};

function TypewriterText({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index += 5;
      if (index >= text.length) {
        setDisplayedText(text);
        clearInterval(interval);
        onComplete?.();
      } else {
        setDisplayedText(text.substring(0, index));
      }
    }, 8);

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
  const [recognition, setRecognition] = useState<unknown>(null);

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
  interface ApplianceItem {
    id: string;
    name: string;
    brand: string;
    model: string;
  }

  interface BookingItem {
    id: string;
  }

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [actualAppliances, setActualAppliances] = useState<ApplianceItem[]>([]);
  const [bookingApplianceId, setBookingApplianceId] = useState("");
  const [bookingProblem, setBookingProblem] = useState("");
  const [bookingServiceType, setBookingServiceType] = useState("Repair Check");
  const [bookingCost, setBookingCost] = useState("1500");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("10:00 AM - 12:00 PM");
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const loadConversations = useCallback((search = searchQuery) => {
    const url = `/api/v1/ai/conversations${search ? `?search=${encodeURIComponent(search)}` : ""}`;
    apiClient<ConversationSummary[]>(url)
      .then((data) => setConversations(data))
      .catch((err) => console.error("Error loading conversations list:", err));
  }, [searchQuery]);

  useEffect(() => {
    let active = true;
    const init = async () => {
      await Promise.resolve();
      if (!active) return;

      apiClient<{ fullName: string }>("/api/v1/auth/me")
        .then((data) => {
          if (data?.fullName) {
            const names = data.fullName.trim().split(/\s+/);
            const initials = names.map((n: string) => n[0]).join("").substring(0, 2).toUpperCase();
            setUserInitials(initials || "U");
          }
        })
        .catch(() => setUserInitials("U"));

      apiClient<AiContextResponse>("/api/v1/ai/context")
        .then((data) => setAiContext(data))
        .catch((err) => console.error("Error fetching AI Context:", err));

      loadConversations();
    };
    init();
    return () => {
      active = false;
    };
  }, [loadConversations]);

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
        role: m.role as "system" | "user" | "assistant",
        content: m.content,
        timestamp: new Date(m.timestamp)
      }));
      setMessages(mapped);
    } catch (err: unknown) {
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

  const handleSend = useCallback(async (text: string) => {
    const msgText = text.trim();
    
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
    } catch (err: unknown) {
      console.error("AI Assistant request error:", err);
      const apiErr = err as { message?: string };
      setError(apiErr?.message ?? "An error occurred while getting response from the AI co-pilot. Please try again.");
    } finally {
      setLoading(false);
      setInputState("idle");
    }
  }, [messages, activeConversationId, selectedFile]);

  const speakMessage = (content: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        showToast("Speech stopped.");
        return;
      }
      const cleanText = content.replace(/[*#`\-]/g, "");
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.onend = () => {
        showToast("Speech finished.");
      };
      window.speechSynthesis.speak(utterance);
      showToast("Speaking response...");
    } else {
      showToast("Speech synthesis is not supported on this browser.");
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
    apiClient<ApplianceItem[]>("/api/v1/appliances")
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
      const res = await apiClient<BookingItem>("/api/v1/bookings", {
        method: "POST",
        body: JSON.stringify({
          applianceId: bookingApplianceId,
          serviceType: bookingServiceType.trim(),
          problemDescription: bookingProblem.trim(),
          bookingDate,
          bookingTime: bookingTime.trim(),
          status: "PENDING",
          estimatedCost: parseFloat(bookingCost) || 0.0
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



  // Microphone toggle recognition function
  const handleVoiceInput = async () => {
    interface SpeechRecognitionEvent {
      results: {
        [index: number]: {
          [index: number]: {
            transcript: string;
          };
        };
      };
    }
    interface SpeechRecognitionErrorEvent {
      error: string;
    }
    interface SpeechRecognitionInstance {
      continuous: boolean;
      interimResults: boolean;
      lang: string;
      onstart: (() => void) | null;
      onresult: ((event: SpeechRecognitionEvent) => void) | null;
      onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
      onend: (() => void) | null;
      start: () => void;
      stop: () => void;
    }

    const SpeechRecognition = (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionInstance; webkitSpeechRecognition?: new () => SpeechRecognitionInstance }).SpeechRecognition || (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionInstance; webkitSpeechRecognition?: new () => SpeechRecognitionInstance }).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast("Voice input is not supported by this browser.");
      return;
    }

    if (isListening) {
      if (recognition) {
        (recognition as SpeechRecognitionInstance).stop();
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

      rec.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput(prev => prev + (prev ? " " : "") + transcript);
          showToast("Speech recognized");
        }
      };

      rec.onerror = (event: SpeechRecognitionErrorEvent) => {
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
    } catch (err: unknown) {
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
      <div className="space-y-1.5 mt-5">
        <h4 className="text-[10px] uppercase tracking-[0.15em] font-bold text-[#6B7280] px-3.5 py-1 flex items-center justify-between">
          <span>{title}</span>
          {isPinnedSection && <Pin className="h-3 w-3 text-blue-600" />}
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
              className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer text-xs transition-all duration-200 border ${
                activeConversationId === c.id
                  ? "bg-blue-50/50 border-blue-100 text-blue-600 font-semibold"
                  : "border-transparent text-[#6B7280] hover:bg-slate-50 hover:text-[#111111]"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <MessageSquare className="h-4 w-4 text-slate-400 shrink-0 group-hover:text-blue-500 transition-colors" />
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
                    className="w-full bg-white border border-[#ECECEC] px-1.5 py-0.5 rounded-lg outline-none text-xs"
                  />
                ) : (
                  <span className="truncate pr-1">{c.title}</span>
                )}
              </div>

              {editingId !== c.id && (
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingId(c.id);
                      setEditTitle(c.title);
                    }}
                    className="hover:text-blue-600 text-slate-450 p-0.5 transition-colors"
                    title="Rename"
                  >
                    <Edit2 className="h-3 w-3" />
                  </button>
                  <button
                    onClick={(e) => togglePin(c.id, e)}
                    className={`p-0.5 transition-colors ${isPinned ? "text-blue-600 hover:text-slate-450" : "text-slate-450 hover:text-blue-600"}`}
                    title={isPinned ? "Unpin" : "Pin"}
                  >
                    <Pin className="h-3 w-3" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteConversation(c.id, e)}
                    className="hover:text-rose-600 text-slate-450 p-0.5 transition-colors"
                    title="Delete"
                  >
                    <Trash className="h-3 w-3" />
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
    let score = 98;
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
    return count;
  }, [aiContext]);

  const HealthScoreCircle = ({ score }: { score: number }) => {
    const radius = 28;
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
            strokeWidth="5"
          />
          <motion.circle
            cx="40"
            cy="40"
            r={radius}
            className="stroke-emerald-500 fill-none"
            strokeWidth="5"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute text-center flex flex-col items-center">
          <span className="text-base font-black text-slate-800 tracking-tighter">{score}%</span>
          <span className="text-[7px] text-[#6B7280] block font-bold tracking-wider uppercase">Health</span>
        </div>
      </div>
    );
  };

  const renderContextPanelContent = () => (
    <div className="space-y-6 text-left">
      {/* Home Overview */}
      <div className="bg-white border border-[#ECECEC] rounded-[24px] p-5 space-y-4 shadow-[0_12px_40px_rgba(0,0,0,0.02)]">
        <h3 className="text-[10px] font-bold text-[#6B7280] flex items-center gap-2 uppercase tracking-widest">
          <Home className="h-4 w-4 text-blue-600" />
          <span>Home Summary</span>
        </h3>
        <div className="grid grid-cols-2 gap-3.5">
          <div className="bg-[#F8F9FB] border border-[#ECECEC] rounded-xl p-3">
            <span className="text-[9px] text-[#6B7280] block font-bold uppercase tracking-wider">Rooms</span>
            <span className="text-base font-extrabold text-[#111111]">{aiContext?.roomsCount ?? 0}</span>
          </div>
          <div className="bg-[#F8F9FB] border border-[#ECECEC] rounded-xl p-3">
            <span className="text-[9px] text-[#6B7280] block font-bold uppercase tracking-wider">Devices</span>
            <span className="text-base font-extrabold text-[#111111]">{aiContext?.appliancesCount ?? 0}</span>
          </div>
          <div className="bg-[#F8F9FB] border border-[#ECECEC] rounded-xl p-3">
            <span className="text-[9px] text-[#6B7280] block font-bold uppercase tracking-wider">Active Coverages</span>
            <span className="text-base font-extrabold text-[#111111]">{warrantyStats.active}</span>
          </div>
          <div className="bg-[#F8F9FB] border border-[#ECECEC] rounded-xl p-3">
            <span className="text-[9px] text-[#6B7280] block font-bold uppercase tracking-wider">Services</span>
            <span className="text-base font-extrabold text-[#111111]">{upcomingServicesCount}</span>
          </div>
        </div>
      </div>

      {/* Appliance Health Circle */}
      <div className="bg-white border border-[#ECECEC] rounded-[24px] p-5 text-center space-y-4 shadow-[0_12px_40px_rgba(0,0,0,0.02)]">
        <h3 className="text-[10px] font-bold text-[#6B7280] flex items-center justify-center gap-2 uppercase tracking-widest">
          <Activity className="h-4 w-4 text-emerald-500" />
          <span>System Health</span>
        </h3>
        <HealthScoreCircle score={overallHealthScore} />
        <p className="text-[10px] text-[#6B7280] leading-normal font-medium max-w-[200px] mx-auto">
          Calculated dynamically across active devices, warranties, and maintenance checks.
        </p>
      </div>

      {/* Warranty Status */}
      <div className="bg-white border border-[#ECECEC] rounded-[24px] p-5 space-y-4 shadow-[0_12px_40px_rgba(0,0,0,0.02)]">
        <h3 className="text-[10px] font-bold text-[#6B7280] flex items-center gap-2 uppercase tracking-widest">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span>Warranty Alerts</span>
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs font-medium">
            <span className="flex items-center gap-2 text-[#6B7280]">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Safe / Active</span>
            </span>
            <span className="font-extrabold text-[#111111]">{warrantyStats.safe}</span>
          </div>
          <div className="flex justify-between items-center text-xs font-medium">
            <span className="flex items-center gap-2 text-[#6B7280]">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <span>Expiring Soon</span>
            </span>
            <span className="font-extrabold text-[#111111]">{warrantyStats.expiring}</span>
          </div>
          <div className="flex justify-between items-center text-xs font-medium">
            <span className="flex items-center gap-2 text-[#6B7280]">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              <span>Expired Policies</span>
            </span>
            <span className="font-extrabold text-[#111111]">{warrantyStats.expired}</span>
          </div>
        </div>
      </div>

      {/* Recent Diagnostics / Upcoming Maintenance */}
      <div className="bg-white border border-[#ECECEC] rounded-[24px] p-5 space-y-4 shadow-[0_12px_40px_rgba(0,0,0,0.02)]">
        <h3 className="text-[10px] font-bold text-[#6B7280] flex items-center gap-2 uppercase tracking-widest">
          <Sparkles className="h-4 w-4 text-amber-500" />
          <span>Upcoming Maintenance</span>
        </h3>
        <div className="space-y-3.5 text-xs font-medium">
          <div className="border-l-2 border-blue-600 pl-3 py-0.5">
            <div className="font-bold text-[#111111]">HVAC System check</div>
            <div className="text-[10px] text-[#6B7280] mt-0.5">Health index at 94%</div>
          </div>
          <div className="border-l-2 border-emerald-500 pl-3 py-0.5">
            <div className="font-bold text-[#111111]">RO Water Purifier</div>
            <div className="text-[10px] text-[#6B7280] mt-0.5">Filter status checks OK</div>
          </div>
        </div>
      </div>

      {/* Suggested Actions */}
      <div className="bg-white border border-[#ECECEC] rounded-[24px] p-5 space-y-4 shadow-[0_12px_40px_rgba(0,0,0,0.02)]">
        <h3 className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Quick AI Actions</h3>
        <div className="grid grid-cols-2 gap-2 text-[10px]">
          <Button
            type="button"
            onClick={() => handleOpenBookingModal("Routine system checkup")}
            variant="outline"
            className="h-9 rounded-xl font-bold border-[#ECECEC] text-[#6B7280] hover:bg-slate-50 hover:text-black transition-all text-[10px] px-2 cursor-pointer"
          >
            Book Tech
          </Button>
          <Button
            type="button"
            onClick={() => router.push("/onboarding/appliances")}
            variant="outline"
            className="h-9 rounded-xl font-bold border-[#ECECEC] text-[#6B7280] hover:bg-slate-50 hover:text-black transition-all text-[10px] px-2 cursor-pointer"
          >
            Add Appliance
          </Button>
          <Button
            type="button"
            onClick={() => router.push("/dashboard/warranty-vault")}
            variant="outline"
            className="h-9 rounded-xl font-bold border-[#ECECEC] text-[#6B7280] hover:bg-slate-50 hover:text-black transition-all text-[10px] px-2 cursor-pointer"
          >
            Warranty Vault
          </Button>
          <Button
            type="button"
            onClick={() => router.push("/dashboard/marketplace")}
            variant="outline"
            className="h-9 rounded-xl font-bold border-[#ECECEC] text-[#6B7280] hover:bg-slate-50 hover:text-black transition-all text-[10px] px-2 cursor-pointer"
          >
            Marketplace
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-100px)] w-full max-w-[1600px] mx-auto p-4 md:p-6 gap-6 relative overflow-hidden text-left bg-[#F8F9FB] font-sans">
      
      {/* Toast alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -25 }}
            animate={{ opacity: 1, y: 10 }}
            exit={{ opacity: 0, y: -25 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 bg-black text-white text-xs md:text-sm font-bold px-6 py-3 rounded-2xl shadow-2xl z-50 flex items-center gap-2.5 border border-slate-800"
          >
            <ShieldCheck className="h-4.5 w-4.5 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEFT SIDEBAR - Recent Chats */}
      <div className="w-[300px] xl:w-[320px] shrink-0 border border-[#ECECEC] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.02)] rounded-[24px] flex flex-col overflow-hidden hidden lg:flex">
        <div className="p-5 border-b border-[#ECECEC] space-y-4 shrink-0">
          <Button
            onClick={handleNewChat}
            className="w-full rounded-2xl font-bold text-xs h-11 gap-2 flex items-center justify-center bg-black hover:bg-black/90 text-white cursor-pointer shadow-sm transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>New Chat</span>
          </Button>

          <div className="relative flex items-center bg-[#F8F9FB] border border-[#ECECEC] rounded-xl px-3.5 py-1.5 focus-within:border-blue-600 transition-colors">
            <Search className="h-4 w-4 text-[#6B7280] mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search chat history..."
              className="bg-transparent border-0 outline-none text-xs w-full text-[#111111] placeholder:text-[#6B7280]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4.5 scrollbar-none space-y-4">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-[#6B7280] text-center space-y-2.5 px-4 opacity-60">
              <MessageSquare className="h-7 w-7 text-slate-400 shrink-0" />
              <span className="text-xs font-semibold">No recent chats</span>
            </div>
          ) : (
            <>
              {pinnedConversations.length > 0 && renderHistoryGroup("Pinned Chats", pinnedConversations, true)}
              {renderHistoryGroup("Today", groupedConversations.today)}
              {renderHistoryGroup("Yesterday", groupedConversations.yesterday)}
              {renderHistoryGroup("Last 7 Days", groupedConversations.last7Days)}
              {renderHistoryGroup("Older", groupedConversations.older)}
            </>
          )}
        </div>
      </div>

      {/* CENTER WORKSPACE */}
      <div className="flex-1 min-w-0 flex flex-col rounded-[24px] border border-[#ECECEC] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.02)] overflow-hidden relative">
        
        {/* Top bar header details */}
        <div className="px-6 py-4 border-b border-[#ECECEC] bg-white flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="rounded-xl h-9 w-9 lg:hidden shrink-0 border border-[#ECECEC]"
            >
              <Menu className="h-4.5 w-4.5 text-[#111111]" />
            </Button>
            <button
              onClick={handleBackToHome}
              className="text-xs font-bold text-[#6B7280] hover:text-[#111111] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              ← Dashboard Overview
            </button>
          </div>

          <div className="text-sm font-extrabold text-[#111111] lg:hidden truncate max-w-[140px]">
            Dwellix AI
          </div>

          <div className="flex items-center gap-3">
            {aiContext && aiContext.homeName ? (
              <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-xl border border-[#ECECEC] bg-[#F8F9FB] text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
                <Home className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                <span>{aiContext.homeName}</span>
                <ChevronDown className="h-3 w-3 text-slate-400 ml-1 shrink-0" />
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span>Dwellix System Hub</span>
              </div>
            )}
            
            {/* Clear and New chat helpers */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              disabled={messages.length === 0}
              className="text-xs font-bold text-slate-500 hover:text-rose-600 rounded-xl cursor-pointer"
            >
              Clear
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDrawerOpen(true)}
              className="rounded-xl h-9 w-9 lg:hidden shrink-0 border border-[#ECECEC]"
            >
              <Sparkles className="h-4.5 w-4.5 text-blue-600" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDrawerOpen(true)}
              className="hidden lg:flex xl:hidden text-xs text-blue-600 font-extrabold items-center gap-1 rounded-xl hover:bg-slate-50 cursor-pointer"
            >
              <span>Insights</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Viewport chat log wrapper */}
        <div className="flex-grow overflow-y-auto flex flex-col scrollbar-none bg-[#F8F9FB]/20">
          <AnimatePresence mode="wait">
            {messages.length === 0 ? (
              /* Suggestion prompt cards */
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex-1 flex flex-col items-center justify-center p-8 md:p-16 text-center max-w-3xl mx-auto w-full"
              >
                <div className="relative mb-6 shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-indigo-500/20 rounded-full filter blur-xl opacity-60 animate-pulse scale-125" />
                  <div className="relative h-20 w-20 rounded-[2.2rem] bg-black text-white flex items-center justify-center shadow-lg shadow-black/10">
                    <Bot className="h-10 w-10 text-white" />
                  </div>
                </div>

                <h1 className="text-3xl font-extrabold tracking-tight text-[#111111] mb-2 leading-none">
                  How can I help you, {userInitials === "U" ? "Homeowner" : "Guest"}?
                </h1>
                <p className="text-sm text-[#6B7280] max-w-md mb-10 leading-relaxed font-medium">
                  Ask troubleshooting checks, catalog error codes, or verify appliance warranty status.
                </p>

                {aiContext && aiContext.appliancesCount === 0 && (
                  <div className="p-4 mb-8 rounded-[20px] bg-amber-50/50 border border-amber-100 text-amber-800 text-xs md:text-sm font-semibold flex items-center gap-3 max-w-xl mx-auto shadow-xs text-left">
                    <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                    <span>No registered appliances yet. Add appliance profiles to access custom co-pilot recommendations.</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full text-left">
                  {PRESETS.map((preset, idx) => {
                    const Icon = preset.icon;
                    return (
                      <motion.button
                        key={idx}
                        whileHover={{ y: -3, boxShadow: "0 12px 24px rgba(0,0,0,0.03)" }}
                        onClick={() => handleSend(preset.prompt)}
                        className="group p-4.5 rounded-[22px] border border-[#ECECEC] bg-white hover:border-blue-600/40 hover:shadow-sm transition-all duration-300 flex items-start gap-4 cursor-pointer"
                      >
                        <div className={`h-10 w-10 rounded-xl ${preset.color} flex items-center justify-center shrink-0 border group-hover:scale-105 transition-transform duration-300`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <h3 className="text-xs font-extrabold text-[#111111] group-hover:text-blue-600 mb-0.5 truncate">
                            {preset.label}
                          </h3>
                          <p className="text-[11px] text-[#6B7280] line-clamp-2 leading-relaxed font-medium">
                            {preset.desc}
                          </p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              /* Chat log message feed */
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 scrollbar-none max-w-4xl mx-auto w-full">
                <AnimatePresence initial={false}>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex gap-5 w-full ${
                        message.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                      }`}
                    >
                      {/* Avatar badge */}
                      {message.role === "user" ? (
                        <div className="h-10 w-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm border border-slate-800">
                          {userInitials}
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-[#F8F9FB] border border-[#ECECEC] text-[#111111] flex items-center justify-center shrink-0 shadow-xs">
                          <Bot className="h-5.5 w-5.5" />
                        </div>
                      )}

                      {/* Msg bubble container */}
                      <div className={`space-y-2 max-w-[80%] flex flex-col ${message.role === "user" ? "items-end" : "items-start"}`}>
                        <div className="flex items-end gap-3.5">
                          {message.role === "user" && (
                            <span className="text-[9px] text-[#6B7280] font-bold select-none self-end pb-2">
                              {formatTime(message.timestamp)}
                            </span>
                          )}
                          
                          <div
                            className={`p-5 rounded-[24px] text-sm leading-relaxed text-left border ${
                              message.role === "user"
                                ? "bg-black border-slate-950 text-white rounded-tr-none shadow-sm"
                                : "bg-white border-[#ECECEC] text-[#111111] rounded-tl-none shadow-sm"
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
                            <span className="text-[9px] text-[#6B7280] font-bold select-none self-end pb-2">
                              {formatTime(message.timestamp)}
                            </span>
                          )}
                        </div>

                        {/* Booking card recommendations */}
                        {message.role === "assistant" && !message.isTypingEnabled && shouldRecommendService(message.content) && !dismissedRecommendations.includes(message.id) && (
                          <div className="mt-3 p-5 border border-blue-100 bg-blue-50/50 rounded-[22px] flex flex-col sm:flex-row sm:items-center justify-between gap-5 w-full max-w-xl shadow-xxs">
                            <div className="space-y-1.5 text-left">
                              <h4 className="font-extrabold text-blue-900 text-xs flex items-center gap-1.5">
                                <Wrench className="h-4 w-4 text-blue-600 animate-pulse shrink-0" />
                                <span>Certified Technician Dispatch</span>
                              </h4>
                              <p className="text-[11px] text-slate-500 font-medium">
                                The diagnostic query suggests scheduling a local certified maintenance checkup.
                              </p>
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <Button
                                onClick={() => {
                                  const promptText = messages.find(m => m.role === 'user')?.content || "Troubleshoot appliance fault";
                                  handleOpenBookingModal(promptText);
                                }}
                                className="h-8.5 rounded-xl px-4 font-bold text-[10px] bg-black text-white hover:bg-black/90 cursor-pointer"
                              >
                                Book Tech
                              </Button>
                              <Button
                                onClick={() => {
                                  setDismissedRecommendations(prev => [...prev, message.id]);
                                }}
                                variant="outline"
                                className="h-8.5 rounded-xl px-3.5 font-bold text-[10px] border-[#ECECEC] text-[#6B7280] cursor-pointer bg-white"
                              >
                                Dismiss
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Actions block recommendations */}
                        {message.role === "assistant" && !message.isTypingEnabled && getSuggestedActions(message.content).length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 w-full max-w-lg">
                            {getSuggestedActions(message.content).map((action, aIdx) => (
                              <button
                                key={aIdx}
                                onClick={() => handleActionClick(action.label)}
                                className="flex items-start gap-3 p-3.5 rounded-[20px] border border-[#ECECEC] bg-white hover:bg-[#F8F9FB] hover:border-slate-400 transition-all text-left group cursor-pointer"
                              >
                                <div className="h-8 w-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                  {action.actionType === "book" && <Wrench className="h-4 w-4" />}
                                  {action.actionType === "reminder" && <ShieldCheck className="h-4 w-4" />}
                                  {action.actionType === "schedule" && <Activity className="h-4 w-4" />}
                                  {action.actionType === "note" && <FileText className="h-4 w-4" />}
                                </div>
                                <div>
                                  <div className="font-extrabold text-[#111111] text-[11px] group-hover:text-blue-600 transition-colors">
                                    {action.label}
                                  </div>
                                  <div className="text-[9px] text-[#6B7280] font-medium leading-normal line-clamp-1 mt-0.5">
                                    {action.description}
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Feedback, copy, and regen */}
                        {message.role === "assistant" && (
                          <div className="flex flex-wrap items-center gap-4 px-2 text-[10px] text-[#6B7280] font-bold mt-1.5 select-none">
                            {message.modelUsed && (
                              <span className="flex items-center gap-1 text-[#6B7280] font-bold">
                                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                                <span>Co-Pilot AI</span>
                              </span>
                            )}

                            <div className="flex items-center gap-3.5">
                              <button
                                onClick={() => handleFeedback(message.id, "helpful")}
                                className={`hover:text-black transition-colors cursor-pointer flex items-center gap-1 ${
                                  helpfulMap[message.id] === "helpful" ? "text-emerald-650" : ""
                                }`}
                              >
                                <ThumbsUp className="h-3.5 w-3.5" />
                                <span>Helpful</span>
                              </button>
                              <button
                                onClick={() => handleFeedback(message.id, "unhelpful")}
                                className={`hover:text-rose-650 transition-colors cursor-pointer flex items-center gap-1 ${
                                  helpfulMap[message.id] === "unhelpful" ? "text-rose-650" : ""
                                }`}
                              >
                                <ThumbsDown className="h-3.5 w-3.5" />
                                <span>Not Helpful</span>
                              </button>
                              <button
                                onClick={() => handleCopyMessage(message.id, message.content)}
                                className="hover:text-black transition-colors cursor-pointer flex items-center gap-1"
                              >
                                {copiedMessageId === message.id ? (
                                  <>
                                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                                    <span>Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3.5 w-3.5" />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => speakMessage(message.content)}
                                className="hover:text-black transition-colors cursor-pointer flex items-center gap-1"
                                title="Listen to response"
                              >
                                <Volume2 className="h-3.5 w-3.5" />
                                <span>Speak</span>
                              </button>
                              {messages[messages.length - 1].id === message.id && (
                                <button
                                  onClick={handleRegenerate}
                                  className="hover:text-black transition-colors cursor-pointer flex items-center gap-1"
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

                {/* Shimmer loading checks */}
                {loading && (
                  <div className="flex gap-5 max-w-2xl mr-auto">
                    <div className="h-10 w-10 rounded-full bg-[#F8F9FB] border border-[#ECECEC] text-[#111111] flex items-center justify-center shrink-0 animate-pulse">
                      <Bot className="h-5.5 w-5.5" />
                    </div>
                    <div className="p-5 rounded-[24px] rounded-tl-none bg-white border border-[#ECECEC] shadow-sm flex flex-col gap-3 min-w-[240px]">
                      <div className="flex items-center gap-1.5 text-xs text-[#6B7280] font-bold">
                        <Sparkles className="h-4 w-4 text-blue-600 animate-pulse" />
                        <span>Dwellix is thinking...</span>
                      </div>
                      <div className="flex items-center gap-1 px-1.5 py-1">
                        <span className="h-2 w-2 bg-blue-600/70 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="h-2 w-2 bg-blue-600/70 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="h-2 w-2 bg-blue-600/70 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Error panel info */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-start gap-4 p-5 rounded-[22px] bg-rose-50/50 border border-rose-100 text-rose-800 text-xs md:text-sm font-medium max-w-2xl mx-auto shadow-xxs text-left"
                  >
                    <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                    <div className="space-y-1.5">
                      <div className="font-extrabold text-rose-900">Inference Request Failed</div>
                      <p className="text-rose-700 leading-relaxed">{error}</p>
                      <button
                        onClick={handleRegenerate}
                        className="mt-2.5 flex items-center gap-1.5 text-[11px] font-extrabold text-rose-800 hover:text-rose-950 border-b border-rose-800/40 hover:border-rose-950 cursor-pointer"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>Retry query request</span>
                      </button>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Input panel prompt area */}
        <div className="p-5 border-t border-[#ECECEC] bg-white shrink-0">
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

            <div className="relative rounded-[24px] bg-white border border-[#ECECEC] focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 shadow-[0_8px_30px_rgb(0,0,0,0.01)] p-3.5 transition-all flex flex-col gap-2.5">
              
              {/* Attachment panel previews */}
              {selectedFile && (
                <div className="flex flex-col gap-1.5 ml-2.5 self-start">
                  <div className="flex items-center gap-3 p-2 bg-[#F8F9FB] border border-[#ECECEC] rounded-2xl max-w-xs relative">
                    {filePreview ? (
                      <img
                        src={filePreview}
                        alt="Preview"
                        className="h-10 w-10 object-cover rounded-lg border border-[#ECECEC]"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">
                        PDF
                      </div>
                    )}
                    <div className="min-w-0 flex-1 text-left">
                      <div className="text-xs font-bold text-slate-800 truncate">{selectedFile.name}</div>
                      <div className="text-[9px] text-[#6B7280] font-medium">{(selectedFile.size / 1024).toFixed(1)} KB</div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={handleRemoveFile}
                      className="h-7 w-7 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <span className="text-[10px] text-amber-600 font-semibold flex items-center gap-1.5 mt-0.5 text-left animate-pulse">
                    <AlertTriangle className="h-3 w-3" />
                    <span>The current AI model does not support document uploads.</span>
                  </span>
                </div>
              )}

              {/* Microphone listener visualizer */}
              {isListening && (
                <div className="flex items-center gap-2 px-3.5 py-2 bg-rose-50/50 border border-rose-100 rounded-xl animate-pulse self-start ml-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping" />
                  <span className="text-[9px] font-bold text-rose-600 uppercase tracking-widest">Listening... Speak Now</span>
                  <div className="flex items-center gap-0.5 ml-3">
                    <span className="h-3.5 w-0.5 bg-rose-500 animate-[bounce_0.8s_infinite]" style={{ animationDelay: "0ms" }} />
                    <span className="h-4.5 w-0.5 bg-rose-500 animate-[bounce_0.8s_infinite]" style={{ animationDelay: "150ms" }} />
                    <span className="h-3 w-0.5 bg-rose-500 animate-[bounce_0.8s_infinite]" style={{ animationDelay: "300ms" }} />
                    <span className="h-5 w-0.5 bg-rose-500 animate-[bounce_0.8s_infinite]" style={{ animationDelay: "450ms" }} />
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
                placeholder={isListening ? "Listening..." : "Ask Dwellix AI anything..."}
                className="w-full px-4 py-2 bg-transparent text-sm resize-none overflow-y-auto leading-relaxed outline-none border-0 focus:ring-0 focus:border-0 scrollbar-none min-h-[44px] max-h-[160px] text-[#111111] placeholder:text-[#6B7280] font-medium"
              />
              
              {/* Attachments / mic action footer */}
              <div className="flex items-center justify-between border-t border-[#ECECEC]/70 pt-3 px-1.5">
                <div className="flex items-center gap-1.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-9.5 w-9.5 rounded-xl text-slate-400 hover:text-black hover:bg-slate-50 cursor-pointer"
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
                    className={`h-9.5 w-9.5 rounded-xl transition-all cursor-pointer ${
                      isListening
                        ? "bg-rose-500 text-white hover:bg-rose-600 animate-pulse"
                        : "text-slate-400 hover:text-black hover:bg-slate-50"
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
                  className="h-9.5 rounded-xl px-5 bg-black hover:bg-black/90 text-white flex items-center justify-center gap-2 font-semibold text-xs shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="h-3.5 w-3.5 text-white" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* RIGHT CONTEXT PANEL */}
      <div className="w-[320px] xl:w-[340px] shrink-0 border border-[#ECECEC] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.02)] rounded-[24px] hidden xl:flex flex-col overflow-y-auto p-5 space-y-5 scrollbar-none">
        {renderContextPanelContent()}
      </div>

      {/* Mobile Context Drawer Overlay */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-black z-50 cursor-pointer xl:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-50 flex flex-col p-6 overflow-y-auto xl:hidden"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#ECECEC] mb-5 shrink-0 text-left">
                <div>
                  <h2 className="text-sm font-extrabold text-[#111111] flex items-center gap-2 uppercase tracking-widest">
                    <Sparkles className="h-4.5 w-4.5 text-blue-600" />
                    <span>AI Context Insights</span>
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDrawerOpen(false)}
                  className="rounded-full h-8 w-8 hover:bg-slate-50"
                >
                  <X className="h-4.5 w-4.5 text-[#111111]" />
                </Button>
              </div>
              {renderContextPanelContent()}
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
              className="fixed top-0 left-0 h-full w-72 bg-white z-50 flex flex-col p-5 md:hidden border-r border-[#ECECEC]"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#ECECEC] shrink-0">
                <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Chat History</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="rounded-full h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="py-4 shrink-0">
                <Button
                  onClick={() => {
                    handleNewChat();
                    setIsMobileSidebarOpen(false);
                  }}
                  className="w-full rounded-xl font-bold text-xs h-10 gap-2 flex items-center justify-center bg-black text-white hover:bg-black/90 cursor-pointer shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span>New Chat</span>
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-4 text-left scrollbar-none">
                {conversations.length === 0 ? (
                  <div className="text-center py-12 text-[#6B7280] text-xs">No recent chats</div>
                ) : (
                  <>
                    {pinnedConversations.length > 0 && renderHistoryGroup("Pinned Chats", pinnedConversations, true)}
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

      {/* Recommended Booking Modal Dialog */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[28px] border border-[#ECECEC] p-6 max-w-lg w-full shadow-2xl space-y-5 text-left relative overflow-hidden"
            >
              <div className="flex items-center justify-between pb-3.5 border-b border-[#ECECEC]">
                <h3 className="text-base font-extrabold text-[#111111] flex items-center gap-1.5">
                  <Wrench className="h-5 w-5 text-blue-600" />
                  <span>AI Recommended Dispatch</span>
                </h3>
                <button
                  onClick={() => setIsBookingModalOpen(false)}
                  className="rounded-full hover:bg-slate-50 p-1.5 transition-colors cursor-pointer"
                >
                  <X className="h-4.5 w-4.5 text-slate-500" />
                </button>
              </div>

              <form onSubmit={handleConfirmBooking} className="space-y-4 text-xs text-slate-700">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Select Appliance *</label>
                  {actualAppliances.length === 0 ? (
                    <div className="p-3.5 border border-amber-100 bg-amber-50/50 rounded-xl text-amber-800">
                      No appliances registered. Add one first.
                    </div>
                  ) : (
                    <select
                      value={bookingApplianceId}
                      onChange={(e) => setBookingApplianceId(e.target.value)}
                      className="w-full h-11 rounded-xl border border-[#ECECEC] bg-white text-xs px-3 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 text-slate-700 font-semibold"
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
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Service Type *</label>
                    <select
                      value={bookingServiceType}
                      onChange={(e) => setBookingServiceType(e.target.value)}
                      className="w-full h-11 rounded-xl border border-[#ECECEC] bg-white text-xs px-3 focus:outline-none text-slate-700 font-semibold"
                    >
                      <option value="Repair Check">Repair Check</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Deep Cleaning">Deep Cleaning</option>
                      <option value="Installation">Installation</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Estimated Cost (₹)</label>
                    <Input
                      type="number"
                      value={bookingCost}
                      onChange={(e) => setBookingCost(e.target.value)}
                      className="h-11 rounded-xl text-xs border-[#ECECEC]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Preferred Date *</label>
                    <Input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="h-11 rounded-xl text-xs border-[#ECECEC]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Time Slot *</label>
                    <select
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full h-11 rounded-xl border border-[#ECECEC] bg-white text-xs px-3 focus:outline-none text-slate-700 font-semibold"
                    >
                      <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
                      <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
                      <option value="01:00 PM - 03:00 PM">01:00 PM - 03:00 PM</option>
                      <option value="03:00 PM - 05:00 PM">03:00 PM - 05:00 PM</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Problem Description *</label>
                  <textarea
                    value={bookingProblem}
                    onChange={(e) => setBookingProblem(e.target.value)}
                    rows={3}
                    className="w-full rounded-xl border border-[#ECECEC] bg-white text-xs p-3.5 focus:outline-none text-slate-700 leading-relaxed resize-none font-medium"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-4 border-t border-[#ECECEC]">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsBookingModalOpen(false)}
                    className="rounded-xl text-xs font-bold h-10 border-[#ECECEC] text-slate-700 hover:bg-slate-50 cursor-pointer bg-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={bookingSubmitting || actualAppliances.length === 0}
                    className="rounded-xl text-xs font-bold h-10 bg-black text-white hover:bg-black/95 cursor-pointer"
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
