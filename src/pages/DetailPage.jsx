import React from 'react'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux/es/hooks/useSelector'
import { useRef } from 'react'
import { deletePost, getPostByPostId, updatePost } from 'fb/db'
import { Link, useNavigate, useParams } from 'react-router-dom'

function DetailPage() {
  const [post, setPost] = useState(null)
  const { postId } = useParams()

  const navigate = useNavigate()

  const dispatch = useDispatch()
  const comments = useSelector((state) => {
    return state.details // comments -> details
  })
  const [comment, setComment] = useState('')
  const [editComment, setEditComment] = useState('')

  const addInputRef = useRef()
  const editInputRef = useRef()

  const loadPost = useCallback(async () => {
    try {
      const postData = await getPostByPostId(postId)
      console.log(postData)
      if (!postData) {
        console.log('redirect')
        navigate('/')
      }
      setPost(postData)
    } catch (error) {
      console.error(error)
      navigate('/')
    }
  }, [postId, navigate])

  useEffect(() => {
    loadPost()
  }, [loadPost])

  if (!post) return <div>Loadng...</div>

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
        <p>isLiked: {post.isLiked.toString()}</p>
        <button onClick={updatePost}>수정</button>
        <button onClick={deletePost}>삭제</button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()

          dispatch({
            type: 'ADD_COMMENTS',
            payload: comment,
          })

          setComment('')
          // 왜 안되는거임??ㅠㅠ
          // addInputRef.current.focus()
        }}
      >
        <input
          ref={addInputRef}
          type='text'
          placeholder='comments를 남겨주세요.'
          autoFocus='autofocus'
          value={comment}
          onChange={(e) => {
            setComment(e.target.value)
          }}
        ></input>
        <button>댓글등록</button>
      </form>
      <div>
        {comments.map((comment) => {
          return (
            <div key={comment.id}>
              <ul>
                {comment.editMode ? (
                  <>
                    <input
                      value={editComment.comments}
                      ref={editInputRef}
                      onChange={(e) => {
                        setComment(e.target.value)
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
              </ul>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default DetailPage
