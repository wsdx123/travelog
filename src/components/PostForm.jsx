import { FloppyDisk, TrashSimple } from "@phosphor-icons/react"
import { createPost, deletePost, updatePost } from "fb/db"
import { deleteImage, uploadImages } from "fb/storage"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { styled } from "styled-components"
import { v4 } from 'uuid'
import Button from "./Button"
import TextArea from "./TextArea"
import SelectItem from "./SelectItem"
import Select from "./Select"
import InputText from "./InputText"
import UploadFileArea from "./UploadFileArea"
export default function PostForm({ isEdit, postData }) {
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

  const handleChangePeriod = (value) => {
    setPeriod(value)
  }

  const handleChangePartner = (value) => {
    setPartner(value)
  }

  const handleChangeContent = (value) => {
    setContent(value)
  }

  const handleCreatePost = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    try {
      const postId = v4()
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
      if (isResetImage || imageFiles) await deleteImage(postData.postId)

      const imageUrl = isResetImage ? '' : imageFiles ? await uploadImages(postData.postId, imageFiles) : postData.imageUrl

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

  return (
    <>
      <form onSubmit={isEdit ? handleUpdatePost : handleCreatePost}>
        <FormInner>
          <UploadFileArea
            resetImage={setResetImage}
            initialImageUrl={isEdit ? postData?.imageUrl : ''}
            onChange={setImageFile}
          />
          <FormMenu>
            <FormRow>
              <label htmlFor='travel_destination'>여행지: </label>
              <InputText
                name='travel_destination'
                id='travel_destination'
                placeholder='여행지'
                onChange={handleChangeDestination}
                value={destination}
              />
            </FormRow>
            <FormRow>
            <label htmlFor='travel_period'>여행 시기: </label>
              <Select
                name='travel_period'
                title='여행 시기'
                placeholder='여행 시기'
                onChange={handleChangePeriod}
                defaultValue={period}
              >
                <SelectItem value='spring'>봄</SelectItem>
                <SelectItem value='summer'>여름</SelectItem>
                <SelectItem value='fall'>가을</SelectItem>
                <SelectItem value='winter'>겨울</SelectItem>
              </Select>
            </FormRow>
            <FormRow>
            <label htmlFor='travel_partner'>여행 구성원: </label>
              <Select
                name='travel_partner'
                title='함께 여행한 사람'
                placeholder='함께 여행한 사람'
                onChange={handleChangePartner}
                defaultValue={partner}
              >
                <SelectItem value='family'>가족</SelectItem>
                <SelectItem value='couple'>커플</SelectItem>
                <SelectItem value='friend'>친구</SelectItem>
                <SelectItem value='alone'>혼자</SelectItem>
                <SelectItem value='etc'>기타</SelectItem>
              </Select>
            </FormRow>
            <FormRow>
              <TextArea
                placeholder='나의 후기를 작성해봅시다.'
                value={content}
                onChange={handleChangeContent}
              />
            </FormRow>
            <FormRow>
              <Button onClick={handleCancel} variant='outlined'>
                취소
              </Button>
              {isEdit && 
              <Button 
                variant='outlined' 
                onClick={handleDeletePost} 
                icon={<TrashSimple size={20} />}
              >
                글 삭제
              </Button>
              }
              <Button 
                type="submit" 
                icon={<FloppyDisk size={20} />}
              >
                {isEdit ? '글 수정' : '글 쓰기'}
              </Button>
            </FormRow>
          </FormMenu>
        </FormInner>
      </form>
    </>
  )
}

const FormMenu = styled.div`
  gap: 10px;
  display: flex;
  flex-direction: column;
`

const FormRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
`

const FormInner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`