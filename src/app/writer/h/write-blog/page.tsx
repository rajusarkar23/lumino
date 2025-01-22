import WriteBlog from '@/components/writer/WriteBlog'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation';

const Write = async () => {

  if (!(await cookies()).get("session")) {
    redirect("/writer/signin");

  }
  return (
    <div><WriteBlog /></div>
  )
}

export default Write