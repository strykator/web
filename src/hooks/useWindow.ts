import {useEffect, useState} from 'react'

const useWindow = () => {
  const [isBottom, setIsBottom] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const atBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight
      setIsBottom(atBottom)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return {
    isBottom,
    fullHeight: window.innerHeight + document.documentElement.scrollHeight,
  }
}

export default useWindow
