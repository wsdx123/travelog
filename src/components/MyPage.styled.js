import { styled } from 'styled-components'

export const MyPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px;

  h1 {
    font-size: xx-large;
    font-weight: 800;
    margin: 20px;
  }
`
export const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
`

export const ProfilePicContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
  border-radius: 50%;
  width: 300px;
  height: 300px;
  margin: 10px;
  overflow: hidden;

  img {
    object-fit: cover;
  }
`

export const ProfileInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  border: 1px solid red;
  width: calc(100% - 20px);
  padding: 10px;
  div {
    label {
      min-width: 100px;
    }
    input {
      width: 100%;
    }
    display: flex;
    margin-bottom: 10px;
    align-items: center;
  }
  span {
    margin-bottom: 10px;
  }
`

export const ProfileBtnContainer = styled.div`
  display: flex;
  width: calc(100% - 20px);
  margin: 10px;
  justify-content: end;
  button {
    margin-left: 10px;
  }
`

export const PostContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid black;
  width: 100%;
`

export const PostBtnContainer = styled.div`
  display: flex;
  margin: 10px;
  justify-content: space-evenly;
  width: 100%;
`

export const CardContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
`

export const CardItem = styled.div`
  width: 80px;
  height: 80px;
  margin: 10px;
  /* border: 1px solid green; */
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: all 0.25s ease-in-out;
    &:hover {
      opacity: 0.6;
    }
  }
`
