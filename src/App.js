import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  // Set up state to hold the background color, gif URL, and joke
  const [backgroundColor, setBackgroundColor] = useState("grey");
  const [gifUrl, setGifUrl] = useState("");
  const [jokeQuote, setJokeQuote] = useState("");
  const [isFetching, setIsFetching] = useState(false); // Nouvel état pour éviter une boucle de mise à jour infinie

  const GiphyApiKey = process.env.REACT_APP_GIPHY_API_KEY;

  // Set up the URLs for the Giphy API and joke API using the API key from .env
  const GIPHY_API = `https://api.giphy.com/v1/gifs/random?api_key=${GiphyApiKey}&tag=stupid&rating=g`;
  const jokeAPI =
    "https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=single";

  // Function to generate a random color
  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  // Function to fetch a random GIF using the Giphy API
  async function getGif() {
    try {
      setIsFetching(true); // Définir isFetching sur true avant de commencer la requête
      const response = await fetch(`${GIPHY_API}&${Date.now()}`);
      const data = await response.json();
      const gif = data.data.images.original.url;
      setGifUrl(gif);
      setIsFetching(false); // Définir isFetching sur false après avoir terminé la requête
    } catch (error) {
      console.error("Failed to get GIF:", error);
    }
  }

  // Function to fetch a random joke using the Joke API
  async function getJoke() {
    try {
      const responseJoke = await fetch(`${jokeAPI}&${Date.now()}`);
      const dataJoke = await responseJoke.json();
      const joke = dataJoke.joke;
      setJokeQuote(joke);
    } catch (error) {
      console.error("Failed to get joke:", error);
    }
  }

  // Use useEffect to fetch a new GIF and joke when the component mounts
  useEffect(() => {
    getGif();
    getJoke();
  }, []);

  // Render the component with a button that fetches a new GIF and joke, changes the background color, and displays them
  return (
    <div className="App" style={{ backgroundColor }}>
      <header className="App-header">
        <h1>The stupid page</h1>
        <img src={gifUrl} alt="" style={{ width: "400px" }} />
        <p className="quote">{jokeQuote}</p>

        <button
          onClick={() => {
            if (!isFetching) {
              // Vérifier si une requête est déjà en cours
              getGif();
              getJoke();
              setBackgroundColor(getRandomColor());
            }
          }}
          className="button"
        >
          <p className="buttonText">PUSH</p>
        </button>
      </header>
    </div>
  );
}

export default App;
