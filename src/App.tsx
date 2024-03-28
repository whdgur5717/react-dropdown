import Select from "./components/Select"

function App() {
  const options = ["a", "b", "c"]
  return (
    <>
      <Select
        options={options}
        trigger={<button>클릭</button>}
      />
    </>
  )
}

export default App
