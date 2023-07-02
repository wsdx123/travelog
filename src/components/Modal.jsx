import { styled } from 'styled-components'

const StyledContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
`

const StyledModalBackGround = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
`

const StyledModal = styled.div`
  box-shadow: rgba(0, 0, 0, 0.09) 0px 3px 12px;
  background-color: #fff;
  border-radius: 20px;
  padding: 10px;
  border: 1px solid #eee;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const StyledModalButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 4px;
  font-weight: 600;
`

const StyledButton = styled.button`
  background-color: transparent;
  border: none;
  color: #0099ff;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.2rem 0.4rem;
  font-weight: 600;
  &:hover {
    color: #003457;
  }
`

const Modal = ({ type = 'alert', title, closeFunc, confirmFunc, children }) => {
  return (
    <StyledContainer>
      <StyledModalBackGround onClick={type === 'alert' ? closeFunc : null} />
      <StyledModal>
        <ModalHeader>
          <div>{title}</div>
          <StyledModalButtons>
            {type === 'confirm' && (
              <StyledButton onClick={closeFunc} color='secondary'>
                닫기
              </StyledButton>
            )}
            <StyledButton onClick={type === 'confirm' ? confirmFunc : closeFunc}>확인</StyledButton>
          </StyledModalButtons>
        </ModalHeader>
        <div>{children}</div>
      </StyledModal>
    </StyledContainer>
  )
}

export default Modal
