import { ReactNode, useState } from "react"
import Dropdown from "./Dropdown/Dropdown"

interface SelectProps {
  trigger?: ReactNode
  options: string[]
}

const Select = ({ trigger, options }: SelectProps) => {
  const [selected, setSelected] = useState("")

  const onChange = (item: string) => {
    setSelected(item)
  }

  return (
    <>
      <Dropdown
        value={selected}
        onChange={onChange}>
        <Dropdown.Trigger as={trigger}></Dropdown.Trigger>
        <Dropdown.Menu>
          {options.map(option => {
            return <Dropdown.Item value={option}></Dropdown.Item>
          })}
        </Dropdown.Menu>
      </Dropdown>
      선택된 값은 : {selected}
    </>
  )
}

export default Select
