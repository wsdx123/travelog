
import { useQuery } from 'hooks';
import { getPostByPostId,  } from '../fb/db';
import React, { useCallback, useEffect, useState } from 'react'
import { redirect } from 'react-router-dom'
import PostForm from 'components/PostForm';

function PostPage() {
  const [post, setPost] = useState(null)
  const location = useQuery()
  const action = location.get('action')
  const postId = location.get('postId')
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
      <PostForm />
    </div>
  ) 
  else if (action === 'edit' && post)
  return (
    <div>
      <PostForm 
        isEdit
        postData={post} 
      />
    </div>
  ) 
}

export default PostPage
