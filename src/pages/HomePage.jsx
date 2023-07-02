import { auth } from 'firebase.js'
import React, { useEffect, useState } from 'react'
import CardList from 'components/CardList'

import { onAuthStateChanged } from '@firebase/auth'

import { getPostsAll } from 'fb/db'
import SearchForm from 'components/SearchForm'

function HomePage() {
  const [posts, setPosts] = useState(null)
  useEffect(() => {
    getPostsAll().then((postsArray) => setPosts(postsArray))
  }, [])

  return (
    <div>
      <SearchForm />
      <CardList />
    </div>
  )
}

export default HomePage
