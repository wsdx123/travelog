import { useQuery } from 'hooks'
import { createPost, deletePost, getPostByPostId, updatePost } from '../fb/db'
import { deleteImage, uploadImage, uploadImages } from '../fb/storage'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { redirect, useNavigate } from 'react-router-dom'
import { styled } from 'styled-components'
import { v4 as uuidv4 } from 'uuid'

const KB = 1024
const MB = 1024 ** 2

export const convertBytesToString = (bytes) => {
  const size_KB = bytes / KB
  const size_MB = bytes / MB

  if (size_MB > 1) return Math.ceil(size_MB * 100) / 100 + 'MB'
  return Math.ceil(size_KB) + 'KB'
}

function PostPage() {
  const [post, setPost] = useState(null)
  const location = useQuery()
  const action = location.get('action')
  const postId = location.get('postId')
  const loadPost = useCallback(async () => {
    try {
      const postData = await getPostByPostId(postId)
      if (postData) setPost(postData)
    } catch (error) {
      console.error(error)
    }
  }, [postId])

  useEffect(() => {
    if (postId) loadPost()
  }, [postId, loadPost])

  if (action === 'write')
    return (
      <div>
        <PostForm />
      </div>
    )
  else if (action === 'edit' && post)
    return (
      <div>
        <PostForm isEdit={true} postData={post} />
      </div>
    )
  else redirect('/')
}

const UploadZone = styled.div`
  width: 400px;
  height: 400px;
  border: 2px dashed #0099ff;
  border-radius: 20px;
  position: relative;
`

const ImagePreview = styled.img`
  width: 100%;
  height: 100%;
  display: inline-block;
  object-fit: contain;
`

function UploadFileArea({ initialImageUrl, onChange, resetImage }) {
  const [imageFiles, setImageFiles] = useState(null)
  const [imageUrl, setImageUrl] = useState(initialImageUrl || null)
  const inputRef = useRef()

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  const handleDrop = (event) => {
    event.preventDefault()
    const fileslength = event.dataTransfer.files.length
    setImage(event.dataTransfer.files.slice(0, Math.min(10, fileslength)))
  }

  const setImage = (files) => {
    for (let i = 0; i < files.length; i++) {
      if (files[i].size > 5_000_000) return alert('5MB 이하의 이미지를 선택해주세요.')
    }
    console.dir(files)
    resetImage(false)
    setImageFiles(files)
    onChange(files)
    // setImageUrl(URL.createObjectURL(files[0]))
  }

  const handleResetImage = () => {
    resetImage(true)
    setImageFiles(null)
    setImageUrl(null)
    onChange(null)
  }

  const handleUseExistImage = () => {
    setImageFiles(null)
    resetImage(false)
    setImageUrl(initialImageUrl || '')
    onChange(null)
  }

  useEffect(() => {
    if (imageFiles) console.log(imageFiles)
  })

  const imageFileList = []

  if (imageFiles) {
    for (let i = 0; i < imageFiles.length; i++) {
      imageFileList.push(
        <div key={i}>
          <div>
            <img width={100} height={100} alt={imageFiles.item(i).name} src={URL.createObjectURL(imageFiles.item(i))} />
          </div>
          {imageFiles.item(i).name} {convertBytesToString(imageFiles.item(i).size)}{' '}
        </div>
      )
    }
  } else if (initialImageUrl) {
    for (let i = 0; i < initialImageUrl.length; i++) {
      imageFileList.push(
        <div key={i}>
          <div>
            <img width={100} height={100} alt='image' src={initialImageUrl[i]} />
          </div>
        </div>
      )
    }
  }
  console.log(imageFileList)
  return (
    <>
      <UploadZone onDragOver={handleDragOver} onDrop={handleDrop}>
        <input
          type='file'
          accept='image/*'
          onChange={(event) => setImage(event.target.files)}
          multiple
          hidden
          ref={inputRef}
        />

        {imageUrl ? <ImagePreview width={400} height={400} src={imageUrl} alt={'post image'} /> : 'drag and drop'}
      </UploadZone>
      <div>
        <button type='button' onClick={() => inputRef.current.click()}>
          이미지 선택
        </button>
        <button type='button' onClick={handleUseExistImage}>
          원래대로
        </button>
        <button type='button' onClick={handleResetImage}>
          삭제
        </button>
      </div>
      {imageFileList.length > 0 || initialImageUrl ? imageFileList : null}
    </>
  )
}

