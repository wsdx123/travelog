import { storage } from 'fb/storage'
import { auth, db } from 'firebase.js'
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import React, { useEffect, useState } from 'react'
import empty from 'pages/user.png'

import * as S from 'components/Profile.styled.js'
import UpdateProfile from 'components/UpdateProfile'
import Profile from 'components/Profile'

function MyPage() {
  const [userName, setUserName] = useState('')
  const [userIntro, setUserIntro] = useState('')
  const [userPlaces, setUserPlaces] = useState('')
  const [preview, setPreview] = useState(null)

  const [imgFile, setImgFile] = useState(null)
  const [userInfo, setUserInfo] = useState({})
  const [userUpdate, setUserUpdate] = useState(false)

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
      const imageRef = ref(storage, `${auth.currentUser.uid}/${imgFile.name}`)
      await uploadBytes(imageRef, imgFile)

      const downloadURL = await getDownloadURL(imageRef)

      const newInfo = { ...userInfo, name: userName, intro: userIntro, places: userPlaces, profile: downloadURL }

      await updateDoc(infoRef, newInfo)
      setUserInfo(newInfo)
    }
    setUserUpdate(false)
  }

  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, 'users'), where('id', '==', auth.currentUser.uid))
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
  }, [])

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
          <button type='button'>내가 작성한 게시물</button>
          <button type='button'>내가 좋아한 게시물</button>
        </S.PostBtnContainer>
        <S.CardContainer>
          <div>카드</div>
          <div>카드</div>
          <div>카드</div>
          <div>카드</div>
          <div>카드</div>
          <div>카드</div>
        </S.CardContainer>
      </S.PostContainer>
    </S.MyPageContainer>
  )
}

export default MyPage
