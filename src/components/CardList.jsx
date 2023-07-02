import { styled } from 'styled-components'
import { useEffect } from 'react'

import CardItem from './CardItem'

function CardList({ posts }) {
  return (
    <StPostList>
      {posts.map((post) => {
        return <CardItem key={`cardKey__${post.postId}`} post={post} />
      })}
    </StPostList>
  )
}

export default CardList

// style components
const StPostList = styled.div`
  display: inline-block;
  width: 100%;
  text-align: left;
`
