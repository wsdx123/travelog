import React from 'react'
import { useNavigate } from 'react-router-dom'

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
      <span onClick={() => navigate('/')}>TRAVELOG</span>
      <nav style={{ paddingLeft: '20px' }}>
        <a onClick={() => navigate('/SignUpPage')}>회원가입</a>
        <a onClick={() => navigate('/SignInPage')}>로그인</a>
        <a onClick={() => navigate('/PostPage')}>게시글작성</a>
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
