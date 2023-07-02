import { Link, useNavigate } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { styled } from 'styled-components'

import { HeartIcon } from 'assets/svgs'
import { auth, db } from 'firebase.js'
import { heartHandler } from 'fb/db'

export const Season = {
  spring: '봄',
  summer: '여름',
  fall: '가을',
  winter: '겨울',
}

export const TravelWith = {
  couple: '커플',
  family: '가족',
  friend: '친구',
  alone: '혼자',
  etc: '기타',
}

function CardItem({ post }) {
  const [totalHeart, setTotalHeart] = useState(0)
  const [heart, setHeart] = useState(false)

  const navigate = useNavigate()

  const handleHeart = async (e) => {
    if (!auth.currentUser) {
      alert('로그인 후 이용바랍니다.')
      return navigate('/SignInPage')
    }
    setHeart((prev) => !prev)
    try {
      await heartHandler(heart, post.postId)
    } catch (error) {
      console.error(error.code)
    }
  }

  useEffect(() => {
    const fetchHeart = async () => {
      const snapShot = await getDoc(doc(db, 'likes', post.postId))

      if (!auth.currentUser) {
        setTotalHeart(snapShot.data().likedList.length)
      } else {
        setTotalHeart(snapShot.data().likedList.length)
        if (snapShot.data().likedList.includes(auth.currentUser.uid)) {
          setHeart(true)
        }
      }
    }
    fetchHeart()
  }, [post, heart])

  return (
    <div key={post.postId}>
      <StPostCard>
        <img className='inner-component-img' alt='imgPosted' src={post.imageUrl} />
      </StPostCard>
      <StPostCard>
        <div className='inner-component-text'>
          <Button onClick={handleHeart}>
            <HeartIcon className={heart ? 'selectFavorite' : 'heartIcon'} />
          </Button>
          <p style={{ fontSize: '0.7em', fontWeight: '600' }}>좋아요 {totalHeart}개</p>
          <p style={{ marginTop: '20px' }}>
            <strong>목적지</strong> | {post.destination}
          </p>
          <p>
            <strong>여행시기</strong> | {Season[post.period]}
          </p>
          <p>
            <strong>함께 여행한 사람</strong> | {TravelWith[post.partner]}
          </p>
          <div style={{ marginTop: '25px' }}>{post.content}</div>
          <div style={{ float: 'right', bottom: '0' }}>
            <Link to={`/postPage/${post.postId}`}>DETAILS</Link>
          </div>
        </div>
      </StPostCard>
    </div>
  )
}

export default CardItem

// style components

const StPostCard = styled.div`
  position: relative;
  float: left;
  width: 800px;
  height: 500px;
  border: 1px solid black;
  line-height: 30px;
  overflow: hidden;

  .inner-component-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
  }
  .inner-component-text {
    padding: 20px;

    p {
      strong {
        font-weight: 600;
      }
    }
  }
`

const Button = styled.button`
  border: none;
  padding: 0;
  margin: 0;
  width: auto;
  height: auto;
  background-color: transparent;

  .heartIcon {
    width: 20px;
    height: 19px;
    fill: gray;
    stroke: black;
  }

  .selectFavorite {
    width: 20px;
    height: 19px;
    fill: red;
    stroke: black;
  }
`
