import { Link, useParams } from 'react-router-dom'
import Blog from './Blog'

const BlogPage = ({ blogs, setBlogs, user }) => {
  const { id } = useParams()
  const blog = blogs.find(blog => blog.id === id)

  if (!blog) {
    return <p>Blog not found</p>
  }

  return (
    <div>
      <Blog
        blog={blog}
        blogs={blogs}
        setBlogs={setBlogs}
        user={user}
      />
    </div>
  )
}

export default BlogPage