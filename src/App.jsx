import React, { useState } from 'react';
import './App.css';
import Navbar from './Components/Navbar';
import Editor from '@monaco-editor/react';
import Select from 'react-select';
import { GoogleGenAI } from '@google/genai';
import Markdown from 'react-markdown';
import ScaleLoader from 'react-spinners/ScaleLoader';

// Beautify the AI response
function transformResponse(text) {
  if (!text) return '';
  return text
    .replace(/(Bug:)/gi, '❌ **Bug:**')
    .replace(/(Fix:)/gi, '✅ **Fix:**')
    .replace(/(Solution:)/gi, '✅ **Solution:**')
    .replace(/(Corrected:)/gi, '✅ **Corrected:**');
}

// Extract rating from the response
function extractRating(text) {
  const lower = text.toLowerCase();
  if (lower.includes("bad")) return "bad";
  if (lower.includes("normal")) return "normal";
  if (lower.includes("good") || lower.includes("better")) return "good";
  return null;
}

const App = () => {
  const options = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'csharp', label: 'C#' },
    { value: 'cpp', label: 'C++' },
    { value: 'php', label: 'PHP' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'go', label: 'Go' },
    { value: 'swift', label: 'Swift' },
    { value: 'kotlin', label: 'Kotlin' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'rust', label: 'Rust' },
    { value: 'dart', label: 'Dart' },
    { value: 'scala', label: 'Scala' },
    { value: 'perl', label: 'Perl' },
    { value: 'haskell', label: 'Haskell' },
    { value: 'elixir', label: 'Elixir' },
    { value: 'r', label: 'R' },
    { value: 'matlab', label: 'MATLAB' },
    { value: 'bash', label: 'Bash' }
  ];

  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [rating, setRating] = useState(null);

  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_KEY });

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: '#18181b',
      borderColor: '#3f3f46',
      color: '#fff',
      width: '300px',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#fff',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#18181b',
      color: '#fff'
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#27272a' : '#18181b',
      color: '#fff',
      cursor: 'pointer'
    }),
    input: (provided) => ({
      ...provided,
      color: '#fff'
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#a1a1aa'
    })
  };

  async function reviewCode() {
    if (!code.trim()) return alert('Please enter code first');
    setResponse('');
    setRating(null);
    setLoading(true);
    const res = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `
      You are an expert developer. Review this ${selectedOption.value} code:\n\n${code}.
      Provide feedback on bugs, improvements, and quality. Use the following format:
      \n\n**Bug:** [description]
      \n**Fix:** [suggested fix]
      \n**Solution:** [solution]
      \n\n
      Rate the code quality as "Good", "Normal", or "Bad" at the end of your response.
      Use markdown formatting for emphasis and clarity.
      \n\nRespond only with the review, and additional text like optimizations, time complexity, and space.
      `
    });
    setResponse(res.text);
    setRating(extractRating(res.text));
    setLoading(false);
  }

  return (
    <>
      <Navbar />
      <div className="main-container">
        <div className="editor-container">
          <div className="select-center">
            <Select
              value={selectedOption}
              onChange={(e) => setSelectedOption(e)}
              options={options}
              styles={customStyles}
            />
          </div>
          <Editor
            key={selectedOption.value}
            height="100%"
            theme="vs-dark"
            language={selectedOption.value}
            value={code}
            onChange={(e) => setCode(e)}
            onMount={(editor) => {
              setTimeout(() => editor.layout(), 0);
            }}
          />
          <div className="review-btn-wrapper">
            <button className="btnNormal" onClick={reviewCode}>Review</button>
          </div>
        </div>

        <div className="response-container">
          <div className="response-header">
            <p className="response-title">AI Response</p>
          </div>
          <div className="response-scroll">
            {loading ? (
              <div className="loader-center">
                <ScaleLoader color="#9333ea" />
              </div>
            ) : (
              <div className="markdown-wrapper">
                {rating && (
                  <h2 className={`rating-tag ${rating}`}>
                    {rating === 'bad' && '❌ BAD CODE'}
                    {rating === 'normal' && '🟡 AVERAGE CODE'}
                    {rating === 'good' && '✅ GOOD CODE'}
                  </h2>
                )}
                <Markdown>{transformResponse(response)}</Markdown>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
