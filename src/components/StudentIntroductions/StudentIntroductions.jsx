import React, { useState, useEffect } from 'react';
import './StudentIntroductions.css';

const StudentIntroductions = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentStudentIndex, setCurrentStudentIndex] = useState(0);

    // Fetch Fall 2025 students data
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setLoading(true);
                const response = await fetch('https://dvonb.xyz/api/2025-fall/itis-3135/students?full=1');
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: Failed to fetch student data`);
                }
                
                const data = await response.json();
                setStudents(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    // Navigation functions
    const nextStudent = () => {
        setCurrentStudentIndex((prevIndex) => 
            prevIndex === students.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevStudent = () => {
        setCurrentStudentIndex((prevIndex) => 
            prevIndex === 0 ? students.length - 1 : prevIndex - 1
        );
    };

    const currentStudent = students[currentStudentIndex];

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading student introductions...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <h2>Error Loading Data</h2>
                <p>{error}</p>
                <p>Please try refreshing the page.</p>
            </div>
        );
    }

    if (students.length === 0) {
        return (
            <div className="student-introductions">
                <header className="page-header">
                    <h1>Class Introductions</h1>
                    <p>ITIS 3135 - Fall 2025</p>
                </header>
                
                <div className="no-students">
                    <h3>No student data available</h3>
                    <p>The API returned an empty response.</p>
                    <p><strong>Endpoint:</strong> https://dvonb.xyz/api/2025-fall/itis-3135/students?full=1</p>
                </div>
            </div>
        );
    }

    return (
        <div className="student-introductions">
            <header className="page-header">
                <h1>Class Introductions</h1>
                <p>ITIS 3135 - Fall 2025</p>
                <p className="total-students">Total Students: {students.length}</p>
            </header>

            {/* Single Student View */}
            <div className="student-card">
                <div className="student-header">
                    <h2>
                        {currentStudent.firstName} {currentStudent.lastName}
                        {currentStudent.preferredName && (
                            <span className="preferred-name"> "{currentStudent.preferredName}"</span>
                        )}
                    </h2>
                    <div className="student-mascot">
                        {currentStudent.mascotAdjective} {currentStudent.mascotAnimal}
                    </div>
                </div>

                <div className="student-details">
                    <div className="detail-group">
                        <h4>Contact Information</h4>
                        <p><strong>Email:</strong> {currentStudent.email}</p>
                        {currentStudent.website && (
                            <p>
                                <strong>Website:</strong>{' '}
                                <a href={currentStudent.website} target="_blank" rel="noopener noreferrer">
                                    {currentStudent.website}
                                </a>
                            </p>
                        )}
                    </div>

                    <div className="detail-group">
                        <h4>Academic Background</h4>
                        <p>{currentStudent.academicBackground || 'Not specified'}</p>
                    </div>

                    <div className="detail-group">
                        <h4>Professional Background</h4>
                        <p>{currentStudent.professionalBackground || 'Not specified'}</p>
                    </div>

                    <div className="detail-group">
                        <h4>Personal Background</h4>
                        <p>{currentStudent.personalBackground || 'Not specified'}</p>
                    </div>

                    {currentStudent.primaryComputer && (
                        <div className="detail-group">
                            <h4>Primary Computer</h4>
                            <p>{currentStudent.primaryComputer}</p>
                        </div>
                    )}

                    {currentStudent.funnyThing && (
                        <div className="detail-group">
                            <h4>Funny Thing</h4>
                            <p>{currentStudent.funnyThing}</p>
                        </div>
                    )}
                </div>

                {/* Courses Section */}
                {currentStudent.courses && currentStudent.courses.length > 0 && (
                    <div className="courses-section">
                        <h4>Current Courses</h4>
                        <div className="courses-grid">
                            {currentStudent.courses.map((course, index) => (
                                <div key={index} className="course-card">
                                    <h5>{course.department} {course.number}</h5>
                                    <p className="course-name">{course.name}</p>
                                    <p className="course-reason">{course.reason}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Links Section */}
                {currentStudent.links && currentStudent.links.length > 0 && (
                    <div className="links-section">
                        <h4>Links</h4>
                        <div className="links-grid">
                            {currentStudent.links.map((link, index) => (
                                <a
                                    key={index}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="link-item"
                                >
                                    {link.name}
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation Controls */}
            <div className="navigation-controls">
                <button onClick={prevStudent} className="nav-button">
                    ← Previous
                </button>
                
                <span className="student-position">
                    Student {currentStudentIndex + 1} of {students.length}
                </span>
                
                <button onClick={nextStudent} className="nav-button">
                    Next →
                </button>
            </div>

            {/* Quick Navigation */}
            <div className="quick-nav">
                <h4>Quick Navigation</h4>
                <div className="student-list">
                    {students.map((student, index) => (
                        <button
                            key={student.email || index}
                            onClick={() => setCurrentStudentIndex(index)}
                            className={`student-list-item ${
                                index === currentStudentIndex ? 'active' : ''
                            }`}
                        >
                            {student.firstName} {student.lastName}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudentIntroductions;