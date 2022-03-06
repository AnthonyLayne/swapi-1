import React, { useEffect, useState } from "react";
import axios from "axios";

import logo from "./logo.svg";
import "./App.css";

type Character = {
  birth_year: string;
  created: string;
  edited: string;
  eye_color: string;
  films: string[];
  gender: string;
  hair_color: string;
  height: string;
  homeworld: string;
  mass: string;
  name: string;
  skin_color: string;
  species: string[];
  starships: string[];
  url: string;
  vehicles: string[];
};

type CharactersResponse = {
  count: number;
  next: null | string;
  previous: null | string;
  results: Character[];
};

function App() {
  const [characters, setCharacters] = useState<Character[]>([]);

  useEffect(() => {
    axios
      .get<CharactersResponse>("https://swapi.dev/api/people")
      .then((res) => setCharacters(res.data.results))
      .catch(console.error);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>

        {characters.map((char) => {
          return (
            <div key={char.name}>
              {char.name} - {char.birth_year}
              <div>
                {char.films.map((filmUri) => {
                  return <div key={filmUri}>{filmUri}</div>;
                })}
              </div>
            </div>
          );
        })}

        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
