import React from "react";

const Part = ({ name, numExercises }) => {
  return (
    <p>
      {name} {numExercises}
    </p>
  );
};

const Header = ({ title }) => {
  return <h2>{title}</h2>;
};

const Content = ({ course }) => {
  return course.parts.map((part) => {
    return (
      <Part key={part.id} name={part.name} numExercises={part.exercises} />
    );
  });
};

const Total = ({ course: { parts } }) => {
  const totalNumOfExercises = parts.reduce(
    (sum, current) => sum + current.exercises,
    0
  );
  return <b>Total of {totalNumOfExercises} exercises</b>;
};

const Course = ({ course }) => {
  return (
    <>
      <Header title={course.name} />
      <Content course={course} />
      <Total course={course} />
    </>
  );
};

export default Course;
