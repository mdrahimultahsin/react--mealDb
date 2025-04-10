import { Suspense, useEffect, useRef, useState } from 'react'
import './App.css'
import { addMeal,getMeal, removeMeal } from './localStorage'
import Child from './Child'
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import Navbar from './components/Navbar';



function App() {

  const [categories,setCategories] = useState([])
  const [mealName,setMealName] = useState('')
  const [meals,setMeals] = useState([])
  const [bookmarked,setBookmarked] = useState([])
  const searchRef = useRef('')
  useEffect(()=>{
  
    fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
    .then((res) => res.json())
    .then(data => setCategories(data.categories))
  },[])
  
  useEffect(()=> {
    const searchTeam = mealName || 'Beef'
    console.log(searchRef.current.value)
    const url = searchRef.current?.value?
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTeam}`
    :`https://www.themealdb.com/api/json/v1/1/filter.php?c=${searchTeam}`

    fetch(url)
    .then(res => res.json())
    .then(data => setMeals(data.meals||[]))
  },[mealName])
  
 
  const handleSearch=()=>{
    setMealName(searchRef.current.value)
  }
  const handleBookmark =(meal) =>{
    
    setBookmarked([...bookmarked,meal])
    addMeal(meal.idMeal)

  }
  useEffect(()=> {
    const storedIds = getMeal();
    const newMeal =[];

    for(const id of storedIds){
      const storedMeal = meals.find(meal => meal.idMeal=== id)
      if(storedMeal){
        newMeal.push(storedMeal)
      }
      setBookmarked(newMeal)
    }

  },[meals])
  const handleRemoveFromBookmark =(id) => {
    const newMeal = bookmarked.filter(meal=> meal.idMeal!== id)
    setBookmarked(newMeal)
    removeMeal(id)
  }

  return (
    <>
  <Navbar handleSearch={handleSearch} searchRef={searchRef} bookmarked={bookmarked}></Navbar>
    
    <div className='flex justify-end gap-2 mt-2 px-4'> 
      {
        bookmarked.map((meal,i) => {
        return(
          <div key={i} className='space-x-2 flex items-end'>
            <img className='w-8 inline' src={meal.strMealThumb}/>
            <button onClick={()=> handleRemoveFromBookmark(meal.idMeal)} className='px-2 border'>x</button>
          </div>
        )
       })
      }
      </div>
    <div className='flex gap-3 flex-wrap justify-center mt-4 p-4'>
    <Suspense fallback={<p>Loading........</p>}>
    {
      categories.map(category=> {
        const isActive = mealName === category.strCategory || !mealName && category.strCategory === 'Beef'
        return(
          <button onClick={()=> setMealName(category.strCategory)} className={`p-2 border border-red-500 text-red-500 flex gap-2 cursor-pointer ${isActive && 'bg-red-500 text-white border-red-500'}`} key={category.idCategory}>{category.strCategory}<img className='w-8 rounded-full' src={category.strCategoryThumb}/></button>
        )
      })
    }
    </Suspense>
    </div>
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 px-4 md:px-10'>
    {meals.length === 0? <p className="text-gray-500 text-2xl text-center col-span-full mt-40">No meals found.</p>:
      meals?.map(meal => {
        return(
          <div key={meal.idMeal} className='flex flex-col justify-between border p-2'>
            <img className='w-full object-cover' src={meal.strMealThumb} alt="" />
            <div className='flex justify-between items-center py-3'>

              <h3 className='font-semibold mt-2 text-lg md:text-xl'>{meal.strMeal}</h3>

              <button disabled={bookmarked.find(markd=>markd.idMeal===meal.idMeal)} onClick={()=> handleBookmark(meal)} className='cursor-pointer'>
                   
                {
                  bookmarked.find(markd=>markd.idMeal===meal.idMeal)?<FaBookmark className='text-3xl text-red-500'/>:<FaRegBookmark className='text-3xl' />

                }
                     
              </button>
              
            </div>
            <button className='bg-red-500 p-3 text-white rounded mt-2'>Order Now</button>
          </div>
        )
      })
    }
    </div>
    



  {/* <Child setColor={setColor}></Child> */}

    </>
  )
}

export default App
