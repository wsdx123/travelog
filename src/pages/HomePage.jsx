import { auth, db } from 'firebase.js'
import React, { useEffect, useState } from 'react'
import CardList from 'components/CardList'

import { onAuthStateChanged } from '@firebase/auth'

import { getPostsAll } from 'fb/db'
import SearchForm from 'components/SearchForm'
import { useDispatch } from 'react-redux'
import { loadPosts } from 'redux/modules/post'
import { and, collection, getDocs, query, where } from 'firebase/firestore'
import { styled } from 'styled-components'

function HomePage() {
  // const dispatch = useDispatch()
  const [posts, setPosts] = useState([])

  // if (search.period === 'all') {
  //   const tmp = data.filter((el) => el.partner === search.partner)
  // } else if (search.partner === 'all') {
  //   const tmp = data.filter((el) => el.period === search.period)
  // } else if (search.partner === 'all' && search.period === 'all') {
  //   const tmp = data
  // } else {
  //   const tmp = data.filter((el) => el.period === search.period && el.partner === search.partner)
  // }

  const filterData = async (partner, period) => {
    // const wherePartner = partner === 'all' ? where('partner', '!=', '') : where('partner', '==', partner)
    // const wherePeriod = partner === 'all' ? where('period', '!=', '') : where('period', '==', period)
    // const q = query(collection(db, 'posts'), and(wherePartner, wherePeriod))
    // const snapshot = await getDocs(q)
    // const tmp = []
    // snapshot.forEach((doc) => {
    //   tmp.push({ id: doc.id, ...doc.data() })
    // })
    // setPosts(tmp)
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
    const tmp = []
    snapshot.forEach((doc) => {
      tmp.push({ id: doc.id, ...doc.data() })
    })
    setPosts(tmp)
  }

  useEffect(() => {
    getPostsAll().then((postsArray) => {
      setPosts([...postsArray])
    })
  }, [])

  return (
    <div>
      {/* <SearchForm /> */}
      <SearchForm filterData={filterData} />
      <CardList posts={posts} />
    </div>
  )
}

export default HomePage
