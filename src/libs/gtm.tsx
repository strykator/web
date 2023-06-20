export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID

export const pageview = (url: any) => {
  // Declare the dataLayer object if it doesn't exist
  ;(window as any).dataLayer = (window as any).dataLayer || []

  ;(window as any).dataLayer.push({
    event: 'pageview',
    page: url,
  })
}
