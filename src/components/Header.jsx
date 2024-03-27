import useApi from '../hooks/useApi'

export default function Header() {

  const url = "https://swapi.dev/api/people/1/"
  const {data, isLoading, error} = useApi(url)

  console.log(data)

  return(
    <>
      <header>
        <div>
          my company
        </div>
        <menu>
          <ul>
            {data && data.films.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </menu>
      </header>
    </>
  )
  
}