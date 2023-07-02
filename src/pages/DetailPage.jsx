import { useCallback, useEffect, useState, useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { styled } from 'styled-components'
import { v4 } from 'uuid'

import { getPostByPostId, updatePost, deletePostWithData } from 'fb/db'
import { Season, TravelWith } from 'components/CardItem'
import { auth } from 'firebase.js'

function DetailPage() {
  const [editComment, setEditComment] = useState('')
  const [comments, setComments] = useState([])
  const [isEdit, setIsEdit] = useState('')
  const [post, setPost] = useState(null)
  const [input, setInput] = useState('')

  const addInputRef = useRef()

  const { postId } = useParams()
  const navigate = useNavigate()

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
  }

  const handleDeletePost = async () => {
    if (auth.currentUser.uid !== post.uid) return alert('삭제 권한이 없습니다.')
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
    if (auth.currentUser.uid !== uid) return alert('권한이 없습니다')
    try {
      const tmp = comments.filter((el) => el.id !== id)
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
  }, [addInputRef, post])

  if (!post) return <div>Loadng...</div>
  return (
    <StDetailPage>
      <div>
        <img className='inner-img' alt='postedImage' src={post.imageUrl} />
        <div className='inner-buttons'>
          <Link className='inner-Link' to={`/postPage?action=edit&postId=${post.postId}`}>
            수정하기
          </Link>
          <button onClick={handleDeletePost}>삭제</button>
        </div>
        <div className='inner-context'>
          <p>
            <strong>여행시기</strong> | {Season[post.period]}
          </p>
          <p>
            <strong>목적지</strong> | {post.destination}
          </p>
          <p>
            <strong>함께 여행한 사람</strong> | {TravelWith[post.partner]}
          </p>
          <p>"{post.content}"</p>
        </div>
      </div>
      <div className='StComments'>
        <p style={{ fontSize: '2em', fontWeight: '600', padding: '20px' }}>COMMENTS</p>
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
        <div className='StCommentsList'>
          {comments.map((comment) => {
            return (
              <div key={`comments_ID_${comment.id}`}>
                <div>
                  <p>ID: {comment.uid}</p>
                  <p style={{ fontWeight: '600' }}>{comment.text}</p>
                </div>
                <div style={{ marginBottom: '40px' }}>
                  <button onClick={() => verifyCommentsUpdate(comment.id, comment.uid)}>수정</button>

                  <button onClick={() => handleCommentsDelete(comment.id, comment.uid)}>삭제</button>
                </div>
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
    padding-left: 10px;
    margin-top: 20px;
    text-align: left;

    p {
      strong {
        font-weight: 600;
      }
    }
  }

  .inner-buttons {
    display: flex;
    justify-content: end;

    .inner-Link {
      margin: 4px;
      display: inline-block;
      text-align: center;
      text-decoration: none;
      color: black;
      font-size: 13px;
      width: 120px;
      height: 30px;
      background: #ffffff 0% 0% no-repeat padding-box;
      border: 1px solid #050505;
      box-sizing: border-box;
      border-radius: 32px;
      opacity: 1;
      cursor: pointer;
      font-family: IBM Plex Sans KR;
    }
  }

  .StComments {
    text-align: left;
    margin-top: 30px;
    padding: 20px;
    border: 1px solid #050505;
  }

  .inputStyle {
    padding-left: 25px;
    width: 70%;
    height: 25px;
    margin-bottom: 10px;
    border-radius: 15px;
    border: 1px solid #050505;
    background: #050505;
    color: white;
  }

  .StCommentsList {
    padding-left: 20px;
    margin-top: 40px;
  }
`
