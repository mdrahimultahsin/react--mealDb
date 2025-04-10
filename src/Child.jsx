import React, {use, useEffect, useState} from "react";

const Child = ({setColor}) => {
//   const [todos, setTodos] = useState([]);
  // useEffect(()=> {
  // fetch('https://jsonplaceholder.typicode.com/todos')
  // .then (res=> res.json())
  //     .then(data => setTodos(data))
  // },[])

//   useEffect(() => {

//     // const intervalID = setInterval(() => {
//     //   console.log("interval");
//     // }, 1000);

//     return () => {
//     //   clearInterval(intervalID);
//       setColor('tomato')
//     };
//   }, []);
  return (
    <div>
      <h1>Hello</h1>
      <button>Add</button>
    </div>
  );
};

export default Child;
