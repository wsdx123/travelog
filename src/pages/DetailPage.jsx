import React from 'react'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux/es/hooks/useSelector'
import { useRef } from 'react'
import { deletePost, getPostByPostId, updatePost } from 'fb/db'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { auth } from 'firebase.js'
import { v4 } from 'uuid'

function DetailPage() {
  const [post, setPost] = useState(null)
  const { postId } = useParams()

  const navigate = useNavigate()

  const dispatch = useDispatch()
  // const comments = useSelector((state) => {
  //   return state.details // comments -> details
  // })
  const [input, setInput] = useState('')
  const [comments, setComments] = useState([])
  const [editComment, setEditComment] = useState('')
  const [isEdit, setIsEdit] = useState('')

  const addInputRef = useRef()
  const editInputRef = useRef()

  const handleComments = async (e) => {
    e.preventDefault()
    // dispatch({
    //   type: 'ADD_COMMENTS',
    //   payload: comment,
    // })
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

  const handleCommentsDelete = async (id) => {
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
      const tmp = post.comments.map((el) => (el.id === id ? { ...el, text: editComment } : el))
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
        <p>이미지: {post.imgeUrl}</p>
        <p>언제: {post.period}</p>
        <p>어디로: {post.destination}</p>
        <p>누구와: {post.partner}</p>
        <p>후기: {post.content}</p>
        <p>isLiked: {post.isLiked.toString()}</p>
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
              {comment.text}
              <button onClick={() => setIsEdit(comment.id)}>수정</button>

              <button onClick={() => handleCommentsDelete(comment.id)}>삭제</button>
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
