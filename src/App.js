import { BrowserRouter, Route, Routes } from 'react-router-dom'

import DetailPage from 'pages/DetailPage'
import SignInPage from 'pages/SignInPage'
import SignUpPage from 'pages/SignUpPage'
import Layout from 'components/Layout'
import HomePage from 'pages/HomePage'
import PostPage from 'pages/PostPage'
import MyPage from 'pages/MyPage'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/myPage/:myId' element={<MyPage />} />
          <Route path='postPage' element={<PostPage />} />

          <Route path='SignUpPage' element={<SignUpPage />} />
          <Route path='SignInPage' element={<SignInPage />} />
          <Route path='/postPage/:postId' element={<DetailPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
