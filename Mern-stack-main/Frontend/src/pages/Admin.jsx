import React, { useState, useEffect } from 'react';
import './Admin.css';
import StudentsTable from '../components/StudentsTable';
import TeachersTable from '../components/TeachersTable';

const Admin = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('students');
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [attendance, setAttendance] = useState([]);
    
    // Student Management States
    const [studentName, setStudentName] = useState('');
    const [studentRollNo, setStudentRollNo] = useState('');
    
    // Course Management States
    const [courseCode, setCourseCode] = useState('');
    const [courseName, setCourseName] = useState('');
    
    // Teacher Management States
    const [teacherName, setTeacherName] = useState('');
    const [teacherUsername, setTeacherUsername] = useState('');
    
    // Teacher Course Assignment States
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [teacherCourses, setTeacherCourses] = useState([]);
    
    // Course-Student Management States
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [searchRollNo, setSearchRollNo] = useState('');
    const [searchResult, setSearchResult] = useState(null);

    // Initialize system data
    useEffect(() => {
        // Check authentication and role
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('currentUser');
        
        if (!token || !storedUser) {
            setIsLoading(false);
            alert('Please login first');
            window.location.href = '/login';
            return;
        }
        
        const user = JSON.parse(storedUser);
        if (user.role !== 'admin') {
            setIsLoading(false);
            alert('Access denied. Admin access required.');
            window.location.href = '/login';
            return;
        }
        
        setIsAuthenticated(true);
        setIsLoading(false);
        loadInitialData();

        // Set up an interval to refresh teacher data periodically
        const intervalId = setInterval(loadInitialData, 30000); // Refresh every 30 seconds

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    const initializeSystem = () => {
        if (!localStorage.getItem('users')) {
            const defaultUsers = [
                { 
                    username: 'admin', 
                    password: 'admin123', 
                    role: 'admin', 
                    name: 'System Administrator' 
                },
                { 
                    username: 'teacher1', 
                    password: 'teacher123', 
                    role: 'teacher', 
                    name: 'Ali Ahmed', 
                    courses: ['CS101'] 
                },
                { 
                    username: 'teacher2', 
                    password: 'teacher123', 
                    role: 'teacher', 
                    name: 'Dr. Sana Khan', 
                    courses: ['MATH201', 'PHY101'] 
                },
                { 
                    username: 'student23021519-084', 
                    password: 'student123', 
                    role: 'student', 
                    name: 'Haris', 
                    rollNo: '23021519-084',
                    courses: ['PHY101', 'CS101'] 
                },
                { 
                    username: 'student23021519-085', 
                    password: 'student123', 
                    role: 'student', 
                    name: 'Ali', 
                    rollNo: '23021519-085',
                    courses: ['MATH201'] 
                },
                { 
                    username: 'student23021519-086', 
                    password: 'student123', 
                    role: 'student', 
                    name: 'Sara', 
                    rollNo: '23021519-086',
                    courses: ['PHY101', 'MATH201'] 
                }
            ];
            localStorage.setItem('users', JSON.stringify(defaultUsers));
        }

        if (!localStorage.getItem('courses')) {
            const defaultCourses = [
                { code: 'CS101', name: 'Introduction to Programming' },
                { code: 'MATH201', name: 'Calculus I' },
                { code: 'PHY101', name: 'Physics Fundamentals' },
                { code: 'CHEM101', name: 'Basic Chemistry' },
                { code: 'BIO101', name: 'Biology Fundamentals' }
            ];
            localStorage.setItem('courses', JSON.stringify(defaultCourses));
        }

        if (!localStorage.getItem('attendance')) {
            const defaultAttendance = [
                { 
                    id: 1, 
                    studentId: 'student23021519-084', 
                    courseId: 'PHY101', 
                    status: 'present', 
                    date: '2024-01-15', 
                    timestamp: new Date().toISOString() 
                }
            ];
            localStorage.setItem('attendance', JSON.stringify(defaultAttendance));
        }
    };

    const loadInitialData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            // Load teachers from the database
            const teachersResponse = await fetch('http://localhost:5000/api/admin/teachers', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!teachersResponse.ok) {
                if (teachersResponse.status === 401) {
                    throw new Error('Please login again');
                }
                throw new Error('Failed to fetch teachers');
            }

            const teachersData = await teachersResponse.json();
            
            if (teachersData.success) {
                // Update users with teachers
                setUsers(prevUsers => {
                    // Filter out any existing teachers
                    const nonTeachers = prevUsers.filter(u => u.role !== 'teacher');
                    // Add new teachers from the database
                    return [...nonTeachers, ...teachersData.teachers];
                });
            }

            // Load courses and attendance from localStorage for now
            const storedCourses = JSON.parse(localStorage.getItem('courses')) || [];
            const storedAttendance = JSON.parse(localStorage.getItem('attendance')) || [];
            setCourses(storedCourses);
            setAttendance(storedAttendance);
        } catch (error) {
            console.error('Failed to load data:', error);
            alert(error.message);
        }
    };

    // Student Management Functions
    const addStudent = async () => {
        if (!studentName || !studentRollNo) {
            alert('Please fill all fields');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch('http://localhost:5000/api/admin/students', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: studentName,
                    rollNo: studentRollNo
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to add student');
            }

            setUsers(prevUsers => [...prevUsers, data.user]);
            setStudentName('');
            setStudentRollNo('');
            
            alert(`Student added successfully!\nUsername: ${data.user.username}\nPassword: student123`);
        } catch (error) {
            alert(error.message);
        }
    };

    const removeStudent = async (username) => {
        if (confirm('Are you sure you want to remove this student?')) {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No authentication token found');
                }

                const response = await fetch(`http://localhost:5000/api/admin/students/${username}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.message || 'Failed to remove student');
                }

                setUsers(prevUsers => prevUsers.filter(u => u.username !== username));
                alert('Student removed successfully');
            } catch (error) {
                alert(error.message);
            }
        }
    };

    // Course Management Functions
    const addCourse = () => {
        if (!courseCode || !courseName) {
            alert('Please fill all fields');
            return;
        }

        const existingCourse = courses.find(c => c.code === courseCode);
        if (existingCourse) {
            alert('Course with this code already exists!');
            return;
        }

        const newCourse = { code: courseCode, name: courseName };
        const updatedCourses = [...courses, newCourse];
        setCourses(updatedCourses);
        localStorage.setItem('courses', JSON.stringify(updatedCourses));

        setCourseCode('');
        setCourseName('');
        
        alert(`Course ${courseName} added successfully!`);
    };

    const removeCourse = (code) => {
        if (confirm('Are you sure you want to remove this course?')) {
            const filteredCourses = courses.filter(c => c.code !== code);
            setCourses(filteredCourses);
            localStorage.setItem('courses', JSON.stringify(filteredCourses));
            
            // Remove this course from all students and teachers
            const updatedUsers = users.map(user => {
                if (user.courses && user.courses.includes(code)) {
                    return {
                        ...user,
                        courses: user.courses.filter(course => course !== code)
                    };
                }
                return user;
            });
            setUsers(updatedUsers);
            localStorage.setItem('users', JSON.stringify(updatedUsers));
            
            alert('Course removed successfully!');
        }
    };

    // Teacher Management Functions
    const addTeacher = async () => {
        if (!teacherName || !teacherUsername) {
            alert('Please fill all fields');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch('http://localhost:5000/api/admin/teachers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: teacherName,
                    username: teacherUsername
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to add teacher');
            }

            setUsers(prevUsers => [...prevUsers, data.teacher]);
            setTeacherName('');
            setTeacherUsername('');
            
            alert(`Teacher ${teacherName} added successfully!\nUsername: ${data.teacher.username}`);
        } catch (error) {
            alert(error.message);
        }
    };

    const removeTeacher = async (username) => {
        if (confirm('Are you sure you want to remove this teacher?')) {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No authentication token found');
                }

                const response = await fetch(`http://localhost:5000/api/admin/teachers/${username}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.message || 'Failed to remove teacher');
                }

                setUsers(prevUsers => prevUsers.filter(u => u.username !== username));
                alert('Teacher removed successfully');
            } catch (error) {
                alert(error.message);
            }
        }
    };

    // Teacher Course Assignment Functions
    const assignCoursesToTeacher = () => {
        if (!selectedTeacher || teacherCourses.length === 0) {
            alert('Please select both teacher and at least one course');
            return;
        }

        const updatedUsers = users.map(user => {
            if (user.username === selectedTeacher) {
                return {
                    ...user,
                    courses: [...teacherCourses]
                };
            }
            return user;
        });

        setUsers(updatedUsers);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        setTeacherCourses([]);
        
        const teacherName = users.find(u => u.username === selectedTeacher)?.name;
        alert(`Courses assigned successfully to ${teacherName}!`);
    };

    const removeCourseFromTeacher = (teacherUsername, courseCode) => {
        if (confirm('Are you sure you want to remove this course from the teacher?')) {
            const updatedUsers = users.map(user => {
                if (user.username === teacherUsername && user.courses) {
                    return {
                        ...user,
                        courses: user.courses.filter(course => course !== courseCode)
                    };
                }
                return user;
            });

            setUsers(updatedUsers);
            localStorage.setItem('users', JSON.stringify(updatedUsers));
            alert('Course removed from teacher successfully!');
        }
    };

    // Helper functions for user filtering
    const students = users.filter(u => u.role === 'student');
    const teachers = users.filter(u => u.role === 'teacher');

    const addStudentsToCourse = () => {
        if (!selectedCourse || selectedStudents.length === 0) {
            alert('Please select both course and at least one student');
            return;
        }

        const updatedUsers = users.map(user => {
            if (selectedStudents.includes(user.username)) {
                const currentCourses = user.courses || [];
                if (!currentCourses.includes(selectedCourse)) {
                    return {
                        ...user,
                        courses: [...currentCourses, selectedCourse]
                    };
                }
            }
            return user;
        });

        setUsers(updatedUsers);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        setSelectedStudents([]);
        
        alert(`${selectedStudents.length} student(s) added to course successfully!`);
    };

    const removeStudentFromCourse = (studentUsername, courseCode) => {
        if (confirm('Are you sure you want to remove this student from the course?')) {
            const updatedUsers = users.map(user => {
                if (user.username === studentUsername && user.courses) {
                    return {
                        ...user,
                        courses: user.courses.filter(course => course !== courseCode)
                    };
                }
                return user;
            });

            setUsers(updatedUsers);
            localStorage.setItem('users', JSON.stringify(updatedUsers));
            alert('Student removed from course successfully!');
        }
    };

    // Search student courses
    const searchStudentCourses = () => {
        if (!searchRollNo.trim()) {
            alert('Please enter a roll number');
            return;
        }

        const student = students.find(s => s.rollNo === searchRollNo.trim());
        if (student) {
            setSearchResult(student);
        } else {
            setSearchResult(null);
            alert('Student not found!');
        }
    };

    // Utility Functions
    const getCourseName = (courseCode) => {
        const course = courses.find(c => c.code === courseCode);
        return course ? course.name : courseCode;
    };

    const logout = () => {
        localStorage.removeItem('currentUser');
        window.location.href = '/';
    };

    // Get students in selected course
    const studentsInCourse = students.filter(student => 
        student.courses && student.courses.includes(selectedCourse)
    );

    // Get the currently selected teacher's courses
    const selectedTeacherData = teachers.find(t => t.username === selectedTeacher);

    // Get courses assigned to selected teacher
    const teacherAssignedCourses = selectedTeacherData?.courses || [];
    
    // Show loading or nothing while checking authentication
    if (isLoading) {
        return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f5f5'}}></div>;
    }
    
    // Don't render anything if not authenticated
    if (!isAuthenticated) {
        return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f5f5'}}></div>;
    }

    return (
        <div className="admin-dashboard">
            <div className="dashboard-container">
                <div className="header">
                    <h1>Admin Dashboard</h1>
                    <button className="logout-btn" onClick={logout}>Logout</button>
                </div>
                
                {/* Updated Navigation with Teacher Management */}
                <div className="nav-menu">
                    <button 
                        onClick={() => setActiveSection('students')} 
                        className={activeSection === 'students' ? 'nav-btn active' : 'nav-btn'}
                    >
                        Manage Students
                    </button>
                    <button 
                        onClick={() => setActiveSection('teachers')} 
                        className={activeSection === 'teachers' ? 'nav-btn active' : 'nav-btn'}
                    >
                        Manage Teachers
                    </button>
                    <button 
                        onClick={() => setActiveSection('teacher-courses')} 
                        className={activeSection === 'teacher-courses' ? 'nav-btn active' : 'nav-btn'}
                    >
                        Teacher Courses
                    </button>
                    <button 
                        onClick={() => setActiveSection('courses')} 
                        className={activeSection === 'courses' ? 'nav-btn active' : 'nav-btn'}
                    >
                        Manage Courses
                    </button>
                    <button 
                        onClick={() => setActiveSection('course-students')} 
                        className={activeSection === 'course-students' ? 'nav-btn active' : 'nav-btn'}
                    >
                        Course Students
                    </button>
                    <button 
                        onClick={() => setActiveSection('search-courses')} 
                        className={activeSection === 'search-courses' ? 'nav-btn active' : 'nav-btn'}
                    >
                        Search Courses
                    </button>
                    <button 
                        onClick={() => setActiveSection('reports')} 
                        className={activeSection === 'reports' ? 'nav-btn active' : 'nav-btn'}
                    >
                        View Reports
                    </button>
                </div>

                <div className="content">
                    {/* Manage Students Section */}
                    {activeSection === 'students' && (
                        <div className="section">
                            <h2>Manage Students</h2>
                            <div className="form-row">
                                <div className="form-group">
                                    <input 
                                        type="text" 
                                        placeholder="Student Name"
                                        value={studentName}
                                        onChange={(e) => setStudentName(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <input 
                                        type="text" 
                                        placeholder="Roll Number"
                                        value={studentRollNo}
                                        onChange={(e) => setStudentRollNo(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <button className="btn success" onClick={addStudent}>Add Student</button>
                                </div>
                            </div>
                            
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Roll No</th>
                                            <th>Name</th>
                                            <th>Username</th>
                                            <th>Email</th>
                                            <th>Courses</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="no-data">No students found</td>
                                            </tr>
                                        ) : (
                                            students.map(student => (
                                                <tr key={student.username}>
                                                    <td>{student.rollNo}</td>
                                                    <td>{student.name}</td>
                                                    <td>{student.username}</td>
                                                    <td>{student.email}</td>
                                                    <td>
                                                        {student.courses && student.courses.length > 0 
                                                            ? student.courses.map(course => getCourseName(course)).join(', ')
                                                            : 'No courses'
                                                        }
                                                    </td>
                                                    <td>
                                                        <button 
                                                            className="btn danger"
                                                            onClick={() => removeStudent(student.username)}
                                                        >
                                                            Remove
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Manage Teachers Section */}
                    {activeSection === 'teachers' && (
                        <div className="section">
                            <h2>Manage Teachers</h2>
                            <div className="form-row">
                                <div className="form-group">
                                    <input 
                                        type="text" 
                                        placeholder="Teacher Name"
                                        value={teacherName}
                                        onChange={(e) => setTeacherName(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <input 
                                        type="text" 
                                        placeholder="Username"
                                        value={teacherUsername}
                                        onChange={(e) => setTeacherUsername(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <button className="btn success" onClick={addTeacher}>
                                        Add Teacher
                                    </button>
                                </div>
                            </div>
                            
                            <TeachersTable 
                                teachers={users.filter(u => u.role === 'teacher')}
                                removeTeacher={removeTeacher}
                                getAssignedCourses={(courses) => 
                                    courses.map(course => getCourseName(course)).join(', ')
                                }
                            />
                        </div>
                    )}

                    {/* Teacher Course Assignment Section */}
                    {activeSection === 'teacher-courses' && (
                        <div className="section">
                            <h2>Assign Courses to Teachers</h2>
                            
                            <div className="info-message">
                                💡 Select a teacher and assign courses they will be responsible for.
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Select Teacher:</label>
                                    <select 
                                        value={selectedTeacher}
                                        onChange={(e) => setSelectedTeacher(e.target.value)}
                                    >
                                        <option value="">-- Select Teacher --</option>
                                        {teachers.map(teacher => (
                                            <option key={teacher.username} value={teacher.username}>
                                                {teacher.name} ({teacher.username})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className="form-group">
                                    <label>Select Courses (Multiple):</label>
                                    <select 
                                        multiple
                                        className="multi-select"
                                        value={teacherCourses}
                                        onChange={(e) => setTeacherCourses(
                                            Array.from(e.target.selectedOptions, option => option.value)
                                        )}
                                    >
                                        {courses.map(course => (
                                            <option key={course.code} value={course.code}>
                                                {course.name} ({course.code})
                                            </option>
                                        ))}
                                    </select>
                                    <small>Hold Ctrl/Cmd to select multiple courses</small>
                                </div>
                                
                                <div className="form-group" style={{alignSelf: 'flex-end'}}>
                                    <button className="btn success" onClick={assignCoursesToTeacher}>
                                        Assign Courses
                                    </button>
                                </div>
                            </div>

                            {/* Show currently assigned courses */}
                            {selectedTeacher && (
                                <div className="student-courses-list">
                                    <h3>Currently Assigned Courses</h3>
                                    <p><strong>Teacher:</strong> {users.find(u => u.username === selectedTeacher)?.name}</p>
                                    
                                    <div style={{marginTop: '1rem'}}>
                                        <strong>Assigned Courses:</strong>
                                        {teacherAssignedCourses.length > 0 ? (
                                            <div style={{marginTop: '0.5rem'}}>
                                                {teacherAssignedCourses.map(course => (
                                                    <span key={course} className="course-badge badge-orange">
                                                        {getCourseName(course)}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p style={{color: 'var(--gray)', fontStyle: 'italic'}}>
                                                No courses assigned
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            <h3>All Teachers with Their Courses</h3>
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Teacher Name</th>
                                            <th>Username</th>
                                            <th>Assigned Courses</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {teachers.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="no-data">
                                                    No teachers found
                                                </td>
                                            </tr>
                                        ) : (
                                            teachers.map(teacher => (
                                                <tr key={teacher.username}>
                                                    <td>{teacher.name}</td>
                                                    <td>{teacher.username}</td>
                                                    <td>
                                                        {teacher.courses && teacher.courses.length > 0 ? (
                                                            <div>
                                                                {teacher.courses.map(course => (
                                                                    <div key={course} style={{marginBottom: '0.3rem'}}>
                                                                        <span className="course-badge">
                                                                            {getCourseName(course)}
                                                                        </span>
                                                                        <button 
                                                                            className="btn danger"
                                                                            style={{
                                                                                padding: '0.2rem 0.5rem',
                                                                                fontSize: '0.8rem',
                                                                                marginLeft: '0.5rem'
                                                                            }}
                                                                            onClick={() => removeCourseFromTeacher(teacher.username, course)}
                                                                        >
                                                                            Remove
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            'No courses assigned'
                                                        )}
                                                    </td>
                                                    <td>
                                                        <button 
                                                            className="btn warning"
                                                            onClick={() => {
                                                                setSelectedTeacher(teacher.username);
                                                                setTeacherCourses(teacher.courses || []);
                                                            }}
                                                        >
                                                            Edit Courses
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Rest of the sections remain the same */}
                    {/* Manage Courses Section */}
                    {activeSection === 'courses' && (
                        <div className="section">
                            <h2>Manage Courses</h2>
                            <div className="form-row">
                                <div className="form-group">
                                    <input 
                                        type="text" 
                                        placeholder="Course Code"
                                        value={courseCode}
                                        onChange={(e) => setCourseCode(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <input 
                                        type="text" 
                                        placeholder="Course Name"
                                        value={courseName}
                                        onChange={(e) => setCourseName(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <button className="btn success" onClick={addCourse}>Add Course</button>
                                </div>
                            </div>
                            
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Course Code</th>
                                            <th>Course Name</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {courses.length === 0 ? (
                                            <tr>
                                                <td colSpan="3" className="no-data">No courses found</td>
                                            </tr>
                                        ) : (
                                            courses.map(course => (
                                                <tr key={course.code}>
                                                    <td>{course.code}</td>
                                                    <td>{course.name}</td>
                                                    <td>
                                                        <button 
                                                            className="btn danger"
                                                            onClick={() => removeCourse(course.code)}
                                                        >
                                                            Remove
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Course Students Section */}
                    {activeSection === 'course-students' && (
                        <div className="section">
                            <h2>Manage Course Students</h2>
                            
                            <div className="info-message">
                                💡 You can select multiple students and assign them to a course at once.
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Select Course:</label>
                                    <select 
                                        value={selectedCourse}
                                        onChange={(e) => setSelectedCourse(e.target.value)}
                                    >
                                        <option value="">-- Select Course --</option>
                                        {courses.map(course => (
                                            <option key={course.code} value={course.code}>
                                                {course.name} ({course.code})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className="form-group">
                                    <label>Select Students (Multiple):</label>
                                    <select 
                                        multiple
                                        className="multi-select"
                                        value={selectedStudents}
                                        onChange={(e) => setSelectedStudents(
                                            Array.from(e.target.selectedOptions, option => option.value)
                                        )}
                                    >
                                        {students.map(student => (
                                            <option key={student.username} value={student.username}>
                                                {student.name} ({student.rollNo})
                                            </option>
                                        ))}
                                    </select>
                                    <small>Hold Ctrl/Cmd to select multiple students</small>
                                </div>
                                
                                <div className="form-group" style={{alignSelf: 'flex-end'}}>
                                    <button className="btn success" onClick={addStudentsToCourse}>
                                        Add Selected Students
                                    </button>
                                </div>
                            </div>

                            <h3>Students in Selected Course</h3>
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>ROLL NO</th>
                                            <th>NAME</th>
                                            <th>USERNAME</th>
                                            <th>REGISTERED COURSES</th>
                                            <th>ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {studentsInCourse.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="no-data">
                                                    {selectedCourse ? 'No students enrolled in this course' : 'Please select a course'}
                                                </td>
                                            </tr>
                                        ) : (
                                            studentsInCourse.map(student => (
                                                <tr key={student.username}>
                                                    <td>{student.rollNo}</td>
                                                    <td>{student.name}</td>
                                                    <td>{student.username}</td>
                                                    <td>
                                                        {student.courses && student.courses.map(course => (
                                                            <span key={course} className="course-badge">
                                                                {getCourseName(course)}
                                                            </span>
                                                        ))}
                                                    </td>
                                                    <td>
                                                        <button 
                                                            className="btn danger"
                                                            onClick={() => removeStudentFromCourse(student.username, selectedCourse)}
                                                        >
                                                            Remove
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Search Courses Section */}
                    {activeSection === 'search-courses' && (
                        <div className="section">
                            <h2>Search Student Courses</h2>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Enter Student Roll Number:</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g., 23021519-084"
                                        value={searchRollNo}
                                        onChange={(e) => setSearchRollNo(e.target.value)}
                                    />
                                </div>
                                <div className="form-group" style={{alignSelf: 'flex-end'}}>
                                    <button className="btn" onClick={searchStudentCourses}>
                                        Search Courses
                                    </button>
                                </div>
                            </div>

                            {searchResult && (
                                <div className="student-courses-list">
                                    <h3>Courses Registered by {searchResult.name}</h3>
                                    <p><strong>Roll No:</strong> {searchResult.rollNo}</p>
                                    <p><strong>Username:</strong> {searchResult.username}</p>
                                    
                                    <div style={{marginTop: '1rem'}}>
                                        <strong>Registered Courses:</strong>
                                        {searchResult.courses && searchResult.courses.length > 0 ? (
                                            <div style={{marginTop: '0.5rem'}}>
                                                {searchResult.courses.map(course => (
                                                    <span key={course} className="course-badge">
                                                        {getCourseName(course)}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p style={{color: 'var(--gray)', fontStyle: 'italic'}}>
                                                No courses registered
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Reports Section */}
                    {activeSection === 'reports' && (
                        <div className="section">
                            <h2>Attendance Reports</h2>
                            
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <div className="stat-number">{attendance.length}</div>
                                    <div className="stat-label">Total Records</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-number">{students.length}</div>
                                    <div className="stat-label">Total Students</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-number">{courses.length}</div>
                                    <div className="stat-label">Total Courses</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-number">{teachers.length}</div>
                                    <div className="stat-label">Total Teachers</div>
                                </div>
                            </div>
                            
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Student</th>
                                            <th>Course</th>
                                            <th>Status</th>
                                            <th>Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attendance.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="no-data">
                                                    No attendance records found
                                                </td>
                                            </tr>
                                        ) : (
                                            attendance.map(record => {
                                                const student = users.find(u => u.username === record.studentId);
                                                const course = courses.find(c => c.code === record.courseId);
                                                const time = new Date(record.timestamp).toLocaleTimeString();
                                                
                                                return (
                                                    <tr key={record.id}>
                                                        <td>{record.date}</td>
                                                        <td>{student ? student.name : record.studentId}</td>
                                                        <td>{course ? course.name : record.courseId}</td>
                                                        <td className={`status-${record.status}`}>
                                                            {record.status.toUpperCase()}
                                                        </td>
                                                        <td>{time}</td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Admin;