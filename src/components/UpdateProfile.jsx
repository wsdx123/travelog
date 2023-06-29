import * as P from 'components/profile.styled.js'

function UpdateProfile({
  handleInput,
  handleImgSelect,
  handlePreview,
  userName,
  userIntro,
  userPlaces,
  preview,
  setUserUpdate,
  handleUpload,
}) {
  return (
    <P.ProfileContainer>
      <P.ProfilePicContainer>
        {preview ? (
          <img src={preview} width={300} height={300} alt='profileImg' />
        ) : (
          <input type='file' onChange={handleImgSelect} />
        )}
      </P.ProfilePicContainer>
      <button type='button' onClick={handlePreview}>
        이미지 삭제
      </button>
      <P.ProfileInfoContainer>
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
      </P.ProfileInfoContainer>
      <P.ProfileBtnContainer>
        <button type='button' onClick={() => setUserUpdate(false)}>
          취소
        </button>
        <button type='button' onClick={handleUpload}>
          저장
        </button>
      </P.ProfileBtnContainer>
    </P.ProfileContainer>
  )
}

export default UpdateProfile
