import { useState } from "react";
import "./App.css";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ColorRing } from "react-loader-spinner";
import { useEffect } from "react";

function App() {
  const [prompt, setPrompt] = useState("");

  const [response, setResponse] = useState([]);

  const [loading, setLoading] = useState(false);

  const apiKey = import.meta.env.VITE_API_GEMINI_KEY;

  async function fetchChatResponseFromGemini() {
    setLoading(true);
    // created an instance
    const genAI = new GoogleGenerativeAI(apiKey);

    // selected the model i.e. gemini-1.5-flash
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // given prompt to the model
    const result = await model.generateContent(prompt);

    // getting the response from the model
    // console.log(result.response.text());

    const newResponse = [
      ...response,
      {
        prompt: prompt,
        response: result.response.text(),
      },
    ];
    setResponse(newResponse);
    setPrompt("");
    setLoading(false);
    localStorage.setItem("chatbotResponse", JSON.stringify(newResponse));
  }

  useEffect(() => {
    const data = localStorage.getItem("chatbotResponse");
    console.log("data", data);
    if (data) {
      setResponse(JSON.parse(data));
    }
  }, []);

  return (
    <>
      <h1 className="heading">AI ChatBot</h1>
      <div className="chatbot_container">
        <div className="chatbot_response_container">
          <p>Hi, how can I help you today?</p>
          {response?.map((res, index) => (
            <div className="response">
              <p className="chatbot_prompt">
                <strong>You : </strong> {res.prompt}
              </p>

              <p className="chatbot_response">
                <strong>Bot : </strong> {res.response}
              </p>
            </div>
          ))}

          {loading && (
            <ColorRing
              visible={true}
              height="80"
              width="80"
              ariaLabel="color-ring-loading"
              wrapperStyle={{}}
              wrapperClass="color-ring-wrapper"
              colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
            />
          )}
        </div>

        <div className="chatbot_input">
          <input
            type="text"
            name="input"
            placeholder="enter your questions"
            className="input"
            onChange={(e) => {
              setPrompt(e.target.value);
            }}
            value={prompt}
          />
          <button type="button" onClick={fetchChatResponseFromGemini}>
            submit
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
