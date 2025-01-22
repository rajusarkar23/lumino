import FetchBlog from '@/components/writer/FetchBlogs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation';

const WriterHome = async () => {

  if (!(await cookies()).get("session")) {
    redirect("/writer/signin");
  }
  return (
    <div>
      <FetchBlog/>
    </div>
  )
}

export default WriterHome