import { collection, getDocs, updateDoc, query, doc, where } from '@firebase/firestore'
import { auth, db } from '../firebase' // firebase db 임포트!
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import CardItem from './CardItem'

function CardList() {
  // const posts = useSelector((state) => {
  //   return state.posts
  // })

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

  console.log(posts)
  return (
    <div>
      CardList
      {posts.map((post) => {
        // 불리안 값으로 좋아요 하트 상태 변경

        return <CardItem key={`cardKey__${post.postId}`} post={post} />
      })}
    </div>
  )
}

export default CardList
