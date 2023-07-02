import { browserSessionPersistence, setPersistence, signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { styled } from 'styled-components'
import { useState } from 'react'

import { Container, FormContainer, Title } from './SignUpPage'
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
        <LoginInput type='text' name='signInEmail' value={email} onChange={handleOnChange} />
        <LoginInput type='password' name='signInPassword' value={password} onChange={handleOnChange} />
        <button type='submit'>로그인</button>
      </FormContainer>
      <button type='button' onClick={() => navigate('/signUpPage')}>
        회원가입
      </button>
    </Container>
  )
}

export default SignInPage

export const LoginInput = styled.input`
  width: 300px;
  height: 30px;
  margin-bottom: 10px;
  border-radius: 5px;
  border: 1px solid #707070;
  padding: 0px 10px;
`
