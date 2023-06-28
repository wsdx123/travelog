
import { app } from 'firebase.js'
import React from 'react'
import CardList from 'components/CardList'
import Form from 'components/Form'

// 추가기능 LIST
// 1. 무한스크롤
// 2. 지도API

function HomePage() {
  return (
    <div>
      <h3>HomePage</h3>
      {/* 검색 */}
      <form>
        <input type='text' placeholder='검색' />
        <button>아이콘</button>
      </form>
      {/* 게시글 리스트 */}
      <Form />
      <CardList />
    </div>
  )

}

export default HomePage
