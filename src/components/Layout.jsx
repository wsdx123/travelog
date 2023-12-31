import { useNavigate } from 'react-router-dom'
import { styled } from 'styled-components'
import { signOut } from '@firebase/auth'

import { auth } from 'firebase.js'

function Header() {
  const navigate = useNavigate()

  const handleMyPage = () => {
    navigate(`/myPage/${auth.currentUser.uid}`)
  }

  const handleLogOut = async () => {
    alert('로그아웃되었습니다.')
    await signOut(auth)
    navigate('/')
    window.location.replace('/')
  }

  const handleSignUp = () => {
    navigate(`/SignUpPage`)
  }
  const handleSignIn = () => {
    navigate(`/SignInPage`)
  }

  const handleWritePost = async () => {
    navigate(`/PostPage?action=write`)
  }

  return (
    <div style={{ ...HeaderStyles }}>
      <p>여행자 트래블 로그</p>
      <StTitleText onClick={() => navigate('/')}>TRAVELOG</StTitleText>
      <nav style={{ paddingLeft: '20px' }}>
        {sessionStorage.getItem(`firebase:authUser:${process.env.REACT_APP_FIREBASE_API_KEY}:[DEFAULT]`) === null ? (
          <div style={{ ...navBtn }}>
            <button type='button' onClick={handleSignUp}>
              회원가입
            </button>
            <button type='button' onClick={handleSignIn}>
              로그인
            </button>
          </div>
        ) : (
          <div style={{ ...navBtn }}>
            <div>
              <button type='button' onClick={handleMyPage}>
                My Page
              </button>
              <button type='button' onClick={handleLogOut}>
                로그아웃
              </button>
            </div>
            <button type='button' onClick={handleWritePost}>
              게시글작성
            </button>
          </div>
        )}
      </nav>
    </div>
  )
}

function Layout({ children }) {
  return (
    <div>
      <Header />
      <MainContainer style={{ ...layoutStyles }}>{children}</MainContainer>
    </div>
  )
}

export default Layout

// style components
const StTitleText = styled.p`
  float: left;
  font-size: 6em;
  cursor: pointer;
`

const HeaderStyles = {
  position: 'fixed',
  top: '0',
  left: '0',
  zIndex: '9999',
  width: '100%',
  background: '#DAFF5B',
  height: '100px',
  padding: '20px',
  display: 'block',
  alignItems: 'center', // 세로 가운데 정렬
  justifyContent: 'left', // 가로 가운데 정렬
  paddingLeft: '20px',
  color: 'black',
  fontWeight: '600',
  fontFamily: 'IBM Plex Sans KR',
}

const layoutStyles = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  fontFamily: 'IBM Plex Sans KR',
}

const navBtn = {
  float: 'right',
  marginRight: '40px',
  display: 'grid',
  alignItems: 'center',
}

const MainContainer = styled.div`
  margin-top: 140px;
`
