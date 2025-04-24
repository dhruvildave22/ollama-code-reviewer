# 🧠 Ollama Code Reviewer (Local ChatGPT for Code Analysis)

This project allows you to run a **ChatGPT-style code reviewer locally** using [Ollama](https://ollama.com/) and React. It lets you paste custom **CSS and JavaScript** code and receive a structured, Excel-style analysis output.

---

## 📦 Tech Stack
- [Vite](https://vitejs.dev/) + React
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Ollama](https://ollama.com/) for running local LLMs (CodeLlama, Mistral, etc.)

---

## ⚙️ Prerequisites

1. **Install Node.js** (v16 or higher)
2. **Install Ollama**
   - **Mac (Homebrew)**:
     ```bash
     brew install ollama
     ```
   - **Windows**:
     1. Go to [https://ollama.com/download](https://ollama.com/download)
     2. Download the `.exe` installer and run it
     3. After installation, open Command Prompt and run:
        ```bash
        ollama --version
        ```
        to confirm it's working
   - **Ubuntu/Linux**:
     1. Download the Linux `.deb` package from [https://ollama.com/download](https://ollama.com/download)
     2. Then install it via terminal:
        ```bash
        sudo apt install ./ollama_<version>_amd64.deb
        ```
     3. Confirm install:
        ```bash
        ollama --version
        ```

---

## 🚀 Getting Started

### 1. Clone the Repo
```bash
git clone https://github.com/dhruvildave22/ollama-code-reviewer.git
cd ollama-code-reviewer
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start a Local Model with Ollama

First you have to start ollama
```bash
ollama serve
```

Now you can use `codellama`, `mistral`, or any other local model. This project assumes **codellama**.

```bash
ollama run codellama
```
This starts the Ollama server at `http://localhost:11434`.

> 💡 You can switch models by changing the `model` value in `App.jsx`.

To list available models:
```bash
ollama list
```
To pull others (optional):
```bash
ollama pull mistral  # Optional: only if you want to test other models
```

### 4. Start the App
```bash
npm run dev
```
Visit [http://localhost:5173](http://localhost:5173) in your browser.

---

## ✨ Features

- Paste **CSS** and **JS** code to analyze customization logic
- Uses local LLM to output structured, Excel-like insights
- Table-formatted output that's easily readable
- Visual summary panel for copied code
- Styled with Tailwind (light, calm theme)
- Loading animation with disabled state

---

## 📤 Prompt Optimization

The app sends this prompt to Ollama:

```
You are a code reviewer. Analyze the following HTML, CSS, or JavaScript code and respond using this Markdown table format only:

| Column | Entry |
|--------|-------|
| Color/Font Changes? | ✅ Yes — ... |
| UI Text/Message Changes? | ❌ No |
...and so on.

Functionality Description: A short summary of what the code does.
```

This ensures clean and parseable markdown tables.

---

## 🧪 API Example
```ts
await fetch("http://localhost:11434/api/generate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "codellama",
    prompt: "<your full prompt here>",
    stream: false,
  })
})
```

---

## 💡 Suggestions
- Use `stream: false` to ensure full table rendering
- Run `ollama run codellama` in a separate terminal
- Tailor prompt output to match your table logic

---

## 📷 Project Screenshots
![screencapture-localhost-5173-2025-04-24-17_34_16](https://github.com/user-attachments/assets/1a26c125-3779-46de-a30a-beae9db6fdc7)

---

## 📄 License
MIT License — feel free to modify and build upon it.

