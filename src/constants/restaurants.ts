import {
  handeliMenu,
  chipotleMenu,
  chickFillAMenu,
  crumbleCookiesMenu,
} from './restaurantMenu'

export const restaurantIds = {
  chickFillA: 'Chick-fil-A',
  hanDeli: 'Han-Deli',
  chipotle: 'Chipotle',
  crumbleCookies: 'Crumble-Cookies',
}

export const restaurants = [
  {
    id: restaurantIds.chickFillA,
    name: 'Chick-fil-A',
    description: '',
    address: '7606 Highway 70 South, Nashville-Davidson, TN 37221',
    rating: 4.5,
    photoUrl:
      'https://img.cdn4dd.com/cdn-cgi/image/fit=cover,width=1000,height=300,format=auto,quality=80/https://doordash-static.s3.amazonaws.com/media/store/header/c4919426-b5b2-4047-9757-af40f9aafa27.jpg',
    logoUrl:
      'https://img.cdn4dd.com/p/fit=contain,width=100,height=100,format=auto,quality=95/media/restaurant/cover_square/Chick-fil-A%C3%82_logo.png',
    menu: chickFillAMenu,
  },
  {
    id: restaurantIds.hanDeli,
    name: 'Hans Deli & Boba South',
    description: '',
    address: '7618 Hwy 70 S 101, Nashville, TN 37221',
    rating: 5,
    photoUrl:
      'https://img.cdn4dd.com/cdn-cgi/image/fit=cover,width=1000,height=300,format=auto,quality=80/https://doordash-static.s3.amazonaws.com/media/store/header/8a4704ab-9dae-48e9-af6d-af0a2d2e6ac9.jpg',
    logoUrl:
      'https://img.cdn4dd.com/p/fit=contain,width=100,height=100,format=auto,quality=95/media/restaurant/cover_square/ed82e71d-6ee2-48bd-8264-eba925c7d2f6.JPG',
    menu: handeliMenu,
  },
  {
    id: restaurantIds.chipotle,
    name: 'Chipotle',
    description: '',
    address: '6838 Charlotte Pike, Nashville, TN 37209, USA',
    rating: 4.5,
    photoUrl:
      'https://img.cdn4dd.com/cdn-cgi/image/fit=contain,format=auto,width=800,quality=50/https://doordash-static.s3.amazonaws.com/media/photosV2/81006ae4-874c-445a-a4a4-35e5b645179a-retina-large.png',
    logoUrl:
      'https://img.cdn4dd.com/p/fit=contain,width=100,height=100,format=auto,quality=95/media/restaurant/cover_square/ChipotelLogo1.jpg',
    menu: chipotleMenu,
  },
  {
    id: restaurantIds.crumbleCookies,
    name: 'Crumble Cookies',
    description: '',
    address: '8068 TN-100, Nashville, TN 37221, USA',
    rating: 5,
    photoUrl:
      'https://img.cdn4dd.com/cdn-cgi/image/fit=contain,format=auto,width=800,quality=50/https://doordash-static.s3.amazonaws.com/media/store/header/c3d44cca-ce1f-41ee-ad36-e4ddf1005fda.png',
    logoUrl:
      'https://img.cdn4dd.com/p/fit=contain,width=200,height=200,format=auto,quality=95/media/restaurant/cover_square/151f957c-5f08-4d2a-a1d7-e62c584f39c7.jpg',
    menu: crumbleCookiesMenu,
  },
]
