"use client"
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'

const ReadComp = () => {

     const id = useParams().id
     console.log(id);
     
    
      const getBlogById = async () => {
        try {
          const res = await fetch("/api/reader/by-id", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({id})
          })
          const response = await res.json()
          console.log(response);
          
        } catch (error) {
          console.log(error);
          
        }
      }
      useEffect(() => {
        getBlogById()
      }, [])

  return (
    <div>ReadComp</div>
  )
}

export default ReadComp