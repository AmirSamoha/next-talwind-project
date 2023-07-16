import Image from 'next/image'
import React from 'react'

const Product = ({name, image, price}) => {
  return (
    <div>
        <Image src={image} alt={name} width={200} height={200}/>
        <h1>{name}</h1>
        <p>{price}</p>
    </div>
  )
}

export default Product