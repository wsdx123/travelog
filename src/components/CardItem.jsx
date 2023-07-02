import { auth, db } from 'firebase.js'
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { styled } from 'styled-components'

function CardItem({ post }) {
  const dispatch = useDispatch()
  const [heart, setHeart] = useState(false)
  const [totalHeart, setTotalHeart] = useState(0)

  const handleHeart = async (e) => {
    setHeart((prev) => !prev)

    try {
      if (!heart) {
        const heartRef = doc(db, 'likes', post.postId)
        await updateDoc(heartRef, {
          likedList: arrayUnion(auth.currentUser.uid),
        })
      } else {
        const heartRef = doc(db, 'likes', post.postId)
        await updateDoc(heartRef, {
          likedList: arrayRemove(auth.currentUser.uid),
        })
      }
    } catch (error) {
      console.error(error.code)
    }
  }
  useEffect(() => {
    if (!auth.currentUser) return
    const fetchHeart = async () => {
      const snapShot = await getDoc(doc(db, 'likes', post.postId))
      console.log(typeof snapShot.data().length)
      setTotalHeart(snapShot.data().length)
      if (snapShot.data().likedList.includes(auth.currentUser.uid)) {
        setHeart(true)
      }
    }
    fetchHeart()
  }, [post.postId])

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
