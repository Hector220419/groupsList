import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import Table from './components/Table';
import { exportToCSV, exportToXLSX } from './utils/exportData';
import './App.css';

/**
 * Main App Component
 * Manages the overall state and coordinates between FileUpload and Table components
 */
function App() {
  // State for storing group name and student list
  const [groupName, setGroupName] = useState('');
  const [students, setStudents] = useState([]);
  const [studentData, setStudentData] = useState([]);

  /**
   * Handles file upload from FileUpload component
   * Updates state with group name and student list
   */
  const handleFileUpload = (uploadedGroupName, uploadedStudents) => {
    setGroupName(uploadedGroupName);
    setStudents(uploadedStudents);

    // Initialize student data with default values
    const initialData = uploadedStudents.map(name => ({
      name,
      present: false,
      late: false,
      homework: true,
      initialActivity: true,
      lab1: true,
      lab2: true,
      lab3: true,
      notes: '',
    }));
    setStudentData(initialData);
  };

  /**
   * Handles CSV export
   */
  const handleExportCSV = () => {
    if (studentData.length === 0) {
      alert('No data to export');
      return;
    }
    exportToCSV(studentData, groupName);
  };

  /**
   * Handles XLSX export
   */
  const handleExportXLSX = () => {
    if (studentData.length === 0) {
      alert('No data to export');
      return;
    }
    exportToXLSX(studentData, groupName);
  };

  /**
   * Receives updated student data from Table component
   */
  const handleStudentDataUpdate = (updatedData) => {
    setStudentData(updatedData);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>📚 Student Evaluation System</h1>
        {groupName && <div className="group-name">Group: {groupName}</div>}
        <p>Upload a student list and track attendance & activities</p>
      </header>

      {/* Show FileUpload component if no students loaded */}
      {students.length === 0 ? (
        <FileUpload onFileUpload={handleFileUpload} />
      ) : (
        <>
          {/* Show Table component with student data */}
          <Table 
            students={students} 
            onDataUpdate={handleStudentDataUpdate}
          />

          {/* Export buttons */}
          <div className="export-section">
            <button className="export-btn" onClick={handleExportCSV}>
              📄 Export to CSV
            </button>
            <button className="export-btn" onClick={handleExportXLSX}>
              📊 Export to Excel
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;