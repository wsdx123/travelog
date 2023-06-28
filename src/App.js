import Layout from 'components/Layout'
import DetailPage from 'pages/DetailPage'
import HomePage from 'pages/HomePage'
import MyPage from 'pages/MyPage'
import PostPage from 'pages/PostPage'
import SignInPage from 'pages/SignInPage'
import SignUpPage from 'pages/SignUpPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='myPage' element={<MyPage />} />
          <Route path='postPage' element={<PostPage />} />

          <Route path='SignUpPage' element={<SignUpPage />} />
          <Route path='SignInPage' element={<SignInPage />} />
          <Route path='/post/:postId' element={<DetailPage />} />

        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
