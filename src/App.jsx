import {Suspense, useEffect, useRef, useState} from "react";
import "./App.css";
import {addMeal, getMeal, removeMeal} from "./localStorage";
import {FaBookmark, FaRegBookmark} from "react-icons/fa";
import Navbar from "./components/Navbar";
import Modal from "./components/Modal";
import toast, {Toaster} from "react-hot-toast";
function App() {
  const [categories, setCategories] = useState([]);
  const [mealName, setMealName] = useState("");
  const [meals, setMeals] = useState([]);
  const [bookmarked, setBookmarked] = useState([]);
  const [selectedMealName, setSelectedMealName] = useState("");
  const [loading, setLoading] = useState(true);

  const addingToast = () => toast.success("Added to the bookmark");
  const removingToast = () => toast.error("Removed From Bookmark");

  const searchRef = useRef("");
  useEffect(() => {
    fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories);
      });
  }, []);

  useEffect(() => {
    const searchTeam = mealName || "Beef";
    setLoading(true); // start loading
    const url = searchRef.current?.value
      ? `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTeam}`
      : `https://www.themealdb.com/api/json/v1/1/filter.php?c=${searchTeam}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setMeals(data.meals || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [mealName]);

  const handleSearch = () => {
    setMealName(searchRef.current.value);
  };
  const handleBookmark = (meal) => {
    
    if (bookmarked.includes(meal)) {
      return;
    }
    setBookmarked([...bookmarked, meal]);
    addMeal(meal.idMeal);
    addingToast();
  };
  const handleSeeDetails = (meal) => {
    setSelectedMealName(meal?.strMeal);
    const modal = document.getElementById("my_modal_4");

    if (modal?.showModal) {
      modal.showModal();
    } else {
      console.warn("Modal element not found or showModal not supported");
    }
  };

  useEffect(() => {
    const storedIds = getMeal();
    const newMeal = [];

    for (const id of storedIds) {
      const storedMeal = meals.find((meal) => meal.idMeal === id);
      if (storedMeal) {
        newMeal.push(storedMeal);
      }
      setBookmarked(newMeal);
    }
  }, [meals]);
  const handleRemoveFromBookmark = (id) => {
    const newMeal = bookmarked.filter((meal) => meal.idMeal !== id);
    setBookmarked(newMeal);
    removeMeal(id);
    removingToast();
  };

  return (
    <>
      <Toaster />
      <Navbar
        handleSearch={handleSearch}
        searchRef={searchRef}
        bookmarked={bookmarked}
      ></Navbar>

      <div className="flex justify-end gap-2 mt-2 px-4">
        {bookmarked.map((meal, i) => {
          return (
            <div key={i} className="space-x-2 flex items-end">
              <img className="w-8 inline" src={meal.strMealThumb} />
              <button
                onClick={() => handleRemoveFromBookmark(meal.idMeal)}
                className="px-2 border"
              >
                x
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex gap-3 flex-wrap justify-center mt-4 p-4 bg-gray-100">
        <Suspense fallback={<p>Loading........</p>}>
          {categories.map((category) => {
            const isActive =
              mealName === category.strCategory ||
              (!mealName && category.strCategory === "Beef");
            return (
              <button
                onClick={() => setMealName(category.strCategory)}
                className={`p-2 border border-red-500 text-red-500 flex gap-2 cursor-pointer ${
                  isActive && "bg-red-500 text-white border-red-500"
                }`}
                key={category.idCategory}
              >
                {category.strCategory}
                <img
                  className="w-8 rounded-full"
                  src={category.strCategoryThumb}
                />
              </button>
            );
          })}
        </Suspense>
      </div>
      {loading ? (
        <div className="text-center py-4">
          <span className="loading loading-spinner text-red-500"></span>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 px-4 md:px-10 bg-gray-100">
          {meals.length === 0 ? (
            <p className="text-gray-500 text-2xl text-center col-span-full mt-40">
              No meals found.
            </p>
          ) : (
            meals?.map((meal) => {
              return (
                <div
                  key={meal.idMeal}
                  className="bg-white shadow-xl flex flex-col justify-between p-4"
                >
                  <img
                    className="w-full object-cover"
                    src={meal.strMealThumb}
                    alt=""
                  />
                  <div className="flex justify-between items-center py-3">
                    <h3 className="font-semibold mt-2 text-lg md:text-xl">
                      {meal.strMeal}
                    </h3>

                    <button
                      onClick={() => handleBookmark(meal)}
                      className="cursor-pointer"
                    >
                      {bookmarked.find(
                        (markd) => markd.idMeal === meal.idMeal
                      ) ? (
                        <FaBookmark className="text-3xl text-red-500" />
                      ) : (
                        <FaRegBookmark className="text-3xl" />
                      )}
                    </button>
                  </div>
                  <button
                    onClick={() => handleSeeDetails(meal)}
                    className="bg-red-500 p-3 text-white rounded mt-2 cursor-pointer"
                  >
                    See Details
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}

      <Modal
        bookmarked={bookmarked}
        selectedMealName={selectedMealName}
        handleBookmark={handleBookmark}
      ></Modal>
    </>
  );
}

export default App;
