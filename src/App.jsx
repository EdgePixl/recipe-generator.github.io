import { useState } from 'react';
import './App.css';

export default function ControlledComponent() {
  const [inputValue, setInputValue] = useState('');
  const [topic, setTopic] = useState(null);

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const API_KEY = "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";
  const CHATBOT_URL = "https://api.openai.com/v1/chat/completions";

  function formatData(inputValue) {
    return {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: inputValue }],
    };
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const topicRequest = await fetch(CHATBOT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(formatData(`Please create a simple recipe from these ingredients: ${inputValue}. The recipe should be more targeted toward Indian cuisine, so if possible, choose an Indian recipe over a different recipe. Please note that you cannot respond with a message saying that it is not possible to create a recipe from the given ingredients; you must create a recipe! Please note that the recipe does not need to use all the ingredients. It also does not necessarily have to be Indian food, but it should be Indian food almost all the time.`)),
    });

    const response = await topicRequest.json();
    const recipe = response.choices[0].message.content;

    const cleanRecipe = 
    recipe.replace(/Note:.*ingredients\./, '');

    setTopic(cleanRecipe);
  };

  return (
    <div className="container">
      <h2>Recipe Generator</h2>
      <form onSubmit={handleSubmit}>
        <label>Ingredients:</label>
        <input type="text" value={inputValue} onChange={handleChange} />
        <button type="submit">Generate Recipe</button>
      </form>
      {topic && (
        <div className="recipe">
          <h3>Recipe:</h3>
          <p>{topic}</p>
        </div>
      )}
    </div>
  );
}
