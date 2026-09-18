import { useState } from 'react'
import blogService from '../services/blogs'
import Blog from './Blog'
import { Link } from 'react-router-dom'

const BlogList = ({ blogs, setBlogs, user }) => {
    return (
        <div>
            <h2>blogs</h2>
            <ul>
                {blogs.sort((a, b) => (b.likes- a.likes)).map(blog =>
                    <li key={blog.id}>
                        <Link to={`/blogs/${blog.id}`}>
                            {blog.title} by {blog.author}
                        </Link>
                    </li>
                )}
            </ul>
        </div>
    )
}

export default BlogList