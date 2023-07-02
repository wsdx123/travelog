import { FloppyDisk, TrashSimple } from '@phosphor-icons/react'
import { useState, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { styled } from 'styled-components'
import Button from './Button'
import TextArea from './TextArea'
import SelectItem from './SelectItem'
import Select from './Select'
import InputText from './InputText'
import UploadFileArea from './UploadFileArea'
import Modal from './Modal'
import { KakaoMap } from './KakaoMap'
import { deletePostWithData } from '../fb/db'
function PostForm({ onSubmit, isEdit, postData: initialPostData }) {
  const [postData, setPostData] = useState({
    destination: '',
    period: '',
    partner: '',
    content: '',
    ...initialPostData,
  })
  const [locationData, setLocationData] = useState({
    name: initialPostData?.locationData.name || '',
    longitude: initialPostData?.locationData.longitude || 0,
    latitude: initialPostData?.locationData.latitude || 0,
  })
  const [imageFiles, setImageFile] = useState(null)
  const [isResetImage, setResetImage] = useState(false)
  const [isOpenLocationModal, setOpenLocationModal] = useState(false)

  const navigate = useNavigate()

  const handleChangeDestination = (destination) => {
    setPostData((prev) => ({ ...prev, destination }))
  }

  const handleChangePeriod = (period) => {
    setPostData((prev) => ({ ...prev, period }))
  }

  const handleChangePartner = (partner) => {
    setPostData((prev) => ({ ...prev, partner }))
  }

  const handleChangeContent = (content) => {
    setPostData((prev) => ({ ...prev, content }))
  }

  const handleDeleteLocation = () => {
    setLocationData({ name: '', longitude: 0, latitude: 0 })
  }

  const handleCancel = () => {
    navigate(-1)
  }

  const validateForm = () => {
    if (!postData.destination.trim()) {
      alert('여행지를 입력해 주세요')
      return false
    }
    if (!postData.period.trim()) {
      alert('여행 시기를 선택해 주세요')
      return false
    }
    if (!postData.partner.trim()) {
      alert('여행 파트너를 선택해 주세요')
      return false
    }
    return true
  }

  const handleDeletePost = async () => {
    try {
      await deletePostWithData(postData.postId)
      navigate('/')
    } catch (error) {
      console.error(error)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm)
      onSubmit({
        ...postData,
        imageFiles,
        isResetImage,
        locationData,
      })
  }

  return (
    <Container>
      <form onSubmit={handleSubmit}>
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
                placeholder='여행지'
                onChange={handleChangeDestination}
                value={postData.destination}
              />
            </FormRow>
            <FormRow>
              <label name='travel_location'>위치: </label>
              <LocationContainer>{locationData?.name}</LocationContainer>
              {!isEdit &&
                (locationData.name ? (
                  <Button onClick={handleDeleteLocation} variant='outlined'>
                    삭제
                  </Button>
                ) : (
                  <Button onClick={() => setOpenLocationModal(true)}>위치 찾기</Button>
                ))}
            </FormRow>
            <FormRow>
              <label htmlFor='travel_period'>여행 시기: </label>
              <Select
                name='travel_period'
                title='여행 시기'
                placeholder='여행 시기'
                onChange={handleChangePeriod}
                defaultValue={postData.period}
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
                defaultValue={postData.partner}
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
                value={postData.content}
                onChange={handleChangeContent}
              />
            </FormRow>
            <FormRow>
              <Button onClick={handleCancel} variant='outlined'>
                취소
              </Button>
              {isEdit && (
                <Button variant='outlined' onClick={handleDeletePost} icon={<TrashSimple size={20} />}>
                  글 삭제
                </Button>
              )}
              <Button type='submit' icon={<FloppyDisk size={20} />}>
                {isEdit ? '글 수정' : '글 쓰기'}
              </Button>
            </FormRow>
          </FormMenu>
        </FormInner>
      </form>
      {isOpenLocationModal && (
        <Modal title='위치 선택' closeFunc={() => setOpenLocationModal(false)}>
          <KakaoMap onChange={setLocationData} />
        </Modal>
      )}
    </Container>
  )
}

export default memo(PostForm)

const FormMenu = styled.div`
  gap: 14px;
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

const LocationContainer = styled.div`
  word-break: keep-all;
  max-width: 200px;
`
const Container = styled.div`
  height: calc(100vh - 140px);
`
