import { auth } from 'firebase.js'
import { createUserWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { styled } from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export const Title = styled.h1`
  margin: 30px 0;
  font-size: x-large;
  font-weight: 700;
`

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
`

const EMAIL_REG = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i

const PW_REG = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,25}$/

function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [verifyPw, setVerifyPw] = useState('')

  const navigate = useNavigate()

  const handleOnChange = (e) => {
    if (e.target.name === 'signUpEmail') {
      setEmail(e.target.value)
    } else if (e.target.name === 'signUpPassword') {
      setPassword(e.target.value)
    } else if (e.target.name === 'signUpVerifyPw') {
      setVerifyPw(e.target.value)
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()

    if (!EMAIL_REG.test(email)) {
      alert('올바르지않은 이메일 형식입니다')
      return
    } else if (!PW_REG.test(password)) {
      alert('올바르지 않은 비밀번호 형식입니다')
      return
    } else if (password !== verifyPw) {
      alert('비밀번호가 일치하지 않습니다.')
      return
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      console.log(userCredential.user)
      signOut(auth)
      alert('회원가입이 완료되었습니다. 로그인 화면에서 로그인을 해주세요')
      navigate('/signInPage')
    } catch (error) {
      const errorCode = error.code
      if (errorCode === 'auth/email-already-in-use') {
        alert('이미 사용중인 이메일주소입니다.')
      }
    }
  }

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      console.log(user)
    })
  }, [])

  return (
    <Container>
      <Title>회원가입</Title>
      <FormContainer onSubmit={handleSignUp}>
        <input type='text' name='signUpEmail' value={email} onChange={handleOnChange} placeholder='Email' required />
        <input
          type='password'
          name='signUpPassword'
          value={password}
          onChange={handleOnChange}
          placeholder='비밀번호'
          required
        />
        <span>영문/숫자 조합(8~25자)</span>
        <input
          type='password'
          name='signUpVerifyPw'
          value={verifyPw}
          onChange={handleOnChange}
          placeholder='비밀번호 확인'
          required
        />
        <button type='submit'>회원가입</button>
      </FormContainer>
      <button type='button' onClick={() => navigate('/signInPage')}>
        로그인
      </button>
    </Container>
  )
}

export default SignUpPage
