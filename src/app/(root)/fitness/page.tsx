"use client"
import { useParams } from 'next/navigation'
import React from 'react'

const Fitness = () => {
    const params = useParams()
    console.log(params);
    
  return (
    <div>Fitness</div>
  )
}

export default Fitness