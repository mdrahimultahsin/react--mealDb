import React, {useEffect, useState} from "react";
import {FaBookmark, FaRegBookmark} from "react-icons/fa";

const Modal = ({selectedMealName, bookmarked, handleBookmark}) => {
  const [selectedMealData, setSelectedMealData] = useState([]);
  const [showFullDescrp, setShowFullDescrp] = useState(false);
  useEffect(() => {
    if (!selectedMealName) {
      return;
    }
    fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${selectedMealName}`
    )
      .then((res) => res.json())
      .then((data) => setSelectedMealData(data.meals));
  }, [selectedMealName]);
  const meal = selectedMealData?.[0];
  return (
    <div>
        
      {/* You can open the modal using document.getElementById('ID').showModal() method */}

      <dialog id="my_modal_4" className="modal">
        <div className="modal-box w-11/12 max-w-5xl flex">
          <div className="flex gap-4">
            <div className="max-w-1/2 h-full ">
              <img
                className="w-full h-full object-cover"
                src={meal?.strMealThumb}
                alt=""
              />
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg">{meal?.strMeal}</h3>
                    <span className="text-gray-400">
                      Category: {meal?.strCategory}
                    </span>
                  </div>
                  <div>
                    <button
                      onClick={() => handleBookmark(meal)}
                      disabled={bookmarked.includes(meal)}
                    >
                      {bookmarked.includes(meal) ? (
                        <FaBookmark className="text-3xl text-red-500" />
                      ) : (
                        <FaRegBookmark className="text-3xl" />
                      )}
                    </button>
                  </div>
                </div>
                <h2 className="font-semibold text-xl mt-2">Instructions:</h2>
                <p className="py-2">
                  {showFullDescrp
                    ? meal?.strInstructions
                    : meal?.strInstructions?.slice(0, 500) + "..."}
                  {meal?.strInstructions.length > 500 && (
                    <button
                      className="cursor-pointer text-blue-500 hover:underline ml-2"
                      onClick={() => setShowFullDescrp(!showFullDescrp)}
                    >
                      {" "}
                      {showFullDescrp ? "See Less" : "Show More"}
                    </button>
                  )}
                </p>
                <div>
                  <button className="bg-red-500 p-3 rounded-md text-white font-semibold">
                    Order Now
                  </button>
                </div>
              </div>
              <div className="modal-action">
                <form method="dialog">
                  <button className="btn">Close</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Modal;
