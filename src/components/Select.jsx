import React, { useEffect, useRef, useState, Children } from 'react'
import { styled } from 'styled-components'
import { CaretDown, CaretUp } from '@phosphor-icons/react'

export default function Select({ name, title = '목록', placeholder, defaultValue, width, onChange, children }) {
  const [isOpen, setOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const selectButtonRef = useRef(null)
  const selectListRef = useRef(null)
  const selectContainerRef = useRef(null)

  const handleClickSelectButton = () => {
    setOpen((prevIsOpen) => !prevIsOpen)
  }

  const handleKeyDownList = (e) => {
    if (e.keyCode === 9) {
      // Tab Key Down
      if (e.target === e.currentTarget.lastChild) {
        e.preventDefault()
        e.currentTarget.firstChild.focus()
      }
    } else if (e.keyCode === 27) {
      // escape Key Down
      selectButtonRef.current.focus()
    }
  }

  const handleKeyDownItem = (e, value) => {
    if (e.keyCode === 13) {
      selectItem(value)
    }
  }

  const selectItem = (value, label) => {
    setSelected(label)
    setOpen(false)
    if (onChange) setTimeout(() => onChange(value), 0)
  }

  useEffect(() => {
    function handleClickOutSide(e) {
      if (selectListRef.current && !selectContainerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }

    if (defaultValue) {
      Children.forEach(children, (child) => {
        if (defaultValue === child.props.value) {
          setSelected(child.props.children)
        }
      })
    }

    document.addEventListener('mousedown', handleClickOutSide)
    return () => document.removeEventListener('mousedown', handleClickOutSide)
  }, [selectListRef, children, defaultValue])

  return (
    <StyledContainer ref={selectContainerRef} w={width} name={name}>
      <SelectButton
        type='button'
        aria-label={`${title} 목록을 열고 닫는 버튼`}
        onClick={handleClickSelectButton}
        ref={selectButtonRef}
        open={isOpen}
      >
        {selected || placeholder}
        <OpenStatusIcon>{isOpen ? <CaretUp size={20} /> : <CaretDown size={20} />}</OpenStatusIcon>
      </SelectButton>
      {isOpen && (
        <SelectList ref={selectListRef} tabIndex='-1' onKeyDown={handleKeyDownList}>
          {Children.map(children, (child, i) => (
            <li
              key={i}
              tabIndex='0'
              onKeyDown={(e) => handleKeyDownItem(e, child.props.value)}
              onClick={(e) => selectItem(child.props.value, child.props.children)}
            >
              {child}
            </li>
          ))}
        </SelectList>
      )}
    </StyledContainer>
  )
}

const StyledContainer = styled.div`
  display: inline-block;
  position: relative;
  text-align: left;
  padding: 5px;
  width: ${({ w }) => (w ? `${w}px` : '200px')};
`

const SelectButton = styled.button`
  box-sizing: border-box;
  text-align: left;
  width: 100%;
  font-size: 1rem;
  border: 1px solid #050505;
  background-color: #050505;
  color: white;
  border-radius: 25px;
  padding: 0.7rem 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`

const SelectList = styled.ul`
  box-sizing: border-box;
  width: 100%;
  list-style: none;
  position: absolute;
  z-index: 100;
  border: 1px solid #050505;
  border-radius: 25px;
  overflow: hidden;
  top: 110%;
`

const OpenStatusIcon = styled.span`
  display: flex;
  align-items: center;
`
