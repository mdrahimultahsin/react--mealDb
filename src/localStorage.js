const getMealsFromStorage =() =>{
    const storedMeal = localStorage.getItem('bookmarked')
    return storedMeal?JSON.parse(storedMeal):[]
}
const saveMealToStorage = (meal) =>{
    const mealStringified = JSON.stringify(meal);
    localStorage.setItem('bookmarked',mealStringified)
}
const addMealToStorage =(id)  => {
    const storedMeal = getMealsFromStorage()
    storedMeal.push(id)
    saveMealToStorage(storedMeal)
}
const removeMealFromStorage =(id)=>{
    const storedMealIds = getMealsFromStorage();
    const newMeal = storedMealIds.filter(storedIds=> storedIds!==id)
    saveMealToStorage(newMeal)
}
export{getMealsFromStorage as getMeal , addMealToStorage as addMeal ,removeMealFromStorage as removeMeal}