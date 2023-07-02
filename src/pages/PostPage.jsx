import { useQuery } from 'hooks'
import { createPost, getPostByPostId, updatePost } from '../fb/db'
import React, { useCallback, useEffect, useState } from 'react'
import { redirect, useNavigate } from 'react-router-dom'
import PostForm from 'components/PostForm'
import { v4 } from 'uuid'
import { deleteImage, uploadImage } from 'fb/storage'
import ProgressBar from 'components/ProgressBar'
import { auth } from 'firebase.js'

function PostPage() {
  const [post, setPost] = useState(null)
  const location = useQuery()
  const action = location.get('action')
  const postId = location.get('postId')

  const navigate = useNavigate()
  const [isOpen, setOpen] = useState(false)
  const [progressTitle, setProgressTitle] = useState('')
  const [progress, setProgress] = useState(0)

  const uploadImages = async (postId, files) => {
    setProgressTitle('이미지 업로드 시작')
    const downloadUrls = []
    for (let i = 0; i < files.length; i++) {
      setProgressTitle(`${i + 1} / ${files.length} 업로드 중`)
      setProgress(0)
      const url = await uploadImage(postId, files[i], setProgress)
      downloadUrls.push(url)
    }
    setProgressTitle('이미지 업로드 완료')
    return downloadUrls
  }

  const handleCreatePost = async (postData) => {
    const { imageFiles, destination, period, partner, content, locationData } = postData

    try {
      const postId = v4()
      setProgressTitle('글 저장 시작')
      setOpen(true)
      const imageUrl = imageFiles ? await uploadImages(postId, imageFiles) : ''

      setProgressTitle('글 저장 중')
      const uid = auth.currentUser.uid

      const newPost = {
        postId,
        destination,
        period,
        partner,
        content,
        imageUrl,
        locationData,
        uid,
        isLiked: false, // 하트용 Boolean 값 추가
      }
      await createPost(newPost)
      setProgressTitle('글 저장 완료')
      navigate(`/`)
    } catch (error) {
      console.error(error)
    }
  }

  const handleUpdatePost = async (postData) => {
    setProgressTitle('업데이트 시작')
    setOpen(true)
    const { isResetImage, postId, imageFiles, destination, period, partner, content } = postData
    try {
      if (isResetImage || imageFiles) {
        setProgressTitle('기존 이미지 삭제 중')
        await deleteImage(postId)
      }
      const imageUrl = isResetImage ? '' : imageFiles ? await uploadImages(postId, imageFiles) : post.imageUrl
      setProgressTitle('글 업데이트 중')

      const updatedPost = {}
      if (destination !== post.destination) updatedPost['destination'] = destination
      if (period !== post.period) updatedPost['period'] = period
      if (partner !== post.partner) updatedPost['partner'] = partner
      if (content !== post.content) updatedPost['content'] = content
      if (imageUrl !== post.imageUrl) updatedPost['imageUrl'] = imageUrl
      await updatePost(post.id, updatedPost)
      setProgressTitle('글 업데이트 완료')
      navigate(`/post/${postId}`)
    } catch (error) {
      console.error(error)
    }
  }

  const loadPost = useCallback(async () => {
    try {
      const postData = await getPostByPostId(postId)
      console.log(postData)
      if (postData) setPost(postData)
      else redirect('/')
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
        <PostForm onSubmit={handleCreatePost} />
        {isOpen && <ProgressBar value={progress} title={progressTitle} />}
      </div>
    )
  else if (action === 'edit' && post)
    return (
      <div>
        <PostForm onSubmit={handleUpdatePost} isEdit postData={post} />
        {isOpen && <ProgressBar value={progress} title={progressTitle} />}
      </div>
    )
}

export default PostPage
