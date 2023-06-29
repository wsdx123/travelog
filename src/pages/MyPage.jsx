import { storage } from 'fb/storage'
import { auth, db } from 'firebase.js'
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import React, { useEffect, useState } from 'react'
import { styled } from 'styled-components'
import empty from 'pages/user.png'

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
    <MyPageContainer>
      <h1>My Page</h1>
      {userUpdate ? (
        <ProfileContainer>
          <ProfilePicContainer>
            {preview ? (
              <img src={preview} width={300} height={300} alt='profileImg' />
            ) : (
              <input type='file' onChange={handleImgSelect} />
            )}
          </ProfilePicContainer>
          <button type='button' onClick={handlePreview}>
            이미지 삭제
          </button>
          <ProfileInfoContainer>
            <div>
              <label>이름</label>
              <input placeholder='user.id' name='name' onChange={handleInput} value={userName} />
            </div>
            <div>
              <label>자기소개</label>
              <input placeholder='자기소개' name='intro' onChange={handleInput} value={userIntro} />
            </div>
            <div>
              <label>가본 여행지</label>
              <input placeholder='가본 여행지' name='places' onChange={handleInput} value={userPlaces} />
            </div>
          </ProfileInfoContainer>
          <ProfileBtnContainer>
            <button type='button' onClick={() => setUserUpdate(false)}>
              취소
            </button>
            <button type='button' onClick={handleUpload}>
              저장
            </button>
          </ProfileBtnContainer>
        </ProfileContainer>
      ) : (
        <ProfileContainer>
          <ProfilePicContainer>
            <img src={userInfo.profile === '' ? empty : userInfo.profile} width={300} height={300} alt='profileImg' />
          </ProfilePicContainer>
          <ProfileInfoContainer>
            <span>이름 : {userInfo.name}</span>
            <span>자기소개 : {userInfo.intro}</span>
            <span>가본 여행지 : {userInfo.places}</span>
          </ProfileInfoContainer>
          <ProfileBtnContainer>
            <button onClick={() => setUserUpdate(true)}>수정</button>
          </ProfileBtnContainer>
        </ProfileContainer>
      )}
      {/*  */}

      <PostContainer>
        <PostBtnContainer>
          <button type='button'>내가 작성한 게시물</button>
          <button type='button'>내가 좋아한 게시물</button>
        </PostBtnContainer>
        <CardContainer>
          <div>카드</div>
          <div>카드</div>
          <div>카드</div>
          <div>카드</div>
          <div>카드</div>
          <div>카드</div>
        </CardContainer>
      </PostContainer>
    </MyPageContainer>
  )
}

export default MyPage

const MyPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px;

  h1 {
    font-size: xx-large;
    font-weight: 800;
    margin: 20px;
  }
`
const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
`

const ProfilePicContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
  border-radius: 50%;
  width: 300px;
  height: 300px;
  margin: 10px;
  overflow: hidden;

  img {
    object-fit: cover;
  }
`

const ProfileInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  border: 1px solid red;
  width: calc(100% - 20px);
  padding: 10px;
  div {
    label {
      min-width: 100px;
    }
    input {
      width: 100%;
    }
    display: flex;
    margin-bottom: 10px;
    align-items: center;
  }
  span {
    margin-bottom: 10px;
  }
`

const ProfileBtnContainer = styled.div`
  display: flex;
  width: calc(100% - 20px);
  margin: 10px;
  justify-content: end;
  button {
    margin-left: 10px;
  }
`

const PostContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid black;
  width: 100%;
`

const PostBtnContainer = styled.div`
  display: flex;
  margin: 10px;
  justify-content: space-evenly;
  width: 100%;
`

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;

  div {
    width: 80px;
    height: 80px;
    margin: 10px;
    border: 1px solid green;
  }
`
