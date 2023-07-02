import { styled } from "styled-components"



export default function TextArea ({ value, onChange, id, name, placeholder,...props }) {
  return (
    <StyledTextArea
      name={name} 
      id={id} 
      value={value}
      onChange={(e)=> onChange(e.target.value)} 
      placeholder={placeholder}
      {...props}
      maxLength={1000}
    />
  )
}

const StyledTextArea = styled.textarea`
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 0.7rem 1rem;
    font-size: 1rem;
    outline: none;
    resize: none;
    width: 500px;
    height: 200px;
    &:hover,
    &:focus,
    &:focus-within {
      border-color: #000;
    }
`