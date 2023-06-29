import React from 'react'
import { styled, css } from 'styled-components'

export default function Button ({type = 'button', onClick, color, variant,children, size, icon, ...props}) {
  return (
    <StyledButton 
      type={type}
      onClick={onClick} 
      color={color}
      variant={variant}
      fontSize={size}
      {...props}
    >
      {icon && <IconWrapper>{icon}</IconWrapper>}
      {children}
    </StyledButton>
  )
}

const StyledButton = styled.button`
  line-height: 1.4;
  font-size: 1rem;
  padding: 0.5rem 1.2rem;
  display: inline-flex;
  gap: 8px;
  align-items: center;
  color: #fff;
  background-color: #0099FF;
  border: 1px solid transparent;
  border-radius: 0.6rem;
  cursor: pointer;

  ${props => props.color === 'secondary' && css`
    background-color: #FA7070;
    border-color: #d15e5e;
  `}

  ${props => props.variant === 'outlined' && css`
    background-color: #fff;
    color: #0099FF;
    border-color: #0099FF;
  `}

  ${props => props.fontSize === 'small' && css`
    font-size: 0.8rem;
  `}

  ${props => props.fontSize === 'large' && css`
    font-size: 1.2rem;
  `}
`

const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
`