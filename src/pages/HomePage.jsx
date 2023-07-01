import { auth } from 'firebase.js'
import React, { useEffect, useState } from 'react'
import CardList from 'components/CardList'

import Form from 'components/Form'

import { onAuthStateChanged } from '@firebase/auth'

import { getPostsAll } from 'fb/db'

// 추가기능 LIST
// 1. 무한스크롤
// 2. 지도API

function HomePage() {
  const [posts, setPosts] = useState(null)
  useEffect(() => {
    getPostsAll().then((postsArray) => setPosts(postsArray))
  }, [])

  useEffect(() => {
    console.dir(posts)
  }, [posts])
  return (
    <div>
      <h3>HomePage</h3>
      {/* 검색 */}
      <form>
        <input type='text' placeholder='검색' />
        <button>아이콘</button>
      </form>
      {/* 게시글 리스트 */}
      <br />
      <CardList />
      <button>f</button>
    </div>
  )
}

export default HomePage