function PostForm({ isEdit, postData }) {
  const [imageFiles, setImageFile] = useState(null)
  const [destination, setDestination] = useState(isEdit ? postData.destination : '')
  const [period, setPeriod] = useState(isEdit ? postData.period : '')
  const [partner, setPartner] = useState(isEdit ? postData.partner : '')
  const [content, setContent] = useState(isEdit ? postData.content : '')
  const [isResetImage, setResetImage] = useState(false)

  const navigate = useNavigate()

  const handleChangeDestination = (e) => {
    setDestination(e.target.value)
  }

  const handleChangePeriod = (e) => {
    setPeriod(e.target.value)
  }

  const handleChangePartner = (e) => {
    setPartner(e.target.value)
  }

  const handleChangeContent = (e) => {
    setContent(e.target.value)
  }

  const handleCreatePost = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    try {
      const postId = uuidv4()
      const imageUrl = imageFiles ? await uploadImages(postId, imageFiles) : ''
      const newPost = {
        postId,
        destination,
        period,
        partner,
        content,
        imageUrl,
        isLiked: false, // 하트용 Boolean 값 추가
      }
      await createPost(newPost)
      navigate(`/`)
    } catch (error) {
      console.error(error)
    }
  }

  const handleUpdatePost = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    try {
      //  if(isResetImage && postData.imageUrl) deletePostImage(postData.postId)
      if (isResetImage || imageFiles) await deleteImage(postData.postId)
      const imageUrl = isResetImage
        ? ''
        : imageFiles
        ? await uploadImage(postData.postId, imageFiles)
        : postData.imageUrl

      const updatedPost = {}
      if (destination !== postData.destination) updatedPost['destination'] = destination
      if (period !== postData.period) updatedPost['period'] = period
      if (partner !== postData.partner) updatedPost['partner'] = partner
      if (content !== postData.content) updatedPost['content'] = content
      if (imageUrl !== postData.imageUrl) updatedPost['imageUrl'] = imageUrl
      await updatePost(postData.id, updatedPost)
      navigate(`/post/${postData.postId}`)
    } catch (error) {
      console.error(error)
    }
  }

  const handleCancel = () => {
    navigate(-1)
  }

  const validateForm = () => {
    if (!destination.trim()) {
      alert('여행지를 입력해 주세요')
      return false
    }
    if (!period.trim()) {
      alert('여행 시기를 선택해 주세요')
      return false
    }
    if (!partner.trim()) {
      alert('여행 파트너를 선택해 주세요')
      return false
    }
    return true
  }

  const handleDeletePost = async () => {
    try {
      await deletePost(postData.id)
      await deleteImage(postData.postId)
      navigate('/')
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    console.log(
      `resetImage: ${isResetImage} image: ${imageFiles} / destination: ${destination} / period: ${period} / partner: ${partner} / content: ${content}`
    )
  }, [isResetImage, imageFiles, destination, period, partner, content])

  return (
    <>
      <form onSubmit={isEdit ? handleUpdatePost : handleCreatePost}>
        <div>
          <UploadFileArea
            resetImage={setResetImage}
            initialImageUrl={isEdit ? postData?.imageUrl : ''}
            onChange={setImageFile}
          />
        </div>
        <div>
          <label htmlFor='travel_destination'>여행지를 입력해주세요 </label>
          <input
            type='text'
            name='travel_destination'
            id='travel_destination'
            placeholder='여행지'
            onChange={handleChangeDestination}
            value={destination}
          />
        </div>
        <div>
          <label htmlFor='period-select'>언제 여행을 다녀 왔나요?</label>
          <select name='periods' id='period-select' onChange={handleChangePeriod} defaultValue={period}>
            <option value=''>여행 시기</option>
            <option value='spring'>봄</option>
            <option value='summer'>여름</option>
            <option value='fall'>가을</option>
            <option value='winter'>겨울</option>
          </select>
        </div>
        <div>
          <label htmlFor='partner-select'>누구와 함께 여행을 갔나요?</label>
          <select name='partners' id='partner-select' onChange={handleChangePartner} defaultValue={partner}>
            <option value=''>함께간 사람</option>
            <option value='family'>가족</option>
            <option value='couple'>커플</option>
            <option value='friend'>친구</option>
            <option value='alone'>혼자</option>
            <option value='etc'>기타</option>
          </select>
        </div>
        <div>
          <label htmlFor='content'>나의 여행 후기</label>
          <textarea
            type='text'
            placeholder='나의 후기를 작성해봅시다.'
            value={content}
            onChange={handleChangeContent}
          ></textarea>
        </div>
        <button type='button' onClick={handleCancel}>
          취소
        </button>
        <button>{isEdit ? '글 수정하기' : '글 저장하기'}</button>
        <button type='button' onClick={handleDeletePost}>
          삭제
        </button>
      </form>
    </>
  )
}

export default PostPage
