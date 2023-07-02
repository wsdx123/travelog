import { useCallback, useEffect, useState } from 'react'
import { doc, setDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { v4 } from 'uuid'

import { createPost, getPostByPostId, updatePost } from 'fb/db'
import { deleteImagesByPostId, uploadImage } from 'fb/storage'
import ProgressBar from 'components/ProgressBar'
import PostForm from 'components/PostForm'
import { auth, db } from 'firebase.js'
import { useQuery } from 'hooks'

function PostPage() {
  const [progressTitle, setProgressTitle] = useState('')
  const [isPosting, setIsPosting] = useState(false)
  const [isLoaded, setLoaded] = useState(false)
  const [progress, setProgress] = useState(0)
  const [post, setPost] = useState(null)

  const location = useQuery()
  const action = location.get('action')
  const postId = location.get('postId')

  const navigate = useNavigate()

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
      navigate(`/postPage/${postId}`)
    } catch (error) {
      console.error(error)
    }
  }

  const loadPost = useCallback(async () => {
    try {
      const postData = await getPostByPostId(postId)
      if (!postData || auth.currentUser.uid !== postData?.uid) navigate('/')
      else {
        setPost(postData)
      }
    } catch (error) {
      console.error(error)
    }
  }, [navigate, postId])

  useEffect(() => {
    if (!auth.currentUser?.uid) navigate('/')
    if (postId) {
      loadPost().then(() => setLoaded(true))
    } else setLoaded(true)
  }, [postId, loadPost, navigate])

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
