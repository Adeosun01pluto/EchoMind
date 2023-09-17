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
    const totalScore = courseData.reduce((total, course) => {
      const gradeValue = {
        A: 5,
        B: 4,
        C: 3,
        D: 2,
      }[course.grade.toUpperCase()];
      return total + gradeValue * course.point;
    }, 0);

    const totalCourses = courseData.length;
    const gpa = totalScore / totalCourses;

    setCalculatedGpa(gpa);
  };
  const [option, setOption] = useState("")
  const Display = () =>{

  }
  const handleSelectChange = (e) =>{
    setOption(e.target.value)
  }

  return (
    <div className='w-full md:p-3 flex justify-center bg-[#f3f3f3] min-h-[110vh]'>
      <div className='md:w-[70%] md:p-6 rounded-md'>
        <div className='mx-auto md:w-[80%] bg-white shadow-md rounded-md p-2'>
          <h2 className='text-3xl font-semibold mb-4'>Calculate your CGPA</h2>
          {!show? null :
          <div className='bg-[black] w-[100%] h-[400px]'></div>
          }
          <div className='w-[100%] h-[100px] flex flex-col gap-2 items-start'>
            <select name="" value={option} onChange={handleSelectChange} id="" className='w-48 p-2 rounded-md text-xl font-bold' >
              <option value="..."></option>
              <option value="semester" className=' text-xl font-bold' >Semester</option>
              <option value="Session" className=' text-xl font-bold'>Session</option>
            </select>
            <button onClick={Display} className='py-1 px-2 bg-blue-500 text-white rounded-lg'>Display</button>
          </div>
          <div className='bg-[#f3f3f3] my-2 p-1 md:p-3 rounded-md '>
            <div className='flex items-center gap-1 md:gap-3'>
              <span className='text-md md:text-lg text-black font-bold'>No of Courses</span>
              <input
                type="number"
                value={noOfCourses}
                placeholder='Enter the number of courses'
                onChange={(e) => setNoOfCourses(e.target.value)}
                className='p-2 rounded-sm md:flex-1 bg-white text-emerald-500'
              />
              <button
                onClick={StartTo}
                className='px-4 py-2 rounded-md bg-emerald-500 text-white'
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
                  className='md:w-full p-4 flex flex-col gap-2'
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
                        className='p-2 w-full rounded-sm text-emerald-500'
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
                        className='p-2 w-full rounded-sm bg-white text-emerald-500'
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
              <p className='text-xl text-emerald-500'>
                Calculated GPA: {calculatedGpa}
              </p>
            </div>
          )}
          <button className='' onClick={howTo}>How to calculate</button>

      </div>

      </div>
    </div>
  );
}

export default Gp;
