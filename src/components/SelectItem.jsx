import { styled } from "styled-components"

export default function SelectItem ({value, children, ...props}) {
  return (
    <StyledSelectItem value={value} {...props}>{children}</StyledSelectItem>
  )
}

const StyledSelectItem = styled.div`
  background-color: #fff;
  font-size: 16px;
  padding: 0.6rem 1rem;
  cursor: pointer;
  &:hover {
    background-color: #eee;
  }
`