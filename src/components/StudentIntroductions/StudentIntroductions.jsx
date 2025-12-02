import React, { useState, useEffect } from 'react';
import './StudentIntroductions.css';

const StudentIntroductions = () => {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
    
    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        name: true,
        mascot: true,
        image: true, // Default to true since images are available
        personalStatement: true,
        backgrounds: true,
        classes: true,
        extraInfo: true,
        quote: true,
        links: true
    });

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
                setFilteredStudents(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    // Apply filters and search whenever they change
    useEffect(() => {
        if (students.length === 0) return;
        
        let result = [...students];
        
        // Apply search filter
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            result = result.filter(student => {
                const fullName = `${student.name.first} ${student.name.last}`.toLowerCase();
                const preferredName = student.name.preferred?.toLowerCase() || '';
                return fullName.includes(term) || preferredName.includes(term);
            });
        }
        
        setFilteredStudents(result);
        
        // Reset current index if it's out of bounds
        if (currentStudentIndex >= result.length) {
            setCurrentStudentIndex(Math.max(0, result.length - 1));
        }
    }, [searchTerm, students, currentStudentIndex]);

    // Navigation functions
    const nextStudent = () => {
        setCurrentStudentIndex((prevIndex) => 
            prevIndex === filteredStudents.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevStudent = () => {
        setCurrentStudentIndex((prevIndex) => 
            prevIndex === 0 ? filteredStudents.length - 1 : prevIndex - 1
        );
    };

    const goToStudent = (index) => {
        if (index >= 0 && index < filteredStudents.length) {
            setCurrentStudentIndex(index);
        }
    };

    // Filter toggle handler
    const handleFilterChange = (filterName) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: !prev[filterName]
        }));
    };

    // Search handler
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentStudentIndex(0); // Reset to first student when searching
    };

    // Clear all filters
    const clearFilters = () => {
        setSearchTerm('');
        setFilters({
            name: true,
            mascot: true,
            image: true,
            personalStatement: true,
            backgrounds: true,
            classes: true,
            extraInfo: true,
            quote: true,
            links: true
        });
    };

    // Helper functions
    const getDisplayName = (student) => {
        const name = student.name;
        return `${name.first} ${name.last}`;
    };

    const getPreferredName = (student) => {
        return student.name.preferred || '';
    };

    const getMascot = (student) => {
        return student.mascot || '';
    };

    // Function to get full image URL
    const getImageUrl = (student) => {
        if (student.image) {
            // Check if it's already a full URL
            if (student.image.startsWith('http')) {
                return student.image;
            }
            // Prepend the base URL to the relative path
            return `https://dvonb.xyz${student.image}`;
        }
        return null;
    };

    // Function to get initials for avatar fallback
    const getInitials = (student) => {
        const first = student.name.first.charAt(0);
        const last = student.name.last.charAt(0);
        return `${first}${last}`.toUpperCase();
    };

    // Function to handle image loading errors
    const handleImageError = (e) => {
        e.target.style.display = 'none';
        const initialsContainer = e.target.nextSibling;
        if (initialsContainer) {
            initialsContainer.style.display = 'flex';
        }
    };

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

    const currentStudent = filteredStudents[currentStudentIndex];
    const imageUrl = getImageUrl(currentStudent);

    return (
        <div className="student-introductions">
            <header className="page-header">
                <h1>Class Introductions</h1>
                <p>ITIS 3135 - Fall 2025</p>
            </header>

            {/* Search and Filter Controls */}
            <div className="controls-container">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search students by name..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="search-input"
                    />
                    {searchTerm && (
                        <button onClick={() => setSearchTerm('')} className="clear-search">
                            ✕
                        </button>
                    )}
                </div>

                <div className="results-counter">
                    Showing {filteredStudents.length} of {students.length} students
                </div>

                <div className="filters-section">
                    <h3>Display Options</h3>
                    <div className="filters-grid">
                        {Object.entries(filters).map(([key, value]) => (
                            <label key={key} className="filter-checkbox">
                                <input
                                    type="checkbox"
                                    checked={value}
                                    onChange={() => handleFilterChange(key)}
                                />
                                <span className="filter-label">
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                </span>
                            </label>
                        ))}
                    </div>
                    <button onClick={clearFilters} className="clear-filters-btn">
                        Clear All Filters
                    </button>
                </div>
            </div>

            {/* Slideshow Container */}
            <div className="slideshow-container">
                {filteredStudents.length > 0 ? (
                    <>
                        {/* Single Student View */}
                        <div className="student-card slideshow-item">
                            <div className="student-header">
                                {/* Image Section */}
                                {filters.image && imageUrl && (
                                    <div className="student-image-container">
                                        <img
                                            src={imageUrl}
                                            alt={`${getDisplayName(currentStudent)}`}
                                            className="student-image"
                                            onError={handleImageError}
                                        />
                                        <div className="student-initials">
                                            {getInitials(currentStudent)}
                                        </div>
                                    </div>
                                )}
                                
                                <div className="student-info">
                                    {filters.name && (
                                        <h2>
                                            {getDisplayName(currentStudent)}
                                            {getPreferredName(currentStudent) && (
                                                <span className="preferred-name"> "{getPreferredName(currentStudent)}"</span>
                                            )}
                                        </h2>
                                    )}
                                    
                                    {filters.mascot && getMascot(currentStudent) && (
                                        <div className="student-mascot">
                                            {getMascot(currentStudent)}
                                        </div>
                                    )}
                                    
                                    {/* Email always shown */}
                                    <p className="student-email">
                                        <strong>Email:</strong> {currentStudent.prefix}@charlotte.edu
                                    </p>
                                </div>
                            </div>

                            <div className="student-details">
                                {/* Contact Information - Links only, email moved to header */}
                                {currentStudent.links?.charlotte && (
                                    <div className="detail-group">
                                        <h4>Website</h4>
                                        <p>
                                            <a href={currentStudent.links.charlotte} target="_blank" rel="noopener noreferrer">
                                                {currentStudent.links.charlotte}
                                            </a>
                                        </p>
                                    </div>
                                )}

                                {filters.backgrounds && (
                                    <>
                                        {currentStudent.backgrounds?.academic && (
                                            <div className="detail-group">
                                                <h4>Academic Background</h4>
                                                <p>{currentStudent.backgrounds.academic}</p>
                                            </div>
                                        )}

                                        {currentStudent.backgrounds?.professional && (
                                            <div className="detail-group">
                                                <h4>Professional Background</h4>
                                                <p>{currentStudent.backgrounds.professional}</p>
                                            </div>
                                        )}

                                        {currentStudent.backgrounds?.personal && (
                                            <div className="detail-group">
                                                <h4>Personal Background</h4>
                                                <p>{currentStudent.backgrounds.personal}</p>
                                            </div>
                                        )}
                                    </>
                                )}

                                {filters.extraInfo && currentStudent.platform?.device && (
                                    <div className="detail-group">
                                        <h4>Primary Computer</h4>
                                        <p>{currentStudent.platform.device} ({currentStudent.platform.os})</p>
                                    </div>
                                )}

                                {filters.extraInfo && currentStudent.funFact && (
                                    <div className="detail-group">
                                        <h4>Fun Fact</h4>
                                        <p>{currentStudent.funFact}</p>
                                    </div>
                                )}

                                {filters.personalStatement && currentStudent.personalStatement && (
                                    <div className="detail-group">
                                        <h4>Personal Statement</h4>
                                        <p>{currentStudent.personalStatement}</p>
                                    </div>
                                )}

                                {filters.quote && currentStudent.quote?.text && (
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
                            {filters.classes && currentStudent.courses && currentStudent.courses.length > 0 && (
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
                            {filters.links && currentStudent.links && Object.keys(currentStudent.links).length > 0 && (
                                <div className="links-section">
                                    <h4>Links</h4>
                                    <div className="links-grid">
                                        {Object.entries(currentStudent.links).map(([key, value]) => {
                                            // Skip charlotte link since it's shown above
                                            if (key === 'charlotte') return null;
                                            return (
                                                <a
                                                    key={key}
                                                    href={value}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="link-item"
                                                >
                                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                                </a>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Slideshow Navigation Controls */}
                        <div className="slideshow-controls">
                            <button onClick={prevStudent} className="slideshow-button prev-button">
                                ◀ Previous
                            </button>
                            
                            <div className="slideshow-info">
                                <span className="slideshow-position">
                                    Student {currentStudentIndex + 1} of {filteredStudents.length}
                                </span>
                                <div className="slideshow-dots">
                                    {filteredStudents.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => goToStudent(index)}
                                            className={`slideshow-dot ${index === currentStudentIndex ? 'active' : ''}`}
                                            aria-label={`Go to student ${index + 1}`}
                                        />
                                    ))}
                                </div>
                            </div>
                            
                            <button onClick={nextStudent} className="slideshow-button next-button">
                                Next ▶
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="no-results">
                        <h3>No students found</h3>
                        <p>Try adjusting your search or filters</p>
                    </div>
                )}
            </div>

            {/* Quick Navigation */}
            <div className="quick-nav">
                <h4>Quick Navigation ({filteredStudents.length} students)</h4>
                <div className="student-list">
                    {filteredStudents.map((student, index) => (
                        <button
                            key={student.prefix || index}
                            onClick={() => goToStudent(index)}
                            className={`student-list-item ${
                                index === currentStudentIndex ? 'active' : ''
                            }`}
                        >
                            {getDisplayName(student)}
                            {getPreferredName(student) && ` (${getPreferredName(student)})`}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudentIntroductions;