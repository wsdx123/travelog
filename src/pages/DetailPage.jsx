import React from 'react'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux/es/hooks/useSelector'
import { useRef } from 'react'
import { deletePost, getPostByPostId } from 'fb/db'
import { Link, useNavigate, useParams } from 'react-router-dom'

function DetailPage() {
  console.log('hi!!!!!!!!')
  //
  const [post, setPost] = useState(null)
  const { postId } = useParams()
  const navigate = useNavigate()

  const dispatch = useDispatch()
  const comments = useSelector((state) => {
    return state.comments
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
