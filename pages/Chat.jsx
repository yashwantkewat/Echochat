import React, { useState, useEffect } from "react";
import Groq from "groq-sdk";
import Draggable from "react-draggable";
import "../assets/Chat.css";
import dayjs from "dayjs";
import { Download, Link2, Send } from "lucide-react";
import { Trash, Edit } from "lucide-react";
import ReactMarkdown from "react-markdown";  // Add this import

const groq = new Groq({
  apiKey: "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",
  dangerouslyAllowBrowser: true,
});

const Chat = ({ username }) => {
  const [userInput, setUserInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState({});
  const [showMenu, setShowMenu] = useState(null);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("chatHistory")) || {};
    setHistory(storedHistory);
  }, []);

  const saveHistoryToLocalStorage = (newHistory) => {
    localStorage.setItem("chatHistory", JSON.stringify(newHistory));
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse("");
    const currentDate = dayjs().format("YYYY-MM-DD");
    const currentMonth = dayjs().format("MMMM YYYY");

    try {
      const completion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: "Respond using markdown format for text." },
          { role: "user", content: userInput },
        ],
        model: "llama3-8b-8192",
      });
      const message = completion.choices[0].message.content;

      const newHistory = { ...history };
      if (!newHistory[currentMonth]) newHistory[currentMonth] = {};
      if (!Array.isArray(newHistory[currentMonth][currentDate]))
        newHistory[currentMonth][currentDate] = [];
      newHistory[currentMonth][currentDate].push({
        question: userInput,
        response: message,
      });

      setHistory(newHistory);
      saveHistoryToLocalStorage(newHistory);

      setResponse(message);
    } catch (error) {
      console.error("Error fetching response:", error);
      setResponse("Error processing your request.");
    } finally {
      setLoading(false);
      setUserInput("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  const handleEdit = (month, date, index) => {
    const newQuestion = prompt(
      "Edit your question:",
      history[month][date][index].question
    );
    if (newQuestion) {
      const newHistory = { ...history };
      newHistory[month][date][index].question = newQuestion;
      setHistory(newHistory);
      saveHistoryToLocalStorage(newHistory);
    }
  };

  const handleDelete = (month, date, index) => {
    const newHistory = { ...history };
    newHistory[month][date].splice(index, 1);
    if (newHistory[month][date].length === 0) delete newHistory[month][date];
    if (Object.keys(newHistory[month]).length === 0) delete newHistory[month];
    setHistory(newHistory);
    saveHistoryToLocalStorage(newHistory);
  };

  const handleShare = (month, date) => {
    const conversation = JSON.stringify(history[month][date], null, 2);
    const blob = new Blob([conversation], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${date}_conversation.json`;
    link.click();
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-lime-50 transition-all duration-500">
      {/* Left Panel (Chat History) */}
      <div className="lg:w-1/4 p-4 flex flex-col overflow-y-auto bg-lime-300 text-dark ">
        <Draggable>
          <div className="mt-5">
            <h1 className="text-xl font-bold mb-4 mt-5">Chat History</h1>
            {Object.keys(history).map((month) => (
              <div key={month}>
                <h2 className="font-medium mb-2">{month}</h2>
                {Object.keys(history[month]).map((date) => (
                  <div key={date}>
                    <h3 className="text-sm text-gray-700">{date}</h3>
                    {history[month][date].map((msg, index) => (
                      <div
                        key={index}
                        className="p-2 mb-2 bg-cyan-900 text-white rounded relative"
                      >
                        <p>{msg.question}</p>
                        <div
                          className="absolute right-2 top-2 cursor-pointer"
                          onMouseEnter={() =>
                            setShowMenu(`${month}-${date}-${index}`)
                          }
                          onMouseLeave={() => setShowMenu(null)}
                        >
                          <div className="text-xl">...</div>
                          {showMenu === `${month}-${date}-${index}` && (
                            <div className="absolute bg-gray-800 text-white p-2 rounded shadow-lg">
                              <button
                                className="block text-left w-full px-2 py-1 hover:bg-gray-700"
                                onClick={() => handleEdit(month, date, index)}
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                className="block text-left w-full px-2 py-1 hover:bg-gray-700"
                                onClick={() => handleDelete(month, date, index)}
                              >
                                <Trash size={18} />
                              </button>
                              <button
                                className="block text-left w-full px-2 py-1 hover:bg-gray-700"
                                onClick={() => handleShare(month, date)}
                              >
                                <Download size={18} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Draggable>
      </div>

      {/* Right Panel (User Input) */}
      <div className="flex-grow p-4 lg:w-3/4 flex flex-col mt-5">
        {response && (
          <div className="bg-gray-700 text-white p-4 rounded shadow mb-4">
            <h2 className="font-semibold text-lg mb-2">AI:</h2>
            <ReactMarkdown>{response}</ReactMarkdown>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="w-full flex items-center bg-lime-200  text-dark rounded p-2 mt-3"
        >
          <textarea
            value={userInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask your question..."
            className="flex-grow p-2 text-dark bg-transparent outline-none rounded resize-none min-h-[50px] max-h-[200px]"
            rows={2}
          />
          <button
            type="submit"
            className="ml-2 p-2 bg-lime-600 text-white rounded shadow"
          >
            {loading ? "Loading..." : <Send />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
