const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const mostLikes = (blogs) => {
    if(blogs.length === 0) {
        return 0
    }
    let leading = blogs[0]
    for(let i in blogs) {
        if(blogs[i].likes > leading.likes) {
        leading = blogs[i]
        }
    }
    return leading
}

module.exports = {
  dummy,
  totalLikes,
  mostLikes
}