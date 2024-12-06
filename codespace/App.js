import React, { useState } from "react";
import "./App.css";

const topics = {
  Variables: {
    theory:
      "Variables are containers for storing data values. In C++, a variable is declared by specifying its type followed by its name.",
    placeholder: `#include<iostream>\nusing namespace std;\n\nint main() {\n    int x = 10;\n    cout << x;\n    return 0;\n}`,
  },
  "Data Types": {
    theory:
      "Data types specify the type of data that a variable can hold. Examples include int, float, char, etc.",
    placeholder: `#include<iostream>\nusing namespace std;\n\nint main() {\n    // Example: float pi = 3.14;\n    // Write your data type example here\n    return 0;\n}`,
  },
  "Triangle Pattern": {
    theory:
      "A triangle pattern can be printed using nested loops. For example, the outer loop controls the rows, and the inner loop controls the columns.",
    placeholder: `#include<iostream>\nusing namespace std;\n\nint main() {\n    int n = 5; // Number of rows\n    for (int i = 1; i <= n; ++i) {\n        for (int j = 1; j <= i; ++j) {\n            cout << "* ";\n        }\n        cout << endl;\n    }\n    return 0;\n}`,
  },
  "Inverted Triangle Pattern": {
    theory:
      "An inverted triangle pattern starts with the maximum number of stars in the first row and reduces the count in each subsequent row.",
    placeholder: `#include<iostream>\nusing namespace std;\n\nint main() {\n    int n = 5; // Number of rows\n    for (int i = n; i >= 1; --i) {\n        for (int j = 1; j <= i; ++j) {\n            cout << "* ";\n        }\n        cout << endl;\n    }\n    return 0;\n}`,
  },
};

function App() {
  const [selectedTopic, setSelectedTopic] = useState("Variables");
  const [code, setCode] = useState("");
  const [isPlaceholderVisible, setIsPlaceholderVisible] = useState(false);
  const [output, setOutput] = useState("");

  const handleTopicChange = (e) => {
    const newTopic = e.target.value;
    setSelectedTopic(newTopic);
    setCode(""); // Clear the CodeSpace when topic changes
    setIsPlaceholderVisible(false);
  };

  const handleCompleteReading = () => {
    setCode(topics[selectedTopic].placeholder);
    setIsPlaceholderVisible(true); // Show placeholder
  };

  const handleCodeChange = (e) => {
    const input = e.target.value;

    if (isPlaceholderVisible && input.trim() !== "") {
      setIsPlaceholderVisible(false); // Hide placeholder when user starts typing
    }
    setCode(input);
  };

  const handleFocus = () => {
    if (isPlaceholderVisible) {
      setCode(""); // Clear the code area on focus
    }
  };

  const handleBlur = () => {
    if (code.trim() === "") {
      setCode(topics[selectedTopic].placeholder); // Restore placeholder if empty
      setIsPlaceholderVisible(true);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:5000/compile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();

      if (data.output) {
        setOutput(data.output); // Display output if compilation is successful
      } else {
        setOutput("Error: Compilation failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      setOutput("Error: Could not connect to compiler.");
    }
  };

  return (
    <div className="App">
      <h1>Learn C++</h1>
      <div className="container">
        <div className="theory-space">
          <h2>{selectedTopic}</h2>
          <p>{topics[selectedTopic].theory}</p>
          <button onClick={handleCompleteReading}>Complete Reading</button>
        </div>
        <div className="code-space">
          <textarea
            value={code}
            onChange={handleCodeChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={{
              width: "100%",
              height: "200px",
              fontFamily: "monospace",
              fontSize: "16px",
              color: isPlaceholderVisible ? "#888" : "#fff",
            }}
          />
          {!isPlaceholderVisible && code.trim() !== "" && (
            <button onClick={handleSubmit}>Submit</button>
          )}
        </div>
      </div>
      <select onChange={handleTopicChange} value={selectedTopic}>
        {Object.keys(topics).map((topic) => (
          <option key={topic} value={topic}>
            {topic}
          </option>
        ))}
      </select>
      {/* Output Section */}
      {output && (
        <div className="output-box">
          <h3>Output:</h3>
          <pre>{output}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
