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

function Header() {
  const navigate = useNavigate()

  return (
    <div style={{ ...HeaderStyles }}>
      <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        TRAVELOG
      </span>
      <nav style={{ paddingLeft: '20px' }}>
        <Link to='/SignUpPage'>회원가입</Link>
        <Link to='/SignInPage'>로그인</Link>
        <Link to='/PostPage?action=write'>게시글작성</Link>
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
