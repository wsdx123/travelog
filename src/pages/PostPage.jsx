import { useQuery } from 'hooks'
import { createPost, getPostByPostId, updatePost } from '../fb/db'
import React, { useCallback, useEffect, useState } from 'react'
import { redirect, useNavigate } from 'react-router-dom'
import PostForm from 'components/PostForm'
import { v4 } from 'uuid'
import { deleteImagesByPostId, uploadImage } from 'fb/storage'
import ProgressBar from 'components/ProgressBar'

import { auth, db } from 'firebase.js'
import { doc, setDoc } from 'firebase/firestore'

function PostPage() {
  const [isLoaded, setLoaded] = useState(false)
  const [post, setPost] = useState(null)
  const location = useQuery()
  const action = location.get('action')
  const postId = location.get('postId')

  const navigate = useNavigate()

  const [isPosting, setIsPosting] = useState(false)
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

    const uid = auth.currentUser.uid

    try {
      const postId = v4()
      setProgressTitle('글 저장 시작')
      setIsPosting(true)
      const imageUrl = imageFiles ? await uploadImages(postId, imageFiles) : ''

      setProgressTitle('글 저장 중')

      const newPost = {
        postId,
        destination,
        period,
        partner,
        content,
        imageUrl,
        locationData,
        uid,
        comments: [],
      }
      await createPost(newPost)
      await setDoc(doc(db, 'likes', postId), {
        likedList: [],
      })
      setProgressTitle('글 저장 완료')
      navigate(`/`)
    } catch (error) {
      console.error(error)
    }
  }

  const handleUpdatePost = async (postData) => {
    setProgressTitle('업데이트 시작')
    setIsPosting(true)
    const { isResetImage, postId, imageFiles, destination, period, partner, content } = postData
    try {
      if (isResetImage || imageFiles) {
        setProgressTitle('기존 이미지 삭제 중')
        await deleteImagesByPostId(postId)
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
      if (!postData || auth.currentUser.uid !== postData?.uid) redirect('/')
      else {
        setPost(postData)
      }
    } catch (error) {
      console.error(error)
    }
  }, [postId])

  useEffect(() => {
    if (!auth.currentUser?.uid) redirect('/')
    if (postId) {
      loadPost().then(() => setLoaded(true))
    } else setLoaded(true)
  }, [postId, loadPost])

  if (!isLoaded) return null
  return (
    <div>
      <PostForm
        onSubmit={action === 'write' ? handleCreatePost : handleUpdatePost}
        isEdit={action === 'edit'}
        postData={post}
      />
      <ProgressBar value={progress} title={progressTitle} open={isPosting} />
    </div>
  )
}

export default PostPage
