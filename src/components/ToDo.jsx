import {useState} from 'react'
import Replace from './Replace'

export default function ToDo(){

  const [todo, setTodo] = useState('')
  const [todolist, setTodoList] = useState([])
  
  function handleChange(e){
    const {value} = e.target
    setTodo(value)
  }

  function handleAdd(){
    setTodoList((prevTodoList) => {
      return [
        ...prevTodoList,
        todo
      ]
    })
  }

  function handleRemove(i){
    setTodoList((prevTodoList) => {
      return prevTodoList.filter((item, index) => {
        return i != index
      })
    })
  }

  function handleReplace(replace, i){
    setTodoList((prevTodoList) => {
      return prevTodoList.map((item, index) =>{
        return index == i ? replace : item
      })
    })
  }

  return(
    <>
      <ul>
        {todolist.map((item, i) => (
          <li key={i}>{item}<span>
            <button onClick={() => handleRemove(i)}>Remove</button>
            <Replace index={i} handleReplace={handleReplace} />
            </span></li>
        ))}
      </ul>
      <input onChange={handleChange} type="text" />
      <button onClick={handleAdd}>Add</button>
    </>
  )
}