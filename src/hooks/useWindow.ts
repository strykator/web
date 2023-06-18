import {useEffect, useState} from 'react'

const useWindow = () => {
  const [isBottom, setIsBottom] = useState<boolean>(false)
  const [isTop, setIsTop] = useState<boolean>(true)
  const [scrollY, setScrollY] = useState<number>(0)

  useEffect(() => {
    const handleScroll = () => {
      const atBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight
      setIsBottom(atBottom)
      setScrollY(window.scrollY)
      if (window.scrollY === 0) {
        setIsTop(true)
      } else {
        if (isTop) setIsTop(false)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return {
    isTop,
    isBottom,
    fullHeight: window.innerHeight + document.documentElement.scrollHeight,
    scrollY,
  }
}

export default useWindow
