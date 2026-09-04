"use client";
import { useState } from "react";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [captions, setCaptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    setCaptions([]);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: topic }),
      });
      const data = await response.json();
      if(data.error) throw new Error(data.error)
      const captionList = data.result.split(/\d+\.\s/).filter((s: string) => s.trim() !== "");
      setCaptions(captionList);
    } catch (error) {
      setCaptions(["Error: API key check karo ya internet check karo"]);
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Welcome to your <br/> comfortzone</h1>
        <p>Funniest Captions Generator</p>
      </div>

      <div className="search-box">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="your dream captions topic..."
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
        />
        <button onClick={handleGenerate} disabled={loading} className="btn">
          {loading ? "Generating... ✨" : "Explore Now ✨"}
        </button>
      </div>

      {captions.length > 0 && (
        <div className="result-grid">
          {captions.map((caption, index) => (
            <div key={index} className="caption-card">
              <p className="caption-text">{caption}</p>
              <button onClick={() => handleCopy(caption, index)} className="copy-btn">
                {copied === index ? "✓ Copied" : "Copy"}
              </button>
            </div>
          ))}
        </div>
      )}
      <style jsx>{`
        .container { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; background: #0a0a0a; color: #e5e5e5; padding: 40px 20px; font-family: system-ui; }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { font-size: 3rem; font-weight: 800; background: linear-gradient(90deg, #a855f7, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .header p { font-size: 1.2rem; color: #a1a1aa; }
        .search-box { display: flex; flex-direction: column; gap: 15px; width: 100%; max-width: 500px; }
        .search-box input { width: 100%; padding: 14px; border-radius: 12px; background: #18181b; border: 1px solid #27272a; color: white; font-size: 1rem; outline: none; }
        .search-box input:focus { border-color: #a855f7; }
        .btn { background: linear-gradient(90deg, #a855f7, #ec4899); color: white; padding: 14px 30px; border-radius: 12px; font-size: 1.1rem; font-weight: bold; border: none; cursor: pointer; transition: 0.2s; }
        .btn:hover { transform: scale(1.05); }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .result-grid { margin-top: 40px; width: 100%; max-width: 600px; display: flex; flex-direction: column; gap: 12px; }
        .caption-card { background: #18181b; padding: 15px 20px; border-radius: 12px; border: 1px solid #27272a; display: flex; justify-content: space-between; align-items: center; gap: 10px; }
        .caption-text { flex: 1; }
        .copy-btn { background: #27272a; color: #e5e5e5; padding: 8px 14px; border-radius: 8px; border: none; cursor: pointer; transition: 0.2s; }
        .copy-btn:hover { background: #3f3f46; }
      `}</style>
    </div>
  );
}
