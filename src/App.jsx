import { useState } from "react";
import "./App.css";

function App() {
  const [keyword, setKeyword] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const optimize = async () => {
    try {
      setLoading(true);
      setData(null);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/optimize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ keyword })
      });

      const result = await res.json();
      console.log(result);
      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>SEO Keyword Optimizer</h1>

      <input
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Enter keyword"
        style={{ padding: "10px", width: "300px" }}
      />

      <button onClick={optimize} style={{ marginLeft: "10px" }}>
        Optimize
      </button>

      {loading && <p>Analyzing keyword...</p>}

      {data && (
        <div style={{ marginTop: "20px" }}>
          <h3>Keyword: {data.keyword}</h3>
          <p>SEO Score: {data.seo_score}</p>
          <p>Difficulty: {data.difficulty}</p>

          {data?.suggestions && Array.isArray(data.suggestions) && (
            <>
              <h4>Suggestions:</h4>
              <ul>
                {data.suggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;