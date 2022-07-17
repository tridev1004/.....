import React, { useReducer, useEffect, useCallback, useState } from "react";
import ErrorModal from "../UI/ErrorModal";
import IngredientForm from "./IngredientForm";
import Search from "./Search";
import IngredientList from "./IngredientList";

const ingredientReducer = (currentIngredient, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "ADD":
      return [...currentIngredient, action.ingredient];

    case "DELETE":
      return currentIngredient.filter((ing) => ing.id !== action.id);
    default:
      throw new Error("something got wrong Buddy!");
  }
};


const Ingredients = () => {
  const [useringredient, dispatch] = useReducer(ingredientReducer, []);
  // const [useringredient, setuserIngredient] = useState([]);
  const [isloading, setIsloading] = useState(false);
  const [error, setError] = useState();
  const filteredingredientHandler = useCallback((filteredingredient) => {
    // setuserIngredient(filteredingredient);
    dispatch({ type: "SET", ingredients: filteredingredient });
  }, []);
  useEffect(() => {
    fetch(
      "https://react-http-4e214-default-rtdb.firebaseio.com/ingredients.json"
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
        // setuserIngredient(LoadedIngredient);
       
      });
  }, []);
  const addIngredient = (ingredient) => {
    setIsloading(true);
    fetch(
      "https://react-http-4e214-default-rtdb.firebaseio.com/ingredients.json",
      {
        method: "POST",
        body: JSON.stringify(ingredient),
        headers: { "content-type": "application/json" },
      }
    )
      .then((response) => {
        setIsloading(false);
        return response.json();
      }).then (responseData=>{
      dispatch({
        type: "ADD",
        ingredient: { id: responseData.name, ...ingredient  },
      });
  })
}

  const removeIngredientHandler = (ingredientId) => {
    setIsloading(true);
    fetch(
      `https://react-http-4e214-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
      {
        method: "DELETE",
      }
    )
      .then((response) => {
        setIsloading(false);
        // setuserIngredient((prevIngredients) =>
        //   prevIngredients.filter((ingredient) => ingredient.id !== ingredientId)
        // );
        dispatch({ type: "DELETE", id: ingredientId });
      })
      .catch((error) => {
        setError(error.message);
        setIsloading(false);
      });
  };

  const clearerror = () => {
    setError(null);
  };
  return (
    <div className="App">
      {error && <ErrorModal onClose={clearerror}> {error} </ErrorModal>}
      <IngredientForm onAddIngredient={addIngredient} loading={isloading} />

      <section>
        <Search onLoadingredient={filteredingredientHandler} />
        {/* Need to add list here! */}
        <IngredientList
          ingredients={useringredient}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
};

export default Ingredients;
