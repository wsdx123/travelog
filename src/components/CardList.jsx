import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

function CardList() {
  const posts = useSelector((state) => {
    return state.posts
  })

  const dispatch = useDispatch()

  return (
    <div>
      CardList
      {posts.map((post) => {
        const heart = post.isLiked ? 'heartFilled' : 'heartEmpty'
        // 불리안 값으로 좋아요 하트 상태 변경
        return (
          <div
            style={{
              padding: '10px',
              margin: '10px',
              float: 'column',
            }}
            key={post.id}
          >
            {post.id} | {post.place} | {post.date} | {post.group} | {post.review} | {post.isLiked.toString()}
            <div>
              <button>
                {/* dropdown 수정, 삭제 버튼 만들기 */}
                <Link to={`/postPage/${post.id}`}>EDIT</Link>
              </button>
            </div>
            <div>
              <button
                onClick={() => {
                  dispatch({
                    type: 'DELETE_POST',
                    payload: post.id,
                  })
                }}
              >
                DELETE
              </button>
            </div>
            <button
              onClick={() => {
                dispatch({
                  type: 'ISLIKED_POST',
                  payload: post.id,
                })
              }}
            >
              {heart}
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default CardList
