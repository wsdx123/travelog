import { auth } from 'firebase.js'
import { onAuthStateChanged } from 'firebase/auth'
import React, { useEffect } from 'react'

function HomePage() {
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      console.log(user)
    })
  }, [])
  return <div>HomePage</div>
}

export default HomePage
