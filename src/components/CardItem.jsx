import { heartHandler } from 'fb/db'
import { auth, db } from 'firebase.js'
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
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

  const StPostCard = {
    width: '100%',
    maxWidth: '100%',
  }

  return (
    <div style={{ ...StPostCard }} key={post.postId}>
      <div>
        <img alt='imgPosted' src={post.imageUrl} style={{ width: '100px' }} />
      </div>
      <p>좋아요 {totalHeart}개</p>
      <ul>
        <li>{post.destinaion}</li>
        <li>{post.period}</li>
        <li>{post.partner}</li>
        <li>{post.content}</li>
      </ul>
      <div>
        <button>
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
      <button onClick={handleHeart}>{heart ? 'heart filled' : 'heart empty'}</button>
    </div>
  )
}

export default CardItem
