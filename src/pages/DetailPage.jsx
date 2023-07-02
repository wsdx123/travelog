import React from 'react'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { useRef } from 'react'
import { deletePost, getPostByPostId, updatePost } from 'fb/db'
import { useNavigate, useParams } from 'react-router-dom'
import { auth } from 'firebase.js'
import { v4 } from 'uuid'
import { deletePostWithData } from '../fb/db'

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
    <>
      <p>Detail Page</p>
      <div style={{ margin: '20px' }}>
        <p>
          이미지:
          <div>
            <img alt='postedImage' src={post.imageUrl} style={{ width: '200px' }} />
          </div>
        </p>
        <p>언제: {post.period}</p>
        <p>어디로: {post.destination}</p>
        <p>누구와: {post.partner}</p>
        <p>후기: {post.content}</p>
        <button onClick={updatePost}>수정</button>
        <button onClick={handleDeletePost}>삭제</button>
      </div>

      <form onSubmit={handleComments}>
        <input
          ref={addInputRef}
          type='text'
          placeholder='comments를 남겨주세요.'
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
          }}
        />
        <button>댓글등록</button>
      </form>
      <div>
        {comments.map((comment) => {
          return (
            <div key={`comments_ID_${comment.id}`}>
              <div>
                <p>ID: {comment.uid} |</p>
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
              {/* <ul>
                {comment.editMode ? (
                  <>
                    <input
                      value={editComment.comments}
                      ref={editInputRef}
                      onChange={(e) => {
                        setComments(e.target.value)
                      }}
                    ></input>
                    <button>수정완료</button>
                  </>
                ) : (
                  <>
                    <li>{comment.comments}</li>
                    <button
                      onClick={() => {
                        dispatch({
                          type: 'EDIT_MODE',
                          payload: comment,
                        })
                        // 이부분 왜 안되는지 모르겠음!!!
                        // editInputRef.current.focus()
                      }}
                    >
                      수정하기 : {comment.editMode.toString()}
                    </button>

                    <button
                      onClick={() => {
                        dispatch({
                          type: 'DELETE_COMMENTS',
                          payload: comment,
                        })
                      }}
                    >
                      삭제하기
                    </button>
                  </>
                )}
              </ul> */}
            </div>
          )
        })}
      </div>
    </>
  )
}

export default DetailPage
