import { storage } from 'fb/storage'
import { db } from 'firebase.js'
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import React, { useEffect, useState } from 'react'

import * as S from 'components/Profile.styled.js'
import UpdateProfile from 'components/UpdateProfile'
import Profile from 'components/Profile'
import { useParams } from 'react-router-dom'
import PostCards from 'components/PostCards'

function MyPage() {
  const [userName, setUserName] = useState('')
  const [userIntro, setUserIntro] = useState('')
  const [userPlaces, setUserPlaces] = useState('')
  const [preview, setPreview] = useState(null)
  const [posts, setPosts] = useState(true)
  const [tmp, setTmp] = useState([])

  const [imgFile, setImgFile] = useState(null)
  const [userInfo, setUserInfo] = useState({})
  const [userUpdate, setUserUpdate] = useState(false)

  const params = useParams()

  const handleInput = (e) => {
    const { value, name } = e.target
    if (name === 'name') {
      setUserName(value)
    } else if (name === 'intro') {
      setUserIntro(value)
    } else if (name === 'places') {
      setUserPlaces(value)
    }
  }

  const handleImgSelect = (e) => {
    let file = e.target.files[0]
    let image = URL.createObjectURL(file)
    setImgFile(file)
    setPreview(image)
  }
  const handlePreview = () => {
    setPreview(null)
    setImgFile(null)
  }

  const handleUpload = async () => {
    const infoRef = doc(db, 'users', userInfo.id)
    if (imgFile === null) {
      const newInfo = { ...userInfo, name: userName, intro: userIntro, places: userPlaces, profile: '' }
      await updateDoc(infoRef, newInfo)
      setUserInfo(newInfo)
    } else {
      const imageRef = ref(storage, `${params.myId}/${imgFile.name}`)
      await uploadBytes(imageRef, imgFile)

      const downloadURL = await getDownloadURL(imageRef)

      const newInfo = { ...userInfo, name: userName, intro: userIntro, places: userPlaces, profile: downloadURL }

      await updateDoc(infoRef, newInfo)
      setUserInfo(newInfo)
    }
    setUserUpdate(false)
  }

  const handleMyPosts = () => {
    setPosts(true)
  }
  const handleLikePosts = () => {
    setPosts(false)
  }

  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, 'users'), where('id', '==', params.myId))
      const snapShot = await getDocs(q)
      snapShot.forEach((doc) => {
        setUserInfo(doc.data())
        setUserName(doc.data().name)
        setUserIntro(doc.data().intro)
        setUserPlaces(doc.data().places)
        setPreview(doc.data().profile)
      })
    }
    fetchData()
  }, [params.myId])

  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     const q = query(collection(db, 'posts'), where('uid','==', params.myId))
  //     const snapShot = await getDocs(q)
  //     snapShot.forEach((doc) => {
  //       setTmp((prev) => [...prev, doc.data()])
  //     })
  //   }
  //   fetchPosts()
  // },[params.myId, posts])

  return (
    <S.MyPageContainer>
      <h1>My Page</h1>
      {userUpdate ? (
        <UpdateProfile
          handleInput={handleInput}
          handleImgSelect={handleImgSelect}
          handlePreview={handlePreview}
          userName={userName}
          userIntro={userIntro}
          userPlaces={userPlaces}
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
          {tmp.map((el) => (
            <PostCards data={el} key={el.id} />
          ))}
        </S.CardContainer>
      </S.PostContainer>
    </S.MyPageContainer>
  )
}

export default MyPage
