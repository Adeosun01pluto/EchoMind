import { useState } from 'react';

function Gp() {
  const [noOfCourses, setNoOfCourses] = useState(null);
  const [courseData, setCourseData] = useState([]);
  const [start, setStart] = useState(false);
  const [calculatedGpa, setCalculatedGpa] = useState(null);
  const [show, setShow] = useState(false);


  const StartTo = () => {
    if (noOfCourses) {
      setStart(true);
      const courses = [...Array(Number(noOfCourses)).keys()].map((_, idx) => ({
        grade: '',
        point: '',
        id: idx,
      }));
      setCourseData(courses);
      setCalculatedGpa(null)
    }
  };
  const howTo = () =>{
    setShow(!show)
  }
  const handleGradeChange = (id, grade) => {
    const updatedData = courseData.map(course =>
      course.id === id ? { ...course, grade } : course
    );
    setCourseData(updatedData);
  };

  const handlePointChange = (id, point) => {
    const updatedData = courseData.map(course =>
      course.id === id ? { ...course, point } : course
    );
    setCourseData(updatedData);
  };

  const calculateGpa = () => {
    // Filter out courses with empty grade and point values
    const validCourses = courseData.filter(course => course.grade && course.point);
  
    if (validCourses.length === 0) {
      // No valid courses to calculate GPA
      setCalculatedGpa(null);
      return;
    }
    const calculateTotalScoreAndPoints = (courses) => {
      const gradeValues = {
        A: 5,
        B: 4,
        C: 3,
        D: 2,
      };
    
      // Initialize totalScore and totalPoints
      let totalScore = 0;
      let totalPoints = 0;
    
      // Calculate the total score and total points by iterating over the courses
      courses.forEach((course) => {
        // Convert the grade to uppercase to handle case insensitivity
        const grade = course.grade.toUpperCase();
    
        // Check if the grade is valid
        if (gradeValues.hasOwnProperty(grade)) {
          // Multiply grade value by the point and add it to the total score
          const gradeValue = gradeValues[grade];
          const point = parseInt(course.point); // Convert point to integer
          if (!isNaN(point)) {
            totalScore += gradeValue * point;
            totalPoints += point;
          }
        }
      });
      return { totalScore, totalPoints };
    };
    
    const { totalScore, totalPoints } = calculateTotalScoreAndPoints(courseData)
    const gpa = totalScore / totalPoints;
    const roundedGpa = parseFloat(gpa.toFixed(2));
    setCalculatedGpa(roundedGpa);
  };
  const [option, setOption] = useState("")
  const Display = () =>{
  }
  const handleSelectChange = (e) =>{
    setOption(e.target.value)
  }

  return (
    <div className='w-full md:p-3 flex justify-center py-6 min-h-[100vh]'>
      <div className='md:w-[70%] w-full md:p-6'>
        <div className='mx-auto md:w-[80%] h-[70vh] dark:bg-[#171517] bg-[#f2e4fb] shadow-md md:rounded-md p-2'>
          <h2 className='text-3xl font-semibold mb-4'>Calculate your CGPA</h2>
          <div className='w-[100%] h-[100px] flex flex-col gap-2 items-start'>
            <select name="" value={option} onChange={handleSelectChange} id="" className='w-48 p-2  rounded-md text-md font-semibold text-[#171517] bg-white' >
              <option value="semester" className='' >Semester</option>
              <option value="Session" className=''>Session</option>
            </select>
            <button onClick={Display} className='py-1 px-2 bg-[#4f1179] text-white rounded-lg'>Display</button>
          </div>
          <div className='bg-[#fff] my-2 p-1 md:p-3 rounded-md '>
            <div className='flex items-center gap-1 md:gap-3'>
              {/* <span className='text-md md:text-lg text-black font-bold'>No of Courses</span> */}
              <input
                type="number"
                value={noOfCourses}
                placeholder='Number of courses'
                onChange={(e) => setNoOfCourses(e.target.value)}
                className='p-2 rounded-sm flex-grow bg-white text-back'
              />
              <button
                onClick={StartTo}
                className='px-4 py-2 rounded-md bg-[#4f1179] text-white'
              >
                Save
              </button>
            </div>
          </div>
          {!start ? null : (
            <form className='w-[100%] bg-[#f3f3f3] rounded-md'>
              {courseData.map((course, idx) => (
                <div
                  key={course.id}
                  className='md:w-full p-2 flex flex-col gap-2'
                >
                  <label className='text-md md:text-lg font-semibold text-black' htmlFor={`grade-${course.id}`}>
                    Course: {idx + 1}
                  </label>
                  <div className='flex flex-col sm:flex-row md:flex-col gap-3 sm:gap-1 md:gap-3 md:w-full'>
                    <div className='flex flex-1 items-center gap-1 md:gap-3'>
                      <label className='text-sm md:text-md text-black font-semibold' htmlFor={`grade-${course.id}`}>
                        Grade:
                      </label>
                      <input
                        type="text"
                        required
                        id={`grade-${course.id}`}
                        value={course.grade}
                        onChange={e => handleGradeChange(course.id, e.target.value)}
                        className='p-2 w-full rounded-sm text-[#4f1179]'
                      />
                    </div>
                    <div className='flex flex-1 items-center gap-3'>
                      <label className='text-sm md:text-md text-black font-semibold' htmlFor={`point-${course.id}`}>
                        Point:
                      </label>
                      <input
                        type="number"
                        required
                        id={`point-${course.id}`}
                        value={course.point}
                        onChange={e => handlePointChange(course.id, e.target.value)}
                        className='p-2 w-full rounded-sm bg-white text-[#4f1179]'
                      />
                    </div>
                  </div>
                </div>
              ))}
              <div className='flex items-center justify-between mt-4'>
                <button
                  className='px-4 py-2 rounded-md bg-black text-white'
                  type="button"
                  onClick={calculateGpa}
                >
                  Calculate
                </button>
              </div>
            </form>
          )}
          {calculatedGpa !== null && (
            <div className='mt-4'>
              <p className='text-xl text-[#4f1179]'>
                Calculated GPA: {calculatedGpa}
              </p>
            </div>
          )}
          <button className='' onClick={howTo}>How to calculate</button>
          {!show? null :
          <div className='bg-[black] w-[100%] h-[400px]'></div>
          }
      </div>

      </div>
    </div>
  );
}

export default Gp;
