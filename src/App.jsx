import React, { useState, useEffect } from "react";
import {
  Plus,
  Star,
  Sparkles,
  Send,
  ArrowLeft,
  UserCircle2,
  MessageSquare,
  Quote,
} from "lucide-react";

export default function SententiaApp() {
  const [books, setBooks] = useState([
    {
      id: 1,
      title: "데미안",
      author: "헤르만 헤세",
      rating: 5,
      summary: "내 속에서 솟아 나오려는 것, 바로 그것을 나는 살아보려고 했다.",
      review:
        "알을 깨고 나오는 투쟁의 과정이 현재의 나에게 큰 울림을 주었다. 아브락사스라는 존재에 대해 깊이 고민하게 됨.",
      coverColor: "#E8E0C5",
      hasFeedback: true,
      aiReport:
        "자아 성찰의 관점이 매우 훌륭합니다. 특히 '투쟁'이라는 키워드로 삶을 해석한 부분이 인상적이네요.",
      date: "2024.05.20",
    },
  ]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    const stored = window.localStorage.getItem("sententia_user");
    if (stored) setNickname(stored);
  }, []);

  useEffect(() => {
    if (nickname) {
      window.localStorage.setItem("sententia_user", nickname);
    }
  }, [nickname]);

  const handleInviteFriend = async () => {
    if ("contacts" in navigator && "select" in navigator.contacts) {
      try {
        const contacts = await navigator.contacts.select(["name", "tel"], {
          multiple: false,
        });
        if (contacts.length > 0) {
          alert(`${contacts[0].name[0]}님을 서재에 초대했습니다! (가상)`);
        }
      } catch (err) {
        console.error("연락처 연동 실패", err);
      }
    } else {
      alert("이 브라우저는 연락처 연동을 지원하지 않습니다. 링크를 복사해주세요.");
    }
  };

  if (!nickname) {
    return (
      <LoginScreen
        onLogin={(name) => {
          setNickname(name);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1A1A1A] font-sans selection:bg-indigo-100">
      <header className="sticky top-0 z-40 bg-[#FDFCFB]/80 backdrop-blur-md px-6 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-serif italic font-bold tracking-tight text-indigo-950">
          Sententia
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={handleInviteFriend}
            className="text-gray-500 hover:text-indigo-600 transition-colors"
          >
            <UserCircle2 size={24} strokeWidth={1.5} />
          </button>
          <button
            onClick={() => setIsAdding(true)}
            className="bg-indigo-950 text-white p-2 rounded-full shadow-lg active:scale-90 transition-transform"
          >
            <Plus size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 pb-24">
        <section className="mb-10 pt-4">
          <p className="text-sm text-gray-400 font-medium uppercase tracking-widest mb-1">
            My Archive
          </p>
          <h2 className="text-3xl font-bold">{nickname}님의 문장들</h2>
          <div className="flex gap-6 mt-6">
            <div>
              <p className="text-2xl font-serif font-bold">{books.length}</p>
              <p className="text-xs text-gray-400 uppercase">Books</p>
            </div>
            <div className="w-px h-10 bg-gray-100" />
            <div>
              <p className="text-2xl font-serif font-bold">
                {books.filter((b) => b.hasFeedback).length}
              </p>
              <p className="text-xs text-gray-400 uppercase">AI Insights</p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-2 gap-6">
          {books.map((book) => (
            <div key={book.id} onClick={() => setSelectedBook(book)} className="group cursor-pointer">
              <div
                className="aspect-[3/4] rounded-sm shadow-sm group-hover:shadow-xl transition-all duration-500 relative overflow-hidden mb-3"
                style={{ backgroundColor: book.coverColor }}
              >
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                {book.hasFeedback && (
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-indigo-600 shadow-sm">
                    AI
                  </div>
                )}
              </div>
              <h3 className="font-bold text-sm leading-tight mb-1 group-hover:text-indigo-600 transition-colors">
                {book.title}
              </h3>
              <p className="text-xs text-gray-400 font-medium">{book.author}</p>
            </div>
          ))}
        </div>
      </main>

      {selectedBook && <BookDetail book={selectedBook} onClose={() => setSelectedBook(null)} />}

      {isAdding && (
        <AddBookModal
          onClose={() => setIsAdding(false)}
          onSave={(newBook) => {
            setBooks([newBook, ...books]);
            setIsAdding(false);
          }}
        />
      )}
    </div>
  );
}

function BookDetail({ book, onClose }) {
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg = { id: Date.now(), text: trimmed, role: "user" };
    setChat((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      setChat((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: `'${book.title}'에 대한 당신의 생각에 동의합니다. 작가가 의도한 다른 측면은 어떻게 생각하시나요?`,
          role: "ai",
        },
      ]);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto animate-in slide-in-from-right duration-300">
      <div className="max-w-2xl mx-auto min-h-screen flex flex-col">
        <header className="p-6 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md">
          <button onClick={onClose} className="p-2 -ml-2 text-gray-400 hover:text-black">
            <ArrowLeft size={24} />
          </button>
          <span className="font-serif italic text-lg">Archive Detail</span>
          <div className="w-10" />
        </header>

        <div className="px-6 pb-20">
          <div className="flex gap-6 mb-10">
            <div className="w-32 h-44 rounded-sm shadow-lg shrink-0" style={{ backgroundColor: book.coverColor }} />
            <div className="flex flex-col justify-end">
              <h2 className="text-3xl font-bold mb-2 tracking-tighter">{book.title}</h2>
              <p className="text-gray-400 mb-4 font-medium">{book.author}</p>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className={i < book.rating ? "fill-indigo-600 text-indigo-600" : "text-gray-200"} />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-12">
            <section>
              <div className="flex items-center gap-2 mb-4 text-gray-400">
                <Quote size={16} />
                <span className="text-xs font-bold uppercase tracking-widest">한줄평</span>
              </div>
              <p className="text-xl font-serif italic text-indigo-900 leading-relaxed">"{book.summary}"</p>
            </section>

            <section className="bg-gray-50 p-8 rounded-2xl">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-4">
                독서 감상문
              </span>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                {book.review}
              </p>
            </section>

            <section className="bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100/50">
              <div className="flex items-center gap-2 mb-4 text-indigo-600">
                <Sparkles size={18} />
                <span className="text-xs font-bold uppercase tracking-widest">AI 비평 리포트</span>
              </div>
              <p className="text-indigo-900/80 text-sm leading-relaxed mb-6">{book.aiReport}</p>

              <div className="mt-8 pt-8 border-t border-indigo-100">
                <div className="flex items-center gap-2 mb-6">
                  <MessageSquare size={16} className="text-indigo-400" />
                  <span className="text-xs font-bold text-indigo-400 uppercase">AI 토론</span>
                </div>

                <div className="space-y-4 mb-6">
                  {chat.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${
                          msg.role === "user"
                            ? "bg-indigo-600 text-white shadow-md"
                            : "bg-white text-indigo-900 border border-indigo-100 shadow-sm"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="relative">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="AI에게 질문하거나 반론을 제기하세요..."
                    className="w-full bg-white border border-indigo-100 rounded-2xl px-5 py-4 pr-14 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                  <button
                    onClick={handleSend}
                    className="absolute right-2 top-2 p-3 bg-indigo-600 text-white rounded-xl active:scale-90 transition-transform"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginScreen({ onLogin }) {
  const [name, setName] = useState("");

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center px-8">
      <div className="w-full max-w-xs text-center">
        <h1 className="text-5xl font-serif italic font-bold text-indigo-950 mb-4 tracking-tighter">
          Sententia
        </h1>
        <p className="text-gray-400 text-sm mb-12">당신의 생각이 문장이 되는 공간</p>
        <div className="space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-4 bg-white border border-gray-100 rounded-2xl text-center focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
            placeholder="필명을 입력하세요"
          />
          <button
            disabled={!name.trim()}
            onClick={() => onLogin(name.trim())}
            className="w-full py-4 bg-indigo-950 text-white rounded-2xl font-bold shadow-xl active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
          >
            서재 입장하기
          </button>
        </div>
      </div>
    </div>
  );
}

function AddBookModal({ onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [summary, setSummary] = useState("");
  const [review, setReview] = useState("");

  const handleSave = () => {
    if (!title.trim() || !author.trim() || !summary.trim() || !review.trim()) {
      alert("모든 항목을 채워주세요.");
      return;
    }

    onSave({
      id: Date.now(),
      title: title.trim(),
      author: author.trim(),
      summary: summary.trim(),
      review: review.trim(),
      rating: 5,
      coverColor: "#D4C5E8",
      hasFeedback: true,
      aiReport: "글을 작성해주셔서 감사합니다. 분석을 시작합니다...",
      date: new Date().toLocaleDateString("ko-KR").replace(/\./g, ".").slice(0, -1),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-indigo-950/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-xl rounded-t-[2rem] sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
        <div className="p-8">
          <h2 className="text-2xl font-serif font-bold mb-6">새로운 문장 기록</h2>
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="책 제목"
              />
              <input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="저자"
              />
            </div>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 h-20"
              placeholder="나만의 한줄평"
            />
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 h-40"
              placeholder="상세한 감상문을 들려주세요. AI가 함께 고민해드립니다."
            />
            <button
              onClick={handleSave}
              className="w-full py-4 bg-indigo-950 text-white rounded-2xl font-bold flex items-center justify-center gap-2"
            >
              <Sparkles size={18} /> 기록 보관하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
