import { styled } from "styled-components"

const StyledInput = styled.input`
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 0.7rem 1rem;
    font-size: 1rem;
    outline: none;
    &:hover,
    &:focus,
    &:focus-within {
      border-color: #000;
    }
`

const InputText = ({value, onChange, id, name, placeholder,...props}) => {
  return (
    <StyledInput
      type='text' 
      name={name} 
      id={id} 
      onChange={(e)=> onChange(e.target.value)} 
      value={value} 
      placeholder={placeholder}
      {...props}
    />
  )
}

export default InputText