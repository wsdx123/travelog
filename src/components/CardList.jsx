import { collection, getDocs, updateDoc, query, doc, where } from '@firebase/firestore'
import { auth, db } from '../firebase' // firebase db 임포트!
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import CardItem from './CardItem'

function CardList({ posts }) {
  // const posts = useSelector((state) => {
  //   return state.posts
  // })

  // fetching data from firebase, useState로 세팅
  // const [posts, setPosts] = useState([])
  // const posts = useSelector((state) => state.posts)

  useEffect(() => {
    // const fetchData = async () => {
    //   const q = query(collection(db, 'posts'))
    //   const querySnapshot = await getDocs(q)
    //   const initialPosts = []
    //   querySnapshot.forEach((doc) => {
    //     initialPosts.push({ id: doc.id, ...doc.data() })
    //   })
    //   setPosts(initialPosts)
    // }
    // fetchData()
  }, [])

  // useEffect(() => {
  //   console.log('length: ', posts.length)
  // }, [posts])

  // style components
  const StPostList = {
    width: '100%',
    maxWidth: '100%',
    height: '250px',
    display: 'flex',
    paddingLeft: '20px',
    borderSizing: 'border-box',
  }

  console.log(posts)
  console.log(posts.length)

  // if (posts === []) return <div>loading..</div>

  return (
    <div style={{ ...StPostList }}>
      {posts.map((post) => {
        return <CardItem key={`cardKey__${post.postId}`} post={post} />
      })}
    </div>
  )
}

export default CardList
