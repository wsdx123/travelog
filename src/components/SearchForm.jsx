import React, { useEffect, useState } from 'react'
import Select from './Select'
import SelectItem from './SelectItem'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { useDispatch, useSelector } from 'react-redux'
import { filterPosts, resetState } from 'redux/modules/post'
import { db } from 'firebase.js'

const SEASON = [
  { value: 'all', text: '전체' },
  { value: 'spring', text: '봄' },
  { value: 'summer', text: '여름' },
  { value: 'fall', text: '가을' },
  { value: 'winter', text: '겨울' },
]
const TRAVEL_WITH = [
  { value: 'all', text: '전체' },
  { value: 'family', text: '가족' },
  { value: 'couple', text: '커플' },
  { value: 'friend', text: '친구' },
  { value: 'alone', text: '혼자' },
  { value: 'etc', text: '기타' },
]

const SearchForm = ({ filterData }) => {
  const [search, setSearh] = useState({
    period: SEASON[0].value,
    partner: TRAVEL_WITH[0].value,
  })
  const [posts, setPosts] = useState([])
  const data = useSelector((state) => state.posts)
  const dispatch = useDispatch()

  console.log(data)

  const handleChangePeriod = (period) => {
    setSearh((prev) => ({ ...prev, period }))
  }

  const handleChangePartner = (partner) => {
    setSearh((prev) => ({ ...prev, partner }))
  }

  const handleSearch = async () => {
    // if (search.period === 'all') {
    //   const tmp = data.filter((el) => el.partner === search.partner)
    // } else if (search.partner === 'all') {
    //   const tmp = data.filter((el) => el.period === search.period)
    // } else if (search.partner === 'all' && search.period === 'all') {
    //   const tmp = data
    // } else {
    //   const tmp = data.filter((el) => el.period === search.period && el.partner === search.partner)
    // }
    await filterData(search.partner, search.period)

    // dispatch(resetState())
    // dispatch(filterPosts({ partner: search.partner, period: search.period }))
    // console.log(tmp)
  }
  console.log(posts)

  // style components
  const StSearchSection = {
    width: '100%',
    textAlign: 'center',
    margin: '0 auto',
    marginTop: '20px',
    marginBottom: '20px',
  }

  return (
    <div style={{ ...StSearchSection }}>
      {/* <input type='text' autofocus='autofocus' /> */}
      <Select
        name='travel_period'
        title='여행 시기'
        placeholder='여행 시기'
        onChange={handleChangePeriod}
        defaultValue={search.period}
      >
        {SEASON.map((el) => (
          <SelectItem key={`selectSeasonKey__${el.value}`} value={el.value}>
            {el.text}
          </SelectItem>
        ))}
      </Select>
      <Select
        name='travel_partner'
        title='함께 여행한 사람'
        placeholder='함께 여행한 사람'
        onChange={handleChangePartner}
        defaultValue={search.partner}
      >
        {TRAVEL_WITH.map((el) => (
          <SelectItem key={`selectPartnerKey__${el.value}`} value={el.value}>
            {el.text}
          </SelectItem>
        ))}
      </Select>
      <button onClick={handleSearch}>SEARCH</button>
    </div>
  )
}

export default SearchForm
