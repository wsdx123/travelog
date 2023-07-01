import * as S from 'components/MyPage.styled.js'

function UpdateProfile({
  handleInput,
  handleImgSelect,
  handleDeleteImage,
  userInfo,
  preview,
  setUserUpdate,
  handleUpload,
}) {
  return (
    <S.ProfileContainer>
      <S.ProfilePicContainer>
        {preview ? (
          <img src={preview} width={300} height={300} alt='profileImg' />
        ) : (
          <input type='file' onChange={handleImgSelect} />
        )}
      </S.ProfilePicContainer>
      <button type='button' onClick={handleDeleteImage}>
        이미지 삭제
      </button>
      <S.ProfileInfoContainer>
        <div>
          <label>이름</label>
          <input placeholder='user.id' name='name' onChange={handleInput} value={userInfo.name} />
        </div>
        <div>
          <label>자기소개</label>
          <input placeholder='자기소개' name='intro' onChange={handleInput} value={userInfo.intro} />
        </div>
        <div>
          <label>가본 여행지</label>
          <input placeholder='가본 여행지' name='places' onChange={handleInput} value={userInfo.places} />
        </div>
      </S.ProfileInfoContainer>
      <S.ProfileBtnContainer>
        <button type='button' onClick={() => setUserUpdate(false)}>
          취소
        </button>
        <button type='button' onClick={handleUpload}>
          저장
        </button>
      </S.ProfileBtnContainer>
    </S.ProfileContainer>
  )
}

export default UpdateProfile
