import { collection, getDocs, query } from '@firebase/firestore'
import { db } from '../firebase' // firebase db 임포트!
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'

function CardList() {
  // const posts = useSelector((state) => {
  //   return state.posts
  // })

  const dispatch = useDispatch()

  // fetching data from firebase, useState로 세팅
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, 'posts'))
      const querySnapshot = await getDocs(q)

      const initialPosts = []

      querySnapshot.forEach((doc) => {
        initialPosts.push({ id: doc.id, ...doc.data() })
      })

      setPosts(initialPosts)
    }

    fetchData()
  }, [])

  return (
    <div>
      {posts.map((post) => {
        const heart = post.isLiked ? 'heartFilled' : 'heartEmpty'
        // 불리안 값으로 좋아요 하트 상태 변경

        return (
          <div key={post.postId}>
            <img alt='postimage' src={post.imageUrl} style={{ width: '200px' }} /> <br />
            <div>
              <li style={{ display: 'flex' }}>
                <ul>user.id</ul>
                <ul>{post.period}</ul>
                <ul>{post.destination}</ul>
                <ul>{post.partner}</ul>
                <ul>{post.content}</ul>
              </li>
            </div>
            {/* 좋아요: {post.isLiked.toString()} */}
            {/* postId: {post.postId} */}
            <div>
              <Link to={`/postPage/${post.postId}`}>EDIT</Link>
            </div>
            <div>
              <button
                onClick={() => {
                  dispatch({
                    type: 'DELETE_POST',
                    payload: post.postId,
                  })
                }}
              >
                DELETE
              </button>

              <button
                onClick={() => {
                  dispatch({
                    type: 'ISLIKED_POST',
                    payload: post.postId,
                  })
                }}
              >
                {heart}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default CardList
