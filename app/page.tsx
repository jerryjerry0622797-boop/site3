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
    setTimeout(() => setCopied(null), 1500);
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
      const data =await response.json();
      const captionList = data.result.split(/\d+\.\s/).filter((s: string) => s.trim() !== "");
      setCaptions(captionList);
    } catch (error) {
      setCaptions(["Error:internet check karo"]);
    }
    setLoading(false);
  };
  return(
    <div className="container">
    <h1>
      Welcome to your <br/>
      comfortzone
      </h1>
            <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="your dream captions"
            className="search-box"
            />
          {/* Aesthetic Cute Button */}
<button 
  onClick={handleGenerate} 
  disabled={loading}
  className="btn"> 
  {loading ? "Generating...✨" : "Explore Now✨"}
</button>
{/* Result Section */}
{captions.length > 0 && (
  <div className="result-grid">
{captions.map((caption, index) => (
  <div key={index} className="caption-card">
    <p className="caption-text">{caption}</p>
    <button className="copy-btn" onClick={() => handleCopy(caption, index)}>
      {copied === index ? "✔" : "📋"}
      </button>
      </div>
))}
</div>
)}
</div>
  )
}  
