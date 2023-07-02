import { heartHandler } from 'fb/db'
import { auth, db } from 'firebase.js'
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { styled } from 'styled-components'
import { HeartIcon } from 'assets/svgs'

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

  return (
    <div key={post.postId}>
      <StPostCard>
        <img className='inner-component-img' alt='imgPosted' src={post.imageUrl} />
      </StPostCard>
      <StPostCard>
        <Button onClick={handleHeart}>
          <HeartIcon className={heart ? 'selectFavorite' : 'heartIcon'} />
        </Button>
        <p>좋아요 {totalHeart}개</p>
        {post.destinaion} |{post.period}|<div>{post.content}</div>
        <div>
          <Link to={`/postPage/${post.postId}`}>DETAIL</Link>
        </div>
      </StPostCard>
    </div>
  )
}

export default CardItem

// style components

const StPostCard = styled.div`
  position: relative;
  float: left;
  width: 800px;
  height: 500px;
  border: 1px solid black;
  line-height: 30px;

  overflow: hidden;

  .inner-component-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
  }
`

const Button = styled.button`
  border: none;
  padding: 0;
  margin: 0;
  width: auto;
  height: auto;
  background-color: transparent;

  .heartIcon {
    width: 20px;
    height: 19px;
    fill: gray;
    stroke: black;
  }

  .selectFavorite {
    width: 20px;
    height: 19px;
    fill: red;
    stroke: black;
  }
`
