"use client"
import { Chip } from '@heroui/chip';
import { Spinner } from '@heroui/spinner';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface blog {
  id: string;
  title: string;
  slug: string;
  category: string;
  thumbnailImage: string;
  content: string;
  writerId: number;
}

const ReadComp = () => {
  const [blog, setBlog] = useState<blog>()
  const [blogFetched, setBlogFetched] = useState(false)
  const id = useParams().id
  console.log(blog);


  const getBlogById = async () => {
    try {
      setBlogFetched(false)
      const res = await fetch("/api/reader/by-id", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id })
      })
      const response = await res.json()
      if (response.success === true) {
        setBlogFetched(true)
        setBlog(response.blog[0])
      }
    } catch (error) {
      console.log(error);

    }
  }
  useEffect(() => {
    getBlogById()
  }, [])

  // if (!blog) {
  //   return <></>
  // }

  return (
    <div>
      {
        blogFetched && blog !==undefined ? (
          <div className='sm:px-20 px-10'>
            <div>
              <h1 className='text-2xl font-bold max-w-[550px]'>{blog?.title}</h1>
              <div>
                <Chip color="secondary">
                  {blog.category === "mental_health" ? (<p>Mental Health</p>) : (<p className='capitalize'> {blog?.category}</p>)}
                </Chip>
              </div>
              <img src={blog?.thumbnailImage} alt="image" width={500} className='mt-2 rounded' />
              <div className='max-w-[550px]'>
                <div
                  className="whitespace-pre-wrap [&>ul]:list-disc [&>ul]:pl-6 max-w-[700px]"
                  dangerouslySetInnerHTML={{
                    __html: blog?.content.replace(/<p>\s*<\/p>/g, "<br>")!,
                  }} />
              </div>
            </div>
          </div>) : (<div className='flex justify-center items-center mt-20'>
            <Spinner color='default' />
          </div>)
      }
    </div>
  )
}

export default ReadComp