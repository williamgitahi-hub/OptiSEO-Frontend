import { useState } from "react";
import "./App.css";

function App() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);

  const handleOptimize = async () => {
    const res = await fetch("http://optiseo.onrender.com/optimize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ keyword }),
    });

    const data = await res.json();
    setResults(data.results);
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>Keyword Optimizer</h1>

      <input
        type="text"
        placeholder="Enter keyword..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        style={{
          padding: "10px",
          width: "300px",
          marginRight: "10px",
        }}
      />

      <button onClick={handleOptimize} style={{ padding: "10px" }}>
        Optimize
      </button>

      <h2 style={{ marginTop: "30px" }}>Results</h2>

      <ul>
        {results.map((item, index) => (
          <li key={index}>
            <b>{item.keyword}</b> — Score: {item.score}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;