import { heartHandler } from 'fb/db'
import { auth, db } from 'firebase.js'
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { styled } from 'styled-components'

import { Link, useNavigate } from 'react-router-dom'


function CardItem({ post }) {
  const dispatch = useDispatch()
  const [heart, setHeart] = useState(false)
  const [totalHeart, setTotalHeart] = useState(0)
  const navigate = useNavigate()

  const handleHeart = async (e) => {
    if (!auth.currentUser) {
      alert('로그인 후 이용바랍니다.')
      return navigate('/SignInPage')
    }
    setHeart((prev) => !prev)
    try {
      await heartHandler(heart, post.postId)
    } catch (error) {
      console.error(error.code)
    }
  }
  useEffect(() => {
    const fetchHeart = async () => {
      const snapShot = await getDoc(doc(db, 'likes', post.postId))

      if (!auth.currentUser) {
        setTotalHeart(snapShot.data().likedList.length)
      } else {
        setTotalHeart(snapShot.data().likedList.length)
        if (snapShot.data().likedList.includes(auth.currentUser.uid)) {
          setHeart(true)
        }
      }
    }
    fetchHeart()
  }, [post, heart])
  console.log(post)

  // style components

  const StPostCard = styled.div`
    /* display: flex; */
    position: relative;
    float: left;
    width: 800px;
    height: 500px;
    border: 1px solid black;
    line-height: 30px;
    object-fit: cover;
    overflow: hidden;

    /* .inner-component-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      overflow: hidden;
    } */
  `

  return (
    <div key={post.postId}>
      <StPostCard>
        <div className='inner-component-img'>
          <img alt='imgPosted' src={post.imageUrl} />
        </div>
      </StPostCard>
      <StPostCard>
        <p>좋아요 {totalHeart}개</p>
        {post.destinaion} |{post.period}|<div>{post.content}</div>
        <button>
          <Link to={`/postPage/${post.postId}`}>EDIT</Link>
        </button>
        <button onClick={handleHeart}>{heart ? 'heart filled' : 'heart empty'}</button>
      </StPostCard>
    </div>
  )
}

export default CardItem
