import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import UpdateProfile from 'components/UpdateProfile'
import * as S from 'components/MyPage.styled.js'
import PostCards from 'components/PostCards'
import Profile from 'components/Profile'
import { storage } from 'fb/storage'
import { db } from 'firebase.js'

function MyPage() {
  const [userUpdate, setUserUpdate] = useState(false)
  const [postsTab, setPostsTab] = useState(true)
  const [preview, setPreview] = useState(null)
  const [imgFile, setImgFile] = useState(null)
  const [userInfo, setUserInfo] = useState({})
  const [myPosts, setMyPosts] = useState([])

  const navigate = useNavigate()
  const params = useParams()

  const handleInput = (e) => {
    const { value, name } = e.target
    if (name === 'name') {
      setUserInfo({ ...userInfo, name: value })
    } else if (name === 'intro') {
      setUserInfo({ ...userInfo, intro: value })
    } else if (name === 'places') {
      setUserInfo({ ...userInfo, places: value })
    }
  }

  const handleImgSelect = (e) => {
    let file = e.target.files[0]
    let image = URL.createObjectURL(file)
    setImgFile(file)
    setPreview(image)
  }

  const handleDeleteImage = () => {
    setPreview(null)
    setImgFile(null)
  }

  // 마이페이지 유저 프로필 업데이트 함수
  const handleUpload = async () => {
    const { name, intro, places, id } = userInfo
    const infoRef = doc(db, 'users', id)
    if (imgFile === null) {
      const newInfo = { ...userInfo, name, intro, places, profile: '' }
      await updateDoc(infoRef, newInfo)
      setUserInfo(newInfo)
    } else {
      const imageRef = ref(storage, `${params.myId}/${imgFile.name}`)
      await uploadBytes(imageRef, imgFile)

      const downloadURL = await getDownloadURL(imageRef)

      const newInfo = { ...userInfo, name, intro, places, profile: downloadURL }

      await updateDoc(infoRef, newInfo)
      setUserInfo(newInfo)
    }
    setUserUpdate(false)
  }

  const handleMyPosts = () => {
    setPostsTab(true)
  }
  const handleLikePosts = () => {
    setPostsTab(false)
  }
  const session = useMemo(() => {
    return JSON.parse(sessionStorage.getItem(`firebase:authUser:${process.env.REACT_APP_FIREBASE_API_KEY}:[DEFAULT]`))
  }, [])

  useEffect(() => {
    if (!session || session.uid !== params.myId) {
      alert('잘못된 접근입니다.')
      navigate('/')
    }
    const fetchData = async () => {
      const q = query(collection(db, 'users'), where('id', '==', params.myId))
      const snapShot = await getDocs(q)
      snapShot.forEach((doc) => {
        setUserInfo(doc.data())
        setPreview(doc.data().profile)
      })
    }
    fetchData()
  }, [navigate, params.myId, session])

  // myPage 작성한 게시물, 좋아요한 게시물 모아보는 탭 불러오기
  useEffect(() => {
    const fetchPostsTab = async () => {
      if (postsTab) {
        const q = query(collection(db, 'posts'), where('uid', '==', params.myId))
        const snapShot = await getDocs(q)
        snapShot.forEach((doc) => {
          setMyPosts((prev) => [...prev, doc.data()])
        })
      } else {
        const likedPostIdList = []
        const q = query(collection(db, 'likes'), where('likedList', 'array-contains', params.myId))
        const snapShot = await getDocs(q)
        snapShot.forEach((doc) => {
          likedPostIdList.push(doc.id)
        })

        const q1 = query(collection(db, 'posts'), where('postId', 'in', likedPostIdList))
        const snapShot1 = await getDocs(q1)
        snapShot1.forEach((doc) => {
          setMyPosts((prev) => [...prev, doc.data()])
        })
      }
    }
    setMyPosts([])
    fetchPostsTab()
  }, [params.myId, postsTab])

  return (
    <S.MyPageContainer>
      <h1>My Page</h1>
      {userUpdate ? (
        <UpdateProfile
          handleInput={handleInput}
          handleImgSelect={handleImgSelect}
          handleDeleteImage={handleDeleteImage}
          userInfo={userInfo}
          preview={preview}
          setUserUpdate={setUserUpdate}
          handleUpload={handleUpload}
        />
      ) : (
        <Profile userInfo={userInfo} setUserUpdate={setUserUpdate} />
      )}

      <S.PostContainer>
        <S.PostBtnContainer>
          <button type='button' onClick={handleMyPosts}>
            내가 작성한 게시물
          </button>
          <button type='button' onClick={handleLikePosts}>
            내가 좋아한 게시물
          </button>
        </S.PostBtnContainer>
        <S.CardContainer>
          {myPosts.map((el) => (
            <PostCards key={`PostCards_${el.postId}`} data={el} />
          ))}
        </S.CardContainer>
      </S.PostContainer>
    </S.MyPageContainer>
  )
}

export default MyPage
