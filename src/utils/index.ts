import numeral from 'numeral'

export const truncate = (words: string, n: number) => {
  if (!words) return ''

  return `${words.slice(0, n)}...`
}

export const formatCurrency = (number: number) => {
  return numeral(number).format('$0,0.00')
}
