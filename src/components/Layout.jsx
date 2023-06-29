import { signOut } from '@firebase/auth'
import { auth } from 'firebase.js'

import React from 'react'

import { Link, useNavigate } from 'react-router-dom'

const HeaderStyles = {
  width: '100%',
  background: '#DAFF5B',
  height: '50px',
  display: 'flex',
  alignItems: 'center', // 세로 가운데 정렬
  justifyContent: 'center', // 가로 가운데 정렬
  // paddingLeft: '20px',
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
  }
  console.log(auth.currentUser)
  return (
    <div style={{ ...HeaderStyles }}>
      <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        TRAVELOG
      </span>
      <nav style={{ paddingLeft: '20px' }}>
        {auth.currentUser === null ? (
          <div>
            <Link to='/SignUpPage'>회원가입</Link>
            <Link to='/SignInPage'>로그인</Link>
          </div>
        ) : (
          <div>
            <Link to='/PostPage?action=write'>게시글작성</Link>

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
