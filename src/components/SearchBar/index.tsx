'use client'
import React, {useState} from 'react'
import {Input} from 'antd'
import styled from 'styled-components'

const {Search} = Input

const SearchBar = () => {
  const [search, onSearch] = useState('')
  return (
    <Container>
      <WrapperSearch
        placeholder="search text"
        onSearch={onSearch}
        enterButton
      />
    </Container>
  )
}

const Container = styled('div')`
  display: flex;
  justify-content: center;
  width: 100%;
`

const WrapperSearch = styled(Search)`
  width: 50%;
`

export default SearchBar
