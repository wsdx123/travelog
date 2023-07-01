import * as S from 'components/MyPage.styled.js'
import empty from 'pages/user.png'

function Profile({ userInfo, setUserUpdate }) {
  return (
    <S.ProfileContainer>
      <S.ProfilePicContainer>
        <img src={userInfo.profile === '' ? empty : userInfo.profile} width={300} height={300} alt='profileImg' />
      </S.ProfilePicContainer>
      <S.ProfileInfoContainer>
        <span>이름 : {userInfo.name}</span>
        <span>자기소개 : {userInfo.intro}</span>
        <span>가본 여행지 : {userInfo.places}</span>
      </S.ProfileInfoContainer>
      <S.ProfileBtnContainer>
        <button onClick={() => setUserUpdate(true)}>수정</button>
      </S.ProfileBtnContainer>
    </S.ProfileContainer>
  )
}

export default Profile
