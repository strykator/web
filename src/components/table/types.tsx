export type TOrder = 'asc' | 'desc'
type TAlign = 'center' | 'right' | 'left' | 'inherit' | 'justify' | undefined
export interface IHeadCell {
  id: string
  align: TAlign
  label: string
  width: string
}
