import { auth, db } from 'firebase.js'
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

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
