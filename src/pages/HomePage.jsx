import { collection, getDocs, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'

import SearchForm from 'components/SearchForm'
import CardList from 'components/CardList'
import { getPostsAll } from 'fb/db'
import { db } from 'firebase.js'

function HomePage() {
  const [posts, setPosts] = useState([])

  const filterData = async (partner, period) => {
    let q
    if (partner === 'all' && period === 'all') {
      q = query(collection(db, 'posts'))
    } else if (partner === 'all') {
      q = query(collection(db, 'posts'), where('period', '==', period))
    } else if (period === 'all') {
      q = query(collection(db, 'posts'), where('partner', '==', partner))
    } else {
      q = query(collection(db, 'posts'), where('partner', '==', partner), where('period', '==', period))
    }
    const snapshot = await getDocs(q)
    const filteredData = []
    snapshot.forEach((doc) => {
      filteredData.push({ id: doc.id, ...doc.data() })
    })
    setPosts(filteredData)
  }

  useEffect(() => {
    getPostsAll().then((postsArray) => {
      setPosts([...postsArray])
    })
  }, [])

  return (
    <div>
      <SearchForm filterData={filterData} />
      <CardList posts={posts} />
    </div>
  )
}

export default HomePage
