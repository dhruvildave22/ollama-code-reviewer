import { useState } from "react";

export default function App() {
  const [jsCode, setJsCode] = useState("");
  const [cssCode, setCssCode] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const analyzeCode = async () => {
    setIsLoading(true);
    setResponse("");

    const prompt = `You are a code reviewer. For the following HTML, CSS, or JavaScript code, analyze the customization behavior and respond using this exact format in Markdown syntax.

Only respond with the following table format:

## Excel Sheet Row (Mapped to Columns)

| Column | Entry |
|--------|-------|
| Color/Font Changes? | ✅ Yes — [describe] |
| UI Text/Message Changes? | ❌ No |
| Input Data Validation? | ❌ No |
| UI Structure Changes? | ✅ Yes — [describe] |
| Custom flow/page navigation? | ❌ No |
| Uses KTL (and what for?) | ❌ No |
| Using Knack Object? | ❌ No |
| Using Knack API (and which ones)? | ❌ No |
| Load External Lib (and which lib)? | ❌ No |
| Need Builder Access to Understand JS? | ❌ No |
| Use Case Supported by Classic without Custom JS? | ✅ Yes — [describe] |
| Use Case Already Supported by NGA? | ⚠️ Partially — [describe] |
| Functionality Description | A concise summary of what the code achieves visually/functionally. |

Now, analyze this:

CSS:
${cssCode}

JS:
${jsCode}

Again, respond only with the formatted Markdown table above, and nothing else.`;


    const res = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "codellama", prompt, stream: false })
    });

    const data = await res.json();
    setResponse(data.response);
    setIsLoading(false);
  };

  const renderFormattedResponse = () => {
    const lines = response.split('\n').filter(Boolean);
    const tableRows = lines.filter(line => line.startsWith('|'));
    const description = lines.find(line => line.startsWith('Functionality Description')) || '';

    return (
      <div>
        <table className="min-w-full text-left border border-gray-300 bg-white rounded-xl overflow-hidden mb-6">
          <thead className="bg-blue-100 text-blue-800">
            <tr>
              <th className="px-4 py-2 border-b">Column</th>
              <th className="px-4 py-2 border-b">Entry</th>
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row, index) => {
              const cells = row.split('|').map(cell => cell.trim()).filter(Boolean);
              if (cells.length < 2) return null;
              return (
                <tr key={index} className="odd:bg-gray-50 even:bg-white">
                  <td className="px-4 py-2 border-b text-sm text-gray-700">{cells[0]}</td>
                  <td className="px-4 py-2 border-b text-sm text-gray-700">{cells[1]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {description && (
          <div className="bg-blue-100 p-4 rounded-xl text-sm text-gray-800">
            <strong>Functionality Description:</strong> {description.split('Functionality Description')[1].trim()}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-blue-50 text-gray-800 py-12 px-6">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg p-10 space-y-10 border border-blue-100">
        <h1 className="text-4xl font-bold text-center text-blue-700 leading-tight">
          🧠 Ollama <span className="text-gray-800">Code Reviewer</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block font-semibold text-lg mb-2 text-blue-700">CSS Code</label>
            <textarea
              rows={12}
              className="w-full bg-blue-50 text-gray-800 p-4 border border-blue-300 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              placeholder="Paste your CSS code here..."
              value={cssCode}
              onChange={(e) => setCssCode(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-semibold text-lg mb-2 text-blue-700">JavaScript Code</label>
            <textarea
              rows={12}
              className="w-full bg-blue-50 text-gray-800 p-4 border border-blue-300 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              placeholder="Paste your JavaScript code here..."
              value={jsCode}
              onChange={(e) => setJsCode(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button
            className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-full shadow hover:bg-blue-700 hover:scale-105 transform transition-transform duration-300 ease-in-out disabled:opacity-50"
            onClick={analyzeCode}
            disabled={isLoading}
          >
            {isLoading ? "⏳ Analyzing..." : "🔍 Analyze Code"}
          </button>
        </div>

        {isLoading && (
          <p className="text-center text-blue-500 font-medium animate-pulse">Waiting for response...</p>
        )}

        {response && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-xl">
            <h2 className="text-xl font-bold text-blue-600 mb-4">📊 Analysis Result</h2>
            {renderFormattedResponse()}

            <div className="bg-white border border-blue-200 rounded-xl p-6 shadow-sm mt-6">
              <h3 className="text-lg font-semibold mb-4 text-blue-700">🎨 Visual UI Summary</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>CSS Effects:</strong></p>
                <div className="bg-blue-100 rounded p-3 font-mono whitespace-pre-wrap">
                  {cssCode || 'No CSS code provided'}
                </div>
                <p className="mt-4"><strong>JS Effects:</strong></p>
                <div className="bg-blue-100 rounded p-3 font-mono whitespace-pre-wrap">
                  {jsCode || 'No JavaScript code provided'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

