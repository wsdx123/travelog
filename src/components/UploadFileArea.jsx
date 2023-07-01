import { isFileSizeOver, sliceFilesMax } from "common"
import { memo, useMemo, useRef, useState } from "react"
import { styled } from "styled-components"
import Button from "./Button"
import { Image } from "@phosphor-icons/react"

function UploadFileArea({ initialImageUrl, onChange, resetImage }) {
  const [imageFiles, setImageFiles] = useState(null)
  const [imageUrl, setImageUrl] = useState(initialImageUrl || null)
  const inputRef = useRef()

  const handleDragOver = (event) => {
    event.preventDefault()
  }


  const handleDrop = (event) => {
    event.preventDefault()

    const files = sliceFilesMax(event.dataTransfer.files)
    setImage(files)
  }

  const handleUploadInput = (event) => {
    const files = sliceFilesMax(event.target.files)
    setImage(files)
  }

  const setImage = (files) => {
    for (let i = 0; i < files.length; i++) {
      if (isFileSizeOver(files[i].size)) return alert('5MB 이하의 이미지를 선택해주세요.')
    }
    console.dir(files)
    resetImage(false)
    setImageFiles(files)
    onChange(files)
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

  const imageFileList = useMemo(()=>{
      const imagePreviewArray = [];
      if(imageFiles) {
        for(let i = 0; i < imageFiles.length; i++) {
          imagePreviewArray.push(<ImagePreview key={i} width={100} height={100} alt={imageFiles.item(i).name} src={URL.createObjectURL(imageFiles.item(i))}/>)
        }
      } else if (imageUrl) {
        for(let i = 0; i < imageUrl.length; i++) {
          imagePreviewArray.push(<ImagePreview key={i} width={100} height={100} alt='image' src={imageUrl[i]}/>)
        }
      }
      return imagePreviewArray
    },[imageFiles,imageUrl])
    
  return (
    <Container>
      <UploadZone onDragOver={handleDragOver} onDrop={handleDrop}>
        <input
          type='file'
          accept='image/*'
          onChange={handleUploadInput}
          multiple
          hidden
          ref={inputRef}
        />
        {imageFileList.length > 0 || imageUrl 
          ? <ImagePreviewContainer>{imageFileList}</ImagePreviewContainer> 
          : <Button 
              style={{position:'absolute'}} 
              onClick={() => inputRef.current.click()}
              icon={<Image size={20} />}
            >
              이미지 선택
            </Button>
        }
      </UploadZone>
      <ButtonContainer>
        <Button variant='outlined' onClick={handleUseExistImage}>원래대로</Button>
        <Button variant='outlined' onClick={handleResetImage}>삭제</Button>
      </ButtonContainer>
    </Container>)
}

export default memo(UploadFileArea)

const UploadZone = styled.div`
  width: 400px;
  height: 400px;
  border: 2px dashed #0099ff;
  border-radius: 20px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ImagePreviewContainer = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3,1fr);
  align-items: center;
  justify-items: center;
`

const ImagePreview = styled.img`
  background-color: #0099ff2b;
  border-radius: 20px;
  display: inline-block;
  object-fit: contain;
  -webkit-user-drag: none;
  -moz-user-drag: none;
  -ms-user-drag: none;

`

const ButtonContainer = styled.div`
  gap: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Container = styled.div`
  gap: 20px;
  display: flex;
  flex-direction: column;
`