import React from 'react'

const SearchForm = () => {
  // style components
  const StSearchSection = {
    width: '100%',
    textAlign: 'center',
    margin: '0 auto',
    marginTop: '20px',
    marginBottom: '20px',
  }

  const StMainSearch = {
    width: '40%',
    height: '25px',
    borderRadius: '15px',
    border: '1px solid #050505',
    background: '#050505',
    color: 'white',
  }

  return (
    <div style={{ ...StSearchSection }}>
      <input style={{ ...StMainSearch }} type='text' autofocus='autofocus' />
      <button>SEARCH</button>
    </div>
  )
}

export default SearchForm
