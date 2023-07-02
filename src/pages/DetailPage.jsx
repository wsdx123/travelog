import React from 'react'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { useRef } from 'react'
import { deletePost, getPostByPostId, updatePost } from 'fb/db'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { auth } from 'firebase.js'
import { v4 } from 'uuid'
import { deletePostWithData } from '../fb/db'

import { styled } from 'styled-components'

function DetailPage() {
  const [post, setPost] = useState(null)
  const { postId } = useParams()

  const navigate = useNavigate()

  const [input, setInput] = useState('')
  const [comments, setComments] = useState([])
  const [editComment, setEditComment] = useState('')
  const [isEdit, setIsEdit] = useState('')

  const addInputRef = useRef()
  const editInputRef = useRef()

  const handleComments = async (e) => {
    e.preventDefault()

    setInput('')

    try {
      const tmp = { text: input, uid: auth.currentUser.uid, id: v4() }
      await updatePost(post.id, { comments: [...comments, tmp] })
      setComments((prev) => [...prev, tmp])
    } catch (error) {
      console.log(error)
    }

    // 왜 안되는거임??ㅠㅠ
    // addInputRef.current.focus()
  }

  const handleDeletePost = async () => {
    if (auth.currentUser.uid !== post.uid) return
    try {
      await deletePostWithData(post.postId)
      navigate('/')
    } catch (error) {
      console.error(error)
    }
  }

  const verifyCommentsUpdate = (id, uid) => {
    if (auth.currentUser.uid === uid) {
      setIsEdit(id)
    } else {
      alert('권한이 없습니다')
    }
  }

  const handleCommentsDelete = async (id, uid) => {
    if (auth.currentUser.uid !== uid) return alert('권한이없습니다')
    try {
      const tmp = post.comments.filter((el) => el.id !== id)
      await updatePost(post.id, { comments: tmp })
      setComments(tmp)
    } catch (error) {
      console.log(error)
    }
  }

  const handleCommentsUpdate = async (id, e) => {
    e.preventDefault()
    try {
      const tmp = comments.map((el) => (el.id === id ? { ...el, text: editComment } : el))
      console.log(tmp)
      await updatePost(post.id, { comments: tmp })
      setComments(tmp)
    } catch (error) {
      console.log(error)
    }

    setIsEdit('')
  }

  const loadPost = useCallback(async () => {
    try {
      const postData = await getPostByPostId(postId)
      console.log(postData)
      if (!postData) {
        console.log('redirect')
        navigate('/')
      }
      setPost(postData)
      setComments(postData.comments)
    } catch (error) {
      console.error(error)
      navigate('/')
    }
  }, [postId, navigate])

  useEffect(() => {
    loadPost()
  }, [loadPost])

  useEffect(() => {
    if (addInputRef.current) addInputRef.current.focus()
    console.log(addInputRef.current)
  }, [addInputRef, post])

  if (!post) return <div>Loadng...</div>

  console.log(comments)

  return (
    <StDetailPage>
      <div>
        <img className='inner-img' alt='postedImage' src={post.imageUrl} />
        <div className='inner-buttons'>
          <Link to={`/postPage?action=edit&postId=${post.postId}`}>수정하기</Link>
          {/* <button onClick={updatePost}>수정</button> */}
          <button onClick={handleDeletePost}>삭제</button>
        </div>
        <div className='inner-context'>
          <p>{post.period}</p>
          <p>{post.destination}</p>
          <p>{post.partner}</p>
          <p>"{post.content}"</p>
        </div>
      </div>
      <div className='StComments'>
        <p>COMMENTS</p>
        <form onSubmit={handleComments}>
          <input
            className='inputStyle'
            ref={addInputRef}
            type='text'
            placeholder='comments를 남겨주세요.'
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
            }}
          />
          <button type='submit'>댓글등록</button>
        </form>
        <div>
          {comments.map((comment) => {
            return (
              <div key={`comments_ID_${comment.id}`}>
                <div>
                  <p>ID: {comment.uid} |</p>
                  {/* ㄴ이거 유저아이디로 변경? */}
                  <p>{comment.text}</p>
                </div>
                <button onClick={() => verifyCommentsUpdate(comment.id, comment.uid)}>수정</button>

                <button onClick={() => handleCommentsDelete(comment.id, comment.uid)}>삭제</button>
                {isEdit === comment.id ? (
                  <form onSubmit={(e) => handleCommentsUpdate(comment.id, e)}>
                    <input type='text' value={editComment} onChange={(e) => setEditComment(e.target.value)} />
                    <button type='submit'>완료</button>
                    <button type='button' onClick={() => setIsEdit('')}>
                      취소
                    </button>
                  </form>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
    </StDetailPage>
  )
}

export default DetailPage

// style components
const StDetailPage = styled.div`
  width: 50%;
  justify-content: center;
  margin: 0 auto;
  text-align: center;
  line-height: 30px;
  font-family: IBM Plex Sans KR;

  .inner-img {
    width: 100%;
  }

  .inner-context {
    margin-top: 20px;
    text-align: left;
  }

  .inner-buttons {
    text-align: right;
  }

  .StComments {
    margin-top: 40px;
    padding: 50px;
    border: 1px solid #050505;
  }

  .inputStyle {
    width: 70%;
    height: 25px;
    margin-bottom: 50px;
    border-radius: 15px;
    border: 1px solid #050505;
    background: #050505;
    color: white;
  }
`
