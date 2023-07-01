import { useNavigate } from 'react-router-dom'
import * as S from 'components/MyPage.styled.js'

function PostCards({ data }) {
  const navigate = useNavigate()
  const navigateDetail = () => {
    navigate(`/postPage/${data.postId}`)
  }
  // console.log(data)
  return <S.CardItem onClick={navigateDetail}>{data.destination}</S.CardItem>
}

export default PostCards
