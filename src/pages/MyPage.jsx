import React from 'react'
import { styled } from 'styled-components'

function MyPage() {
  return (
    <MyPageContainer>
      <h1>My Page</h1>
      <ProfileContainer>
        <ProfilePicContainer>
          <span>profile pic</span>
          <button>이미지 선택</button>
        </ProfilePicContainer>
        <ProfileInfoContainer>
          <input placeholder='user.id' />
          <input placeholder='자기소개' />
          <input placeholder='가본 여행지' />
        </ProfileInfoContainer>
        <ProfileBtnContainer>
          <button type='button'>취소</button>
          <button type='button'>저장</button>
        </ProfileBtnContainer>
      </ProfileContainer>
      <PostContainer>
        <PostBtnContainer>
          <button type='button'>내가 작성한 게시물</button>
          <button type='button'>내가 좋아한 게시물</button>
        </PostBtnContainer>
        <CardContainer>
          <div>카드</div>
          <div>카드</div>
          <div>카드</div>
          <div>카드</div>
          <div>카드</div>
          <div>카드</div>
        </CardContainer>
      </PostContainer>
    </MyPageContainer>
  )
}

export default MyPage

const MyPageContainer = styled.div`
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
const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
`

const ProfilePicContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
  border-radius: 50%;
  width: 300px;
  height: 300px;
  margin: 10px;
`

const ProfileInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  border: 1px solid red;
  width: calc(100% - 20px);
  padding: 10px;
  input {
    margin-bottom: 10px;
  }
`

const ProfileBtnContainer = styled.div`
  display: flex;
  width: calc(100% - 20px);
  margin: 10px;
  justify-content: end;
  button {
    margin-left: 10px;
  }
`

const PostContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid black;
  width: 100%;
`

const PostBtnContainer = styled.div`
  display: flex;
  margin: 10px;
  justify-content: space-evenly;
  width: 100%;
`

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;

  div {
    width: 80px;
    height: 80px;
    margin: 10px;
    border: 1px solid green;
  }
`
