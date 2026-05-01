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
      cover: "",
      price: "",
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

  const handleInviteFriend = () => {
    alert("친구 초대 기능");
  };

  if (!nickname) {
    return <LoginScreen onLogin={(name) => setNickname(name)} />;
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
            <div
              key={book.id}
              onClick={() => setSelectedBook(book)}
              className="group cursor-pointer"
            >
              <div
                className="aspect-[3/4] rounded-sm shadow-sm group-hover:shadow-xl transition-all duration-500 relative overflow-hidden mb-3"
                style={{
                  backgroundImage: book.cover ? `url(${book.cover})` : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundColor: book.cover ? undefined : book.coverColor,
                }}
              >
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                {book.hasFeedback && (
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-indigo-600 shadow-sm">
                    AI
                  </div>
                )}
              </div>

              <h3 className="font-bold text-sm leading-tight mb-1 group-hover:text-indigo-600 transition-colors flex justify-between">
                <span>{book.title}</span>
                {book.price && (
                  <span className="text-xs text-gray-400">
                    {book.price}원
                  </span>
                )}
              </h3>

              <p className="text-xs text-gray-400 font-medium">
                {book.author}
              </p>
            </div>
          ))}
        </div>
      </main>

      {selectedBook && (
        <BookDetail
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}

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

    setChat((prev) => [
      ...prev,
      { id: Date.now(), text: trimmed, role: "user" },
    ]);
    setInput("");
  };

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      <button onClick={onClose}>
        <ArrowLeft />
      </button>

      <div
        className="w-32 h-44"
        style={{
          backgroundImage: book.cover ? `url(${book.cover})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: book.cover ? undefined : book.coverColor,
        }}
      />

      <h2>{book.title}</h2>
      <p>{book.author}</p>

      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={16} />
        ))}
      </div>

      {book.price && <p>{book.price}원</p>}
    </div>
  );
}

function LoginScreen({ onLogin }) {
  const [name, setName] = useState("");

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center px-8">
      <div className="w-full max-w-xs text-center">
        <h1 className="text-5xl font-serif italic font-bold text-indigo-950 mb-4">
          Sententia
        </h1>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="필명"
          className="w-full p-4"
        />

        <button onClick={() => onLogin(name)}>입장</button>
      </div>
    </div>
  );
}

function AddBookModal({ onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [summary, setSummary] = useState("");
  const [review, setReview] = useState("");

  const handleSave = async () => {
    try {
      const res = await fetch(
        `/api/naver?q=${encodeURIComponent(title + " " + author)}`
      );
      const data = await res.json();

      const best =
        data.find((item) => item.title.includes(title)) || data[0];

      onSave({
        id: Date.now(),
        title,
        author,
        summary,
        review,
        rating: 5,
        coverColor: "#D4C5E8",
        cover: best?.cover || "",
        price: best?.price || "",
        hasFeedback: true,
        aiReport: "AI 분석 중...",
        date: new Date().toLocaleDateString(),
      });
    } catch {
      alert("검색 실패");
    }
  };

  return (
    <div>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <input value={author} onChange={(e) => setAuthor(e.target.value)} />
      <textarea value={summary} onChange={(e) => setSummary(e.target.value)} />
      <textarea value={review} onChange={(e) => setReview(e.target.value)} />
      <button onClick={handleSave}>저장</button>
    </div>
  );
}
