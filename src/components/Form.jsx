import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

function Form() {
  const [place, setPlace] = useState('')
  const [date, setDate] = useState('')
  const [group, setGroup] = useState('')
  const [review, setReview] = useState('')

  const dispatch = useDispatch()

  return (
    <div>
      CardList
      <form
        onSubmit={(e) => {
          if (!place || !date || !group || !review) {
            alert('필수값이 누락되었습니다. 빈칸을 모두 채워주세요.')
            return false
          }

          e.preventDefault() // **삭제

          dispatch({
            type: 'ADD_POST',
            payload: {
              id: 123,
              place: place,
              date: date,
              group: group,
              review: review,
              isLiked: false,
            },
          })

          setPlace('') // **삭제
          setDate('') // **삭제
          setGroup('') // **삭제
          setReview('') // **삭제
        }}
      >
        <div>
          <input
            placeholder='어디로'
            type='text'
            name='place'
            value={place}
            onChange={(event) => {
              setPlace(event.target.value)
            }}
          />
          <input
            placeholder='언제'
            type='text'
            name='date'
            value={date}
            onChange={(event) => {
              setDate(event.target.value)
            }}
          />
          <input
            placeholder='누구와'
            type='text'
            name='group'
            value={group}
            onChange={(event) => {
              setGroup(event.target.value)
            }}
          />
          <input
            placeholder='나의 후기'
            type='text'
            name='review'
            value={review}
            onChange={(event) => {
              setReview(event.target.value)
            }}
          />
        </div>
        <button>저장</button>
      </form>
    </div>
  )
}

export default Form
