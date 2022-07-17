import React, { useRef, useState, useEffect } from "react";

import Card from "../UI/Card";
import "./Search.css";

const Search = React.memo((props) => {
  const { onLoadingredient } = props;
  const [enteredfilter, setenteredFilter] = useState("");
  const inputref = useRef();
  useEffect(() => {
    const timer = setTimeout(() => {
      if (enteredfilter === inputref.current.value) {
        const query =
          enteredfilter.length === 0
            ? ""
            : `?orderBy="title"&equalTo="${enteredfilter}"`;

        fetch(
          "https://react-http-4e214-default-rtdb.firebaseio.com/ingredients.json" +
            query
        )
          .then((response) => response.json())
          .then((responseData) => {
            const LoadedIngredient = [];
            for (const key in responseData) {
              LoadedIngredient.push({
                id: key,
                title: responseData[key].title,
                amount: responseData[key].amount,
              });
            }
            onLoadingredient(LoadedIngredient);
          });
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [enteredfilter, onLoadingredient, inputref]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            ref={inputref}
            type="text"
            value={enteredfilter}
            onChange={(event) => setenteredFilter(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
