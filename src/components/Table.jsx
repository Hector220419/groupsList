import React, { useState, useEffect } from 'react';
import './Table.css';

/**
 * Table Component
 * Displays the student evaluation table with interactive checkboxes
 * Handles all the grading logic and point calculations
 * Now includes a Notes column for custom annotations (max 50 characters)
 */
const Table = ({ students, onDataUpdate }) => {
  // State to store each student's evaluation data
  const [studentData, setStudentData] = useState([]);

  /**
   * Initialize student data when students prop changes
   * Default state: all work checkboxes checked, attendance unchecked
   */
  useEffect(() => {
    const initialData = students.map(name => ({
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
  }, [students]);

  /**
   * Update parent component whenever studentData changes
   */
  useEffect(() => {
    if (studentData.length > 0 && onDataUpdate) {
      onDataUpdate(studentData);
    }
  }, [studentData, onDataUpdate]);

  /**
   * Handles checkbox changes for a specific student
   * Implements the logic for P/T mutual exclusivity and enabling/disabling columns
   */
  const handleCheckboxChange = (index, field) => {
    setStudentData(prevData => {
      const newData = [...prevData];
      const student = { ...newData[index] };

      // Handle Present (P) checkbox
      if (field === 'present') {
        student.present = !student.present;
        // If Present is checked, uncheck Late (mutual exclusivity)
        if (student.present) {
          student.late = false;
        }
      }
      // Handle Late (T) checkbox
      else if (field === 'late') {
        student.late = !student.late;
        // If Late is checked, uncheck Present and disable Initial Activity
        if (student.late) {
          student.present = false;
          student.initialActivity = false;
        }
      }
      // Handle other checkboxes
      else {
        student[field] = !student[field];
      }

      newData[index] = student;
      return newData;
    });
  };

  /**
   * Handles notes input changes
   * Limits input to 50 characters
   */
  const handleNotesChange = (index, value) => {
    const limitedValue = value.slice(0, 50);

    setStudentData(prevData => {
      const newData = [...prevData];
      newData[index] = { ...newData[index], notes: limitedValue };
      return newData;
    });
  };

  /**
   * Calculates points missing for a student
   * Returns the total points lost based on unchecked boxes
   * Updated to exclude Lab 4
   */
  const calculatePointsMissing = (student) => {
    let missing = 0;

    if (!student.homework) missing += 5;
    if (!student.initialActivity && (student.present || student.late)) missing += 5;

    if ((student.present || student.late)) {
      if (!student.lab1) missing += 10;
      if (!student.lab2) missing += 10;
      if (!student.lab3) missing += 10;
    }

    return missing;
  };

  /**
   * Calculates final result for a student
   * Result = 100 - Points Missing
   */
  const calculateResult = (student) => {
    return 100 - calculatePointsMissing(student);
  };

  /**
   * Determines if a checkbox should be disabled
   * Based on attendance status (Present or Late)
   */
  const isDisabled = (student, field) => {
    const hasAttendance = student.present || student.late;

    if (field === 'initialActivity') {
      return !hasAttendance || student.late;
    }

    if (['lab1', 'lab2', 'lab3'].includes(field)) {
      return !hasAttendance;
    }

    return false;
  };

  return (
    <div className="table-container">
      <div className="table-wrapper">
        <table className="evaluation-table">
          <thead>
            <tr>
              <th className="sticky-col">Student Name</th>
              <th className="attendance-col" title="Present - Enables all columns">P</th>
              <th className="attendance-col" title="Late - Enables all except Initial Activity">T</th>
              <th title="Homework - 5 points">H</th>
              <th title="Initial Activity - 5 points">D</th>
              <th title="Lab 1 - 10 points">Lab 1</th>
              <th title="Lab 2 - 10 points">Lab 2</th>
              <th title="Lab 3 - 10 points">Lab 3</th>
              <th className="points-col">Points Missing</th>
              <th className="result-col">Result</th>
              <th className="notes-col">Notes</th>
            </tr>
          </thead>
          <tbody>
            {studentData.map((student, index) => {
              const pointsMissing = calculatePointsMissing(student);
              const result = calculateResult(student);

              return (
                <tr key={index}>
                  <td className="sticky-col student-name">{student.name}</td>

                  <td className="attendance-col">
                    <input
                      type="checkbox"
                      checked={student.present}
                      onChange={() => handleCheckboxChange(index, 'present')}
                      className="checkbox"
                    />
                  </td>

                  <td className="attendance-col">
                    <input
                      type="checkbox"
                      checked={student.late}
                      onChange={() => handleCheckboxChange(index, 'late')}
                      className="checkbox"
                    />
                  </td>

                  <td>
                    <input
                      type="checkbox"
                      checked={student.homework}
                      onChange={() => handleCheckboxChange(index, 'homework')}
                      className="checkbox"
                    />
                  </td>

                  <td>
                    <input
                      type="checkbox"
                      checked={student.initialActivity}
                      onChange={() => handleCheckboxChange(index, 'initialActivity')}
                      disabled={isDisabled(student, 'initialActivity')}
                      className="checkbox"
                    />
                  </td>

                  <td>
                    <input
                      type="checkbox"
                      checked={student.lab1}
                      onChange={() => handleCheckboxChange(index, 'lab1')}
                      disabled={isDisabled(student, 'lab1')}
                      className="checkbox"
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={student.lab2}
                      onChange={() => handleCheckboxChange(index, 'lab2')}
                      disabled={isDisabled(student, 'lab2')}
                      className="checkbox"
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={student.lab3}
                      onChange={() => handleCheckboxChange(index, 'lab3')}
                      disabled={isDisabled(student, 'lab3')}
                      className="checkbox"
                    />
                  </td>

                  <td className="points-col points-missing">
                    {pointsMissing}
                  </td>

                  <td className={`result-col ${result >= 70 ? 'pass' : 'fail'}`}>
                    {result}
                  </td>

                  <td className="notes-col">
                    <input
                      type="text"
                      value={student.notes}
                      onChange={(e) => handleNotesChange(index, e.target.value)}
                      placeholder="Add note..."
                      maxLength={50}
                      className="notes-input"
                      title={`${student.notes.length}/50 characters`}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;