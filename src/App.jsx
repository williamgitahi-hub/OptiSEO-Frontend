import { useState } from "react";
import "./App.css";

function App() {
  const [keyword, setKeyword] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const optimizeKeyword = async () => {
    try {
      setLoading(true);
      setResult("");

      const res = await fetch("https://optiseo.onrender.com/optimize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ keyword })
      });

      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Error:", error);
      setResult("Error connecting to backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Keyword Optimizer</h1>

      <input
        type="text"
        value={keyword}
        placeholder="Enter keyword..."
        onChange={(e) => setKeyword(e.target.value)}
        style={{ padding: "10px", width: "300px" }}
      />

      <br /><br />

      <button onClick={optimizeKeyword} disabled={loading}>
        {loading ? "Optimizing..." : "Optimize"}
      </button>

      <br /><br />

      <pre style={{ background: "#f4f4f4", padding: "10px" }}>
        {result}
      </pre>
    </div>
  );
}

export default App;