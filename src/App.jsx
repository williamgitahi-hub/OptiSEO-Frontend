import { useState } from "react";
import "./App.css";

function App() {
  const [keyword, setKeyword] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("seo_history");
    return saved ? JSON.parse(saved) : [];
  });

  const saveToHistory = (result) => {
    const entry = { ...result, timestamp: new Date().toLocaleString() };
    setHistory(prev =>
      [entry, ...prev.filter(h => h.keyword !== result.keyword)].slice(0, 10)
    );
    localStorage.setItem(
      "seo_history",
      JSON.stringify([entry, ...history.filter(h => h.keyword !== result.keyword)].slice(0, 10))
    );
  };

  const optimize = async () => {
    if (!keyword.trim()) return;
    try {
      setLoading(true);
      setData(null);
      setError(null);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/optimize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword })
      });

      const result = await res.json();
      setData(result);
      saveToHistory(result);

    } catch (err) {
      setError("Failed to fetch results. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") optimize();
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("seo_history");
  };

  const getDifficultyClass = (difficulty) => {
    if (difficulty === "Easy") return "badge badge-easy";
    if (difficulty === "Medium") return "badge badge-medium";
    return "badge badge-hard";
  };

  const getScoreColor = (score) => {
    if (score >= 70) return "#00c896";
    if (score >= 50) return "#f5a623";
    return "#e05c5c";
  };

  const formatVolume = (vol) => {
    if (vol >= 1000000) return `${(vol / 1000000).toFixed(1)}M`;
    if (vol >= 1000) return `${(vol / 1000).toFixed(1)}K`;
    return vol?.toString() || "0";
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="logo">⚡ OptiSEO</div>
        <p className="tagline">AI-Powered SEO Keyword Optimizer</p>
      </header>

      {/* Search */}
      <div className="search-container">
        <div className="search-box">
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter a keyword to analyze..."
            className="search-input"
          />
          <button onClick={optimize} disabled={loading} className="search-btn">
            {loading ? "Analyzing..." : "Optimize"}
          </button>
        </div>
        {error && <p className="error">{error}</p>}
      </div>

      {/* Loading */}
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Fetching real keyword data...</p>
        </div>
      )}

      {/* Results */}
      {data && !loading && (
        <div className="results-container">
          <h2 className="results-keyword">"{data.keyword}"</h2>

          {/* Score Cards */}
          <div className="cards-grid">
            <div className="card">
              <p className="card-label">SEO Score</p>
              <p className="card-value" style={{ color: getScoreColor(data.seo_score) }}>
                {data.seo_score}<span className="card-unit">/100</span>
              </p>
            </div>

            <div className="card">
              <p className="card-label">Difficulty</p>
              <span className={getDifficultyClass(data.difficulty)}>
                {data.difficulty}
              </span>
            </div>

            <div className="card">
              <p className="card-label">Search Volume</p>
              <p className="card-value" style={{ color: "#00c896" }}>
                {formatVolume(data.search_volume)}
              </p>
            </div>

            <div className="card">
              <p className="card-label">Competition</p>
              <p className="card-value" style={{ color: getScoreColor(100 - data.competition_index) }}>
                {data.competition_index}<span className="card-unit">/100</span>
              </p>
            </div>

            <div className="card">
              <p className="card-label">Avg. CPC</p>
              <p className="card-value" style={{ color: "#f5a623" }}>
                ${data.cpc}
              </p>
            </div>

            <div className="card">
              <p className="card-label">Suggestions</p>
              <p className="card-value">{data.suggestions.length}</p>
            </div>
          </div>

          {/* Suggestions */}
          <div className="suggestions-box">
            <h3 className="section-title">💡 Keyword Suggestions</h3>
            <ul className="suggestions-list">
              {data.suggestions.map((s, i) => (
                <li
                  key={i}
                  className="suggestion-item"
                  onClick={() => setKeyword(s)}
                >
                  <span className="suggestion-index">{i + 1}</span>
                  {s}
                  <span className="suggestion-hint">click to analyze →</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="history-container">
          <div className="history-header">
            <h3 className="section-title">🕘 Recent Searches</h3>
            <button onClick={clearHistory} className="clear-btn">Clear</button>
          </div>
          <div className="history-list">
            {history.map((item, i) => (
              <div
                key={i}
                className="history-item"
                onClick={() => { setKeyword(item.keyword); setData(item); }}
              >
                <span className="history-keyword">{item.keyword}</span>
                <span className="history-score" style={{ color: getScoreColor(item.seo_score) }}>
                  {item.seo_score}/100
                </span>
                <span className={getDifficultyClass(item.difficulty)}>
                  {item.difficulty}
                </span>
                <span className="history-vol">🔍 {formatVolume(item.search_volume)}</span>
                <span className="history-cpc">💰 ${item.cpc}</span>
                <span className="history-time">{item.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <footer className="footer">
        <p>OptiSEO © {new Date().getFullYear()} — Keyword Intelligence Tool</p>
      </footer>
    </div>
  );
}

export default App;