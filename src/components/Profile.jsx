import * as P from 'components/profile.styled.js'
import empty from 'pages/user.png'

function Profile({ userInfo, setUserUpdate }) {
  return (
    <P.ProfileContainer>
      <P.ProfilePicContainer>
        <img src={userInfo.profile === '' ? empty : userInfo.profile} width={300} height={300} alt='profileImg' />
      </P.ProfilePicContainer>
      <P.ProfileInfoContainer>
        <span>이름 : {userInfo.name}</span>
        <span>자기소개 : {userInfo.intro}</span>
        <span>가본 여행지 : {userInfo.places}</span>
      </P.ProfileInfoContainer>
      <P.ProfileBtnContainer>
        <button onClick={() => setUserUpdate(true)}>수정</button>
      </P.ProfileBtnContainer>
    </P.ProfileContainer>
  )
}

export default Profile
