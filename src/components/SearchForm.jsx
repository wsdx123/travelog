import { useState } from 'react'

import SelectItem from './SelectItem'
import Select from './Select'

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

  const handleChangePeriod = (period) => {
    setSearh((prev) => ({ ...prev, period }))
  }

  const handleChangePartner = (partner) => {
    setSearh((prev) => ({ ...prev, partner }))
  }

  const handleSearch = async () => {
    await filterData(search.partner, search.period)
  }

  // style components
  const StSearchSection = {
    width: '100%',
    textAlign: 'center',
    margin: '0 auto',
    marginTop: '20px', //layout fixed 후
    marginBottom: '20px',
  }

  return (
    <div style={{ ...StSearchSection }}>
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
      <button style={{ marginLeft: '15px', padding: '5px' }} onClick={handleSearch}>
        SEARCH
      </button>
    </div>
  )
}

export default SearchForm
