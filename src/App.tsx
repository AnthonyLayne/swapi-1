import { useEffect, useState } from "react";
import axios from "axios";

import { Character, CharactersResponse } from "./types";
import "./App.css";

let numOfPages = 0;

function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [prevLink, setPrevLink] = useState<null | string>(null);
  const [nextLink, setNextLink] = useState<null | string>(null);

  const [characters, setCharacters] = useState<Character[]>([]);
  const [filmNamesKeyedByEndpoint, setFilmNamesKeyedByEndpoint] = useState<Record<string, string>>(
    {}
  );

  useEffect(() => {
    axios
      .get<CharactersResponse>(`https://swapi.dev/api/people/?page=${currentPage}`)
      .then(async (res) => {
        if (numOfPages === 0) {
          numOfPages = Math.ceil(res.data.count / res.data.results.length);
        }

        setCharacters(res.data.results);
        setPrevLink(res.data.previous);
        setNextLink(res.data.next);

        const filmEndpoints: Record<string, string> = {};

        res.data.results.forEach((char) => {
          char.films.forEach((filmEndpoint) => {
            if (!filmNamesKeyedByEndpoint[filmEndpoint]) {
              filmEndpoints[filmEndpoint] = "";
            }
          });
        });

        const promisesArray = Object.keys(filmEndpoints).map(async (endpoint) => {
          const filmRes = await axios.get(endpoint);
          filmEndpoints[endpoint] = filmRes.data.title;
        });

        await Promise.all(promisesArray);

        setFilmNamesKeyedByEndpoint((prev) => ({ ...prev, ...filmEndpoints }));
      })
      .catch(console.error);
  }, [currentPage]);

  const handlePrevClick = () => prevLink && setCurrentPage((prev) => prev - 1);
  const handleNextClick = () => nextLink && setCurrentPage((prev) => prev + 1);
  const handlePageClick = (page: number) => setCurrentPage(page);

  return (
    <div className="app">
      <header>Some Header</header>

      <div className="characters">
        {characters.map(({ name, birth_year, films }) => {
          return (
            <div key={name} className="character">
              <span className="name">
                {name} - {birth_year}
              </span>

              <div>
                {films.map((filmUri) => (
                  <div key={filmUri}>{filmNamesKeyedByEndpoint[filmUri]}</div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="buttons">
        <button
          disabled={!prevLink}
          className={!prevLink ? "disabled" : undefined}
          onClick={handlePrevClick}
        >
          {"<"} Prev
        </button>

        {new Array(numOfPages).fill(undefined).map((_each, i) => {
          const page = i + 1;
          const isCurrentPage = page === currentPage;

          return (
            <span
              className={isCurrentPage ? "active" : undefined}
              onClick={() => handlePageClick(page)}
            >
              {page}
            </span>
          );
        })}

        <button
          disabled={!nextLink}
          className={!nextLink ? "disabled" : undefined}
          onClick={handleNextClick}
        >
          Next {">"}
        </button>
      </div>
    </div>
  );
}

export default App;
