import * as yup from 'yup'

export const schemaFormCheckout = yup.object().shape({
  name: yup.string(),
  email: yup.string().email(),
  phone: yup
    .string()
    .required()
    .matches(
      /^\d{3}-\d{3}-\d{4}$/,
      'Phone number must have the format XXX-XXX-XXXX',
    ),
  address: yup.string(),
  country: yup.string(),
  state: yup.string(),
  city: yup.string(),
  zipcode: yup.string(),
  cardNumber: yup
    .string()
    .required()
    .matches(
      /^\d{4} \d{4} \d{4} \d{4}$/,
      'Card number must have the format XXXX XXXX XXXX XXXX',
    ),
  expiration: yup
    .string()
    .required()
    .matches(/^\d{2}\/\d{2}$/, 'Expiration must have the format MM/YY'),
  cardCode: yup.string(),
  promoCode: yup.string(),
})

export const schemaFormProfile = yup.object().shape({
  name: yup.string(),
  email: yup.string().email(),
  phone: yup
    .string()
    .matches(
      /^\d{3}-\d{3}-\d{4}$/,
      'Phone number must have the format XXX-XXX-XXXX',
    ),
  address: yup.string(),
  country: yup.string(),
  state: yup.string(),
  city: yup.string(),
  zipcode: yup.string(),
  bio: yup.string(),
})

export const schemaFormProductCreate = yup.object().shape({
  name: yup.string().required(),
  description: yup.string(),
  category: yup.string(),
  imageUrl: yup.string(),
  price: yup.number().required(),
  quantity: yup.number().required(),
  rating: yup.number(),
  stores: yup.array().min(1, 'At least one store is required.'),
  options: yup.string(),
  status: yup.string().required(),
})
