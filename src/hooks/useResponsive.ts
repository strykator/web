import {useMediaQuery} from 'react-responsive'

const useResponsive = () => {
  const isDesktop = useMediaQuery({minWidth: 1224})
  const isTablet = useMediaQuery({maxWidth: 1224})
  const isMobile = useMediaQuery({maxWidth: 650})
  const isBigScreen = useMediaQuery({minWidth: 1824})
  const isPortrait = useMediaQuery({orientation: 'portrait'})
  const isRetina = useMediaQuery({minResolution: '2dppx'})

  return {
    isDesktop,
    isBigScreen,
    isTablet,
    isMobile,
    isPortrait,
    isRetina,
  }
}

export default useResponsive
