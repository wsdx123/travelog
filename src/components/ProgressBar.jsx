import { styled } from 'styled-components'

const ProgressBar = ({ value, title, open }) => {
  if (!open) return null
  return (
    <>
      <ProgressBarBg />
      <ProgressBarContainer>
        <progress max='100' value={`${value}`}>
          {`${value}%`}
        </progress>
        <h4>{title}</h4>
      </ProgressBarContainer>
    </>
  )
}

export default ProgressBar

const ProgressBarBg = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.2);
`

const ProgressBarContainer = styled.div`
  box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
  background-color: #fff;
  font-size: 1.4rem;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 10px;
  flex-direction: column;
  padding: 20px;
  border-radius: 10px;
  align-items: center;
`
