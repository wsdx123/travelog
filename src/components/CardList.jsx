import { addDoc, collection, getDocs, query } from '@firebase/firestore'
import { db } from '../firebase' // firebase db 임포트!
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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
      CardList
      {posts.map((post) => {
        const heart = post.isLiked ? 'heartFilled' : 'heartEmpty'
        // 불리안 값으로 좋아요 하트 상태 변경
        console.log(posts)
        return (
          <div
            style={{
              padding: '10px',
              margin: '10px',
              float: 'column',
            }}
            key={post.postId}
          >
            {post.postId} | {post.imageUrl} | {post.destinaion} | {post.period} | {post.partner} | {post.content}|
            {post.isLiked.toString()}
            <div>
              <button>
                {/* dropdown 수정, 삭제 버튼 만들기 */}
                <Link to={`/postPage/${post.postId}`}>EDIT</Link>
              </button>
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
            </div>
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
        )
      })}
    </div>
  )
}

export default CardList
