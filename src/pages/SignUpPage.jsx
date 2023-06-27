import { auth } from 'firebase.js'
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import React, { useEffect, useState } from 'react'

function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleOnChange = (e) => {
    if (e.target.type === 'text') {
      setEmail(e.target.value)
    } else {
      setPassword(e.target.value)
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      console.log(userCredential.user)
    } catch (error) {
      const errorCode = error.code
      const errorMessage = error.message
      console.log(errorCode, errorMessage)
    }
  }

  useEffect(() => {
    // onAuthStateChanged(auth, (user) => {
    //   console.log(user)
    // })
    console.log(auth.currentUser)
  }, [])

  return (
    <div>
      <h1>회원가입</h1>
      <form onSubmit={handleSignUp}>
        <div>
          <label>ID</label>
          <input type='text' value={email} onChange={handleOnChange} />
        </div>
        <div>
          <label>Password</label>
          <input type='password' value={password} onChange={handleOnChange} />
        </div>
        <button type='submit'>회원가입</button>
      </form>
    </div>
  )
}

export default SignUpPage
