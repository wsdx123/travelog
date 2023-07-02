import { styled } from 'styled-components'

export const MyPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px;
  height: calc(100vh - 140px);

  h1 {
    color: #707070;
    font-size: 30px;
    font-weight: 500;
    margin: 100px 0 50px 0;
  }
`
export const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export const ProfilePicContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid #707070;
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
  width: 600px;
  padding: 10px;
  margin-top: 50px;

  div {
    display: flex;
    margin-bottom: 10px;
    align-items: center;

    label {
      min-width: 100px;
    }

    input {
      width: 100%;
      border: 1px solid #707070;
      padding: 7px 0px 7px 10px;
      border-radius: 20px;
      background-color: white;
    }
  }

  span {
    margin-bottom: 10px;
    border: 1px solid #707070;
    padding: 7px 0px 7px 10px;
    border-radius: 20px;
    background-color: white;
    color: #707070;

    strong {
      font-weight: 600;
    }
  }
`

export const ProfileBtnContainer = styled.div`
  display: flex;
  width: calc(100% - 20px);
  margin: 10px;
  justify-content: end;
  margin-bottom: 50px;

  button {
    margin-left: 10px;
  }
`

export const PostContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`

export const PostBtnContainer = styled.div`
  display: flex;
  margin: 10px;
  justify-content: center;
  width: 100%;

  button {
    margin: 0 10px 0 10px;
  }
`

export const CardContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
`

export const CardItem = styled.div`
  width: 150px;
  height: 150px;
  margin: 10px;
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
