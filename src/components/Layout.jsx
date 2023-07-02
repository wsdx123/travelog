import { signOut } from '@firebase/auth'
import { auth } from 'firebase.js'

import React from 'react'

import { Link, useNavigate } from 'react-router-dom'

const HeaderStyles = {
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
}

const layoutStyles = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '90vh',
}

const navBtn = {
  float: 'right',
  display: 'grid',
  marginRight: '50px',
  padding: '20px',
}

// 왜 새로고침하고 로그인 페이지로 오면 auth.currentUser 값이 남아있는지?

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

  const handleWritePost = async () => {
    navigate(`/PostPage?action=write`)
  }

  return (
    <div style={{ ...HeaderStyles }}>
      <p>여행자 트래블 로그</p>
      <span onClick={() => navigate('/')} style={{ float: 'left', fontSize: '80px', cursor: 'pointer' }}>
        TRAVELOG
      </span>
      <nav style={{ paddingLeft: '20px' }}>
        {sessionStorage.getItem(`firebase:authUser:${process.env.REACT_APP_FIREBASE_API_KEY}:[DEFAULT]`) === null ? (
          <div>
            <Link to='/SignUpPage'>회원가입</Link>
            <Link to='/SignInPage'>로그인</Link>
          </div>
        ) : (
          <div style={{ ...navBtn }}>
            {/* UI 맞춰주려고 같은 버튼 타입으로 변경 */}
            <button type='button' onClick={handleWritePost}>
              게시글작성
            </button>
            <button type='button' onClick={handleMyPage}>
              My Page
            </button>
            <button type='button' onClick={handleLogOut}>
              로그아웃
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
      <div style={{ ...layoutStyles }}>{children}</div>
    </div>
  )
}

export default Layout
