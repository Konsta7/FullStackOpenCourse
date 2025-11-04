
const Header = ({ course }) => {
  return (
    <h1>{course.name}</h1>
  )
}


const Part = ({ part }) => {
  return (
    <p>{part.name} {part.exercises}</p>
  )
}


const Content = ({ parts }) => {
  console.log(parts)
  return (
    <div>
      <div>
        {parts.map(part => 
            <Part key={part.id} part={part} />
          )}
      </div>
      <div>
        Total of {parts.reduce((sum, part) => sum + part.exercises, 0)} parts
      </div>
    </div>
  )
}



const Course = ({ course }) => {
  console.log(course)
  return (
    <div>
      <Header course={course} />
      <Content parts={course.parts} />
    </div>
  )
}

const Courses = ({ courses }) => {
  return (
    <div>
      {courses.map(course => 
          <Course key={course.id} course={course} />
        )}
    </div>
  )
}

export default Courses