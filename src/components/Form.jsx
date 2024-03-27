import {Store} from '../context/Store'
import {useState} from 'react'

export default function Form(){
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: ""
  })

  function handleSubmit(e){
    e.preventDefault()
    console.log(formData)
  }

  function handleChange(e){
    const {name, value} = e.target
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: value
      }
    })
  }
  
  return (
    <>
      <form onSubmit={handleSubmit}>
        <input name="firstName" value={formData.firstName} onChange={handleChange} />
        <input name="lastName" value={formData.lastName} onChange={handleChange} />
        <button>Submit</button>
      </form>
    </>
  )
}