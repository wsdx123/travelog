import { css, styled } from 'styled-components'

export const MapWrapper = styled.div`
  background-color: #fff;
  position: relative;
  width: 400px;
  display: flex;
  gap: 20px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export const MenuWrapper = styled.div`
  width: 100%;
`

export const StyledList = styled.ul`
  width: 100%;
  height: 300px;
  overflow-y: auto;
  padding: 0;
  margin: 20px 0;
  list-style: none;
  text-align: left;
  line-height: 1.5;
  border: 1px solid #eee;
`

export const StyledListItem = styled.li`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 8px;
  background-color: #fff;
  cursor: pointer;
  &:not(:last-child) {
    border-bottom: 1px solid #eee;
  }
  ${({ isSelected }) =>
    isSelected &&
    css`
      background-color: #ebebeb;
      cursor: default;
    `}
`

export const DisplaySelectedPlace = styled.div`
  margin: 12px 0;
  display: flex;
  gap: 10px;
  justify-content: flex-start;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const FormInner = styled.div`
  gap: 14px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`

export const StyledInput = styled.input`
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #ccc;
  font-size: 16px;
  outline: none;
  &:hover,
  &:focus,
  &:focus-within {
    border-color: #000;
  }
`

export const StyledButton = styled.button`
  background-color: #0099ff;
  color: #fff;
  border: none;
  font-size: 16px;
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
`

export const TabMenu = styled.div`
  margin: 10px 0;
  border: 1px solid #0099ff;
  display: inline-flex;
`

export const TabMenuItem = styled.button`
  background-color: #fff;
  border: none;
  color: #0099ff;
  font-size: 16px;
  padding: 0.5rem 1.2rem;
  cursor: pointer;

  ${({ isSelected }) =>
    isSelected === 'true' &&
    css`
      background-color: #0099ff;
      color: #fff;
      cursor: default;
    `}

  &:not(:last-child) {
    border-right: 1px solid #0099ff;
  }
`

export const GetPositionIcon = styled.button`
  cursor: pointer;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
  background-color: white;
  border-radius: 8px;
  width: 30px;
  height: 30px;
  margin: 0;
  padding: 0;
  display: flex;
  color: #0099ff;
  border: none;
  position: absolute;
  z-index: 100;
  right: 10px;
  bottom: 10px;
  align-items: center;
  justify-content: center;
`
