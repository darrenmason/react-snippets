import {useState} from 'react'

export default function Replace({handleReplace, index}){

  const [replacement, setReplacement] = useState('')

  function handleChange(e){
    const {value} = e.target
    setReplacement(value)
  }

  return (
    <>
      <input onChange={handleChange} type="text" />
      <button onClick={() => handleReplace(replacement, index)}>Replace</button>
    </>
  )
}