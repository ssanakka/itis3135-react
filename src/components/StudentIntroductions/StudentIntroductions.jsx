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

    // Helper function to get student display name
    const getDisplayName = (student) => {
        const name = student.name;
        return `${name.first} ${name.last}`;
    };

    // Helper function to get preferred name if available
    const getPreferredName = (student) => {
        return student.name.preferred || '';
    };

    // Helper function to get mascot
    const getMascot = (student) => {
        return student.mascot || '';
    };

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
                        {getDisplayName(currentStudent)}
                        {getPreferredName(currentStudent) && (
                            <span className="preferred-name"> "{getPreferredName(currentStudent)}"</span>
                        )}
                    </h2>
                    <div className="student-mascot">
                        {getMascot(currentStudent)}
                    </div>
                </div>

                <div className="student-details">
                    <div className="detail-group">
                        <h4>Contact Information</h4>
                        <p><strong>Email:</strong> {currentStudent.prefix}@charlotte.edu</p>
                        {currentStudent.links?.charlotte && (
                            <p>
                                <strong>Website:</strong>{' '}
                                <a href={currentStudent.links.charlotte} target="_blank" rel="noopener noreferrer">
                                    {currentStudent.links.charlotte}
                                </a>
                            </p>
                        )}
                    </div>

                    <div className="detail-group">
                        <h4>Academic Background</h4>
                        <p>{currentStudent.backgrounds?.academic || 'Not specified'}</p>
                    </div>

                    <div className="detail-group">
                        <h4>Professional Background</h4>
                        <p>{currentStudent.backgrounds?.professional || 'Not specified'}</p>
                    </div>

                    <div className="detail-group">
                        <h4>Personal Background</h4>
                        <p>{currentStudent.backgrounds?.personal || 'Not specified'}</p>
                    </div>

                    {currentStudent.platform?.device && (
                        <div className="detail-group">
                            <h4>Primary Computer</h4>
                            <p>{currentStudent.platform.device} ({currentStudent.platform.os})</p>
                        </div>
                    )}

                    {currentStudent.funFact && (
                        <div className="detail-group">
                            <h4>Fun Fact</h4>
                            <p>{currentStudent.funFact}</p>
                        </div>
                    )}

                    {currentStudent.personalStatement && (
                        <div className="detail-group">
                            <h4>Personal Statement</h4>
                            <p>{currentStudent.personalStatement}</p>
                        </div>
                    )}

                    {currentStudent.quote?.text && (
                        <div className="detail-group">
                            <h4>Favorite Quote</h4>
                            <p>"{currentStudent.quote.text}"</p>
                            {currentStudent.quote.author && (
                                <p className="quote-author">- {currentStudent.quote.author}</p>
                            )}
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
                                    <h5>{course.dept} {course.num}</h5>
                                    <p className="course-name">{course.name}</p>
                                    <p className="course-reason">{course.reason}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Links Section */}
                {currentStudent.links && (
                    <div className="links-section">
                        <h4>Links</h4>
                        <div className="links-grid">
                            {Object.entries(currentStudent.links).map(([key, value]) => (
                                <a
                                    key={key}
                                    href={value}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="link-item"
                                >
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
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
                            key={student.prefix || index}
                            onClick={() => setCurrentStudentIndex(index)}
                            className={`student-list-item ${
                                index === currentStudentIndex ? 'active' : ''
                            }`}
                        >
                            {getDisplayName(student)}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudentIntroductions;