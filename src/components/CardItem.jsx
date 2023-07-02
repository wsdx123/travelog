import { auth, db } from 'firebase.js'
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

function CardItem({ post }) {
  const dispatch = useDispatch()
  const [heart, setHeart] = useState(false)

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
      if (snapShot.data().likedList.includes(auth.currentUser.uid)) {
        setHeart(true)
      }
    }
    fetchHeart()
  }, [post.postId])

  return (
    <div
      style={{
        padding: '10px',
        margin: '10px',
        float: 'column',
      }}
      key={post.postId}
    >
      {post.postId} | <img src={post.imageUrl} style={{ width: '100px' }} /> | {post.destinaion} | {post.period} |{' '}
      {post.partner} | {post.content}|{post.isLiked.toString()}
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
      {/* <button
    onClick={() => {
      dispatch({
        type: 'ISLIKED_POST',
        payload: post.postId,
      })
    }}
  > */}
      <button onClick={handleHeart}>{heart ? 'heart filled' : 'heart empty'}</button>
      {/* <button onClick={delPost}>DELETE</button>
  <button onClick={islikedPost}>{heart}</button> */}
    </div>
  )
}

export default CardItem
