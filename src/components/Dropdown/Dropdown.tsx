/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import {
  ComponentProps,
  FormEvent,
  PropsWithChildren,
  ReactNode,
  createContext,
  useContext,
  useState,
} from "react"

interface DropdownContextProps<T> {
  isOpen: boolean
  selected: T
  onOpen: () => void
  onClose: () => void
  onSelect: (item: T) => void
}

const DropdownContext = createContext<DropdownContextProps<any> | null>(null)

export const useDropdownContext = () => {
  const context = useContext(DropdownContext)
  if (context === null) {
    throw new Error()
  }
  return context
}

interface DropdownBoxProps<T> {
  value: T
  onChange: (item: T) => void
  children: ReactNode
  initialValue?: boolean
  persist?: boolean
}

export const DropdownProvider = <T,>({
  initialValue = false,
  persist = false,
  value,
  onChange,
  children,
}: DropdownBoxProps<T>) => {
  const [isOpen, setIsOpen] = useState(initialValue) //초기값을 주는것도 가능
  const [selected, setSelected] = useState<T>(value) //선택된 값을 내부적으로 관리하는 state
  const handleOpen = () => setIsOpen(true)
  const handleClose = () => setIsOpen(false)

  const handleSelect = (item: T) => {
    setSelected(item) //내부 state 변경
    onChange(item) // 외부에서 주입된 함수 실행
    persist || handleClose()
  }

  return (
    <DropdownContext.Provider
      value={{
        isOpen,
        selected,
        onOpen: handleOpen,
        onClose: handleClose,
        onSelect: handleSelect,
      }}>
      {children}
    </DropdownContext.Provider>
  )
}

const Trigger = ({ as }: { as: ReactNode }) => {
  const { onOpen, onClose, isOpen } = useDropdownContext()
  return <div onClick={() => (isOpen ? onClose() : onOpen())}>{as}</div>
}

const Menu = ({ children }: PropsWithChildren) => {
  const { isOpen } = useDropdownContext()
  if (!isOpen) return null
  return <div>{children}</div>
}

const Item = ({ value, checked = false }: { value: string; checked?: boolean }) => {
  const { selected, onSelect } = useDropdownContext()
  return (
    <div>
      {checked ? (
        <CheckBox
          label={value}
          checked={selected?.includes(value)}></CheckBox>
      ) : (
        <div onClick={() => onSelect(value)}>{value}</div>
      )}
    </div>
  )
}
//모달을 추가하기 -> 모달을 컨트롤할 수 있는 버튼이 필요함
interface ModalProps {
  children: ReactNode
  controls: ReactNode
}

const Modal = ({ children, controls }: ModalProps) => {
  const { isOpen, onSelect, onClose } = useDropdownContext()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const checked = e.currentTarget.querySelectorAll("input[type='checkbox']:checked")
    onSelect([...checked])
    onClose()
  }

  if (!isOpen) return null

  return (
    <form onSubmit={handleSubmit}>
      <div>{children}</div>
      {controls}
    </form>
  )
}

const Dropdown = Object.assign(DropdownProvider, {
  Trigger,
  Menu,
  Item,
  Modal,
})

export default Dropdown

interface CheckBoxProps extends Omit<ComponentProps<"input">, "label"> {
  label?: string
}

const CheckBox = ({ label, ...props }: CheckBoxProps) => {
  const [isChecked, setisChecked] = useState(props.checked || false)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setisChecked(e.target.checked)
  }

  return (
    <div>
      <input
        id={label}
        type="checkbox"
        value={label}
        onChange={onChange}
        checked={isChecked}></input>
      <label htmlFor={label}>{label}</label>
    </div>
  )
}
