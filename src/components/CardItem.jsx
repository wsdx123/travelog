import { auth, db } from 'firebase.js'
import { arrayUnion, doc, updateDoc } from 'firebase/firestore'
import React from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

function CardItem({ post }) {
  const dispatch = useDispatch()

  const handleHeart = async (e) => {
    console.log(e)
    try {
      const heartRef = doc(db, 'likes', post.postId)
      console.log(heartRef)
      await updateDoc(heartRef, {
        likedList: arrayUnion(auth.currentUser.uid),
      })
    } catch (error) {
      // console.error(error.code)
    }
  }

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
      <button onClick={handleHeart}>heart</button>
      {/* <button onClick={delPost}>DELETE</button>
  <button onClick={islikedPost}>{heart}</button> */}
    </div>
  )
}

export default CardItem
