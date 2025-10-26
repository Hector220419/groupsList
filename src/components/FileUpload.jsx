import React, { useRef } from 'react';
import './FileUpload.css';

const FileUpload = ({ onFileUpload }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (!file.name.endsWith('.txt')) {
      alert('Please upload a .txt file');
      return;
    }

    const groupName = file.name.replace('.txt', '');

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const students = content
        .split('\n')
        .map(name => name.trim())
        .filter(name => name.length > 0);

      if (students.length === 0) {
        alert('The file is empty or contains no valid student names');
        return;
      }

      onFileUpload(groupName, students);
    };

    reader.onerror = () => {
      alert('Error reading file. Please try again.');
    };

    reader.readAsText(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="file-upload-container">
      <div className="upload-box">
        <div className="upload-icon">📁</div>
        <h3>Upload Student List</h3>
        <p>Select a .txt file with one student name per line</p>
        <p className="file-hint">The filename will be used as the group name</p>

        <input
          ref={fileInputRef}
          type="file"
          accept=".txt"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        <button className="upload-btn" onClick={handleButtonClick}>
          Choose File
        </button>
      </div>
    </div>
  );
};

export default FileUpload;