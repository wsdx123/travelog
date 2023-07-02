import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, FormContainer, Title } from './SignUpPage'
import { browserSessionPersistence, setPersistence, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from 'firebase.js'

function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  const handleOnChange = (e) => {
    if (e.target.name === 'signInEmail') {
      setEmail(e.target.value)
    } else if (e.target.name === 'signInPassword') {
      setPassword(e.target.value)
    }
  }

  const handleSignIn = async (e) => {
    e.preventDefault()
    try {
      // const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const userCredential = await setPersistence(auth, browserSessionPersistence).then(() => {
        return signInWithEmailAndPassword(auth, email, password)
      })
      console.log(userCredential)
      navigate('/')
    } catch (error) {
      const errorCode = error.code
      if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') {
        alert('이메일 혹은 비밀번호가 틀렸습니다.')
      }
    }
  }

  return (
    <Container>
      <Title>로그인</Title>
      <FormContainer onSubmit={handleSignIn}>
        <input type='text' name='signInEmail' value={email} onChange={handleOnChange} />
        <input type='password' name='signInPassword' value={password} onChange={handleOnChange} />
        <button type='submit'>로그인</button>
      </FormContainer>
      <button type='button' onClick={() => navigate('/signUpPage')}>
        회원가입
      </button>
    </Container>
  )
}

export default SignInPage
