import * as S from 'components/MyPage.styled.js'
import empty from 'assets/user.png'

function Profile({ userInfo, setUserUpdate }) {
  return (
    <S.ProfileContainer>
      <S.ProfilePicContainer>
        <img src={userInfo.profile === '' ? empty : userInfo.profile} width={300} height={300} alt='profileImg' />
      </S.ProfilePicContainer>
      <S.ProfileInfoContainer>
        <span>
          <strong>이름</strong> | {userInfo.name}
        </span>
        <span>
          <strong>자기소개</strong> | {userInfo.intro}
        </span>
        <span>
          <strong>가본 여행지</strong> | {userInfo.places}
        </span>
      </S.ProfileInfoContainer>
      <S.ProfileBtnContainer>
        <button onClick={() => setUserUpdate(true)}>수정</button>
      </S.ProfileBtnContainer>
    </S.ProfileContainer>
  )
}

export default Profile
