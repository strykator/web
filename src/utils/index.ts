const steamboys = [
  {
    key: 'key1',
    title: 'Tiger Sugar Milk Tea',
    category: '',
    description: '',
    price: '',
    rating: 0,
    img: 'https://popmenucloud.com/cdn-cgi/image/width%3D1920%2Cheight%3D1920%2Cfit%3Dscale-down%2Cformat%3Dauto%2Cquality%3D60/kdmfajei/f3411e1d-9dff-4a5f-8675-4b93be5f154d.jpeg',
  },
  {
    key: 'key2',
    title: 'Matcha',
    category: '',
    description: '',
    price: '',
    rating: 0,
    img: 'https://popmenucloud.com/cdn-cgi/image/width%3D1920%2Cheight%3D1920%2Cfit%3Dscale-down%2Cformat%3Dauto%2Cquality%3D60/kdmfajei/24ba6c49-a878-46a1-8f0f-d0f8bac5ae17.png',
  },
  {
    key: 'key3',
    title: 'Taro',
    category: '',
    description: '',
    price: '',
    rating: 0,
    img: 'https://popmenucloud.com/cdn-cgi/image/width%3D1920%2Cheight%3D1920%2Cfit%3Dscale-down%2Cformat%3Dauto%2Cquality%3D60/kdmfajei/4a6904bb-c09f-449d-bf0f-7704d3fa8ea1.png',
  },
  {
    key: 'key4',
    title: 'Olong Milk Tea',
    category: '',
    description: '',
    price: '',
    rating: 0,
    img: 'https://popmenucloud.com/cdn-cgi/image/width%3D1920%2Cheight%3D1920%2Cfit%3Dscale-down%2Cformat%3Dauto%2Cquality%3D60/kdmfajei/7ad47c20-1478-42f9-a651-1957e21a18fd.png',
  },
  {
    key: 'key5',
    title: 'Seafood Noodle Soup',
    category: '',
    description: '',
    price: '',
    rating: 0,
    img: 'https://popmenucloud.com/cdn-cgi/image/width%3D1920%2Cheight%3D1920%2Cfit%3Dscale-down%2Cformat%3Dauto%2Cquality%3D60/kdmfajei/e124c48d-e16d-486c-ad61-56ca2ddb21d1.jpg',
  },
  {
    key: 'key6',
    title: 'Gua Bao Chicken Cutlet',
    category: '',
    description: '',
    price: '',
    rating: 0,
    img: 'https://popmenucloud.com/cdn-cgi/image/width%3D1920%2Cheight%3D1920%2Cfit%3Dscale-down%2Cformat%3Dauto%2Cquality%3D60/kdmfajei/3a04ac09-c762-4125-a3c4-0867f7d05509.jpg',
  },
]

export const truncate = (words: string, n: number) => {
  if (!words) return ''

  return `${words.slice(0, n)}...`
}
