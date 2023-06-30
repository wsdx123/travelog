
import { useQuery } from 'hooks';
import { createPost, getPostByPostId, updatePost,  } from '../fb/db';
import React, { useCallback, useEffect, useState } from 'react'
import { redirect, useNavigate } from 'react-router-dom'
import PostForm from 'components/PostForm';
import { v4 } from 'uuid'
import { deleteImage, uploadImage, uploadImages } from 'fb/storage';

function PostPage() {
  const [post, setPost] = useState(null)
  const location = useQuery()
  const action = location.get('action')
  const postId = location.get('postId')
  const navigate = useNavigate()
  const [process,setProcess] = useState(null)

  useEffect(() => {
    console.log(process)
  },[process])

  const uploadImages = async (postId, files) => {
    const downloadUrls = []
    setProcess(new Array(files.length).fill(0))
    for (let i = 0; i < files.length; i++) {
      const url = await uploadImage(postId, files[i], (progress)=>
      setProcess((prev)=>{
        const newState = [...prev]
        newState[i] = progress
        return newState
      }))
      downloadUrls.push(url)
    }
    console.log(downloadUrls)
    return downloadUrls
  }
  
  const handleCreatePost = async (postData) => {
    const { imageFiles, destination, period, partner, content, locationData} = postData
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
        locationData,
        isLiked: false, // 하트용 Boolean 값 추가
      }
      await createPost(newPost)
      navigate(`/`)
    } catch (error) {
      console.error(error)
    }
  }

  const handleUpdatePost = async (postData) => {
    setProcess('업데이트중')
    const { isResetImage, postId, imageFiles, destination, period, partner, content } = postData
    try {
      if (isResetImage || imageFiles) await deleteImage(postId)

      const imageUrl = isResetImage ? '' : imageFiles ? await uploadImages(postId, imageFiles) : post.imageUrl

      const updatedPost = {}
      if (destination !== post.destination) updatedPost['destination'] = destination
      if (period !== post.period) updatedPost['period'] = period
      if (partner !== post.partner) updatedPost['partner'] = partner
      if (content !== post.content) updatedPost['content'] = content
      if (imageUrl !== post.imageUrl) updatedPost['imageUrl'] = imageUrl
      await updatePost(post.id, updatedPost)
      setProcess('업데이트완료')
      //navigate(`/post/${postId}`)
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
      <PostForm  onSubmit={handleCreatePost}/>
      <div>{process && process.map((x)=><span>{x}</span>)}</div>
    </div>
  ) 
  else if (action === 'edit' && post)
  return (
    <div>
      <PostForm
        onSubmit={handleUpdatePost}
        isEdit
        postData={post} 
      />
      <div>{process !== null && process.map((x)=><li>{x}</li>)}</div>
    </div>
  ) 
}

export default PostPage
