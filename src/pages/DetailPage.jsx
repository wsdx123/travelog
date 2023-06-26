import { deletePost, getPostByPostId } from 'fb/db';
import React, { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';

function DetailPage() {
  const [post,setPost] = useState(null);
  const { postId } =useParams()
  const navigate = useNavigate();

  const loadPost = useCallback(async () => {
    try{
      const postData = await getPostByPostId(postId)
      console.log(postData)
      if(!postData) {
        console.log('redirect')
        navigate('/')
      }
      setPost(postData)
    } catch(error) {
      console.error(error)
      navigate('/')
    }
  },[postId,navigate])

  const handleDeletePost = async () => {
    try{
      const response = await deletePost(post.id)
      console.log(response)
    } catch(error) {
      console.error(error)
    }
  }

  useEffect(() => {
    loadPost()
  },[loadPost])

  if(!post) return <div>Loadng...</div>
  else return (<div>
    <img width={400} height={400} src={post.imageUrl}/>
    {post.content} 
    <Link to={`/postPage?action=edit&postId=${postId}`}>수정</Link>
    <button onClick={handleDeletePost}>삭제</button>
    </div>)
}

export default DetailPage
