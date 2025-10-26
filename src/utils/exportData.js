import * as XLSX from 'xlsx';

/**
 * Export Data Utility
 * Handles exporting student evaluation data to CSV and XLSX formats
 * Updated to exclude Lab 4 and include Notes column
 */

/**
 * Formats the current date as MMDDYY
 * @returns {string} - Formatted date string
 */
const getFormattedDate = () => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const year = String(now.getFullYear()).slice(-2);
  return `${month}${day}${year}`;
};

/**
 * Calculates points missing for a student
 * Updated to exclude Lab 4
 * @param {Object} student - Student data object
 * @returns {number} - Total points missing
 */
const calculatePointsMissing = (student) => {
  let missing = 0;

  if (!student.homework) missing += 5;
  if (!student.initialActivity && (student.present || student.late)) missing += 5;

  if (student.present || student.late) {
    if (!student.lab1) missing += 10;
    if (!student.lab2) missing += 10;
    if (!student.lab3) missing += 10;
  }

  return missing;
};

/**
 * Calculates final result for a student
 * @param {Object} student - Student data object
 * @returns {number} - Final result (100 - points missing)
 */
const calculateResult = (student) => {
  return 100 - calculatePointsMissing(student);
};

/**
 * Converts boolean to X or empty string for export
 * @param {boolean} value - Boolean value
 * @returns {string} - 'X' if true, '' if false
 */
const boolToMark = (value) => value ? 'X' : '';

/**
 * Prepares data for export
 * Updated to exclude Lab 4 and include Notes
 * FIXED: Now properly exports P and T columns
 * @param {Array} studentData - Array of student objects
 * @returns {Array} - Array of objects ready for export
 */
const prepareExportData = (studentData) => {
  return studentData.map(student => {
    const exportRow = {
      'Student Name': student.name,
      'P': boolToMark(student.present),
      'T': boolToMark(student.late),
      'H': boolToMark(student.homework),
      'D': boolToMark(student.initialActivity),
      'Lab 1': boolToMark(student.lab1),
      'Lab 2': boolToMark(student.lab2),
      'Lab 3': boolToMark(student.lab3),
      'Points Missing': calculatePointsMissing(student),
      'Result': calculateResult(student),
      'Notes': student.notes || ''
    };

    return exportRow;
  });
};

/**
 * Exports student data to CSV format
 * @param {Array} studentData - Array of student objects
 * @param {string} groupName - Name of the group
 */
export const exportToCSV = (studentData, groupName) => {
  // Prepare data for export
  const exportData = prepareExportData(studentData);

  // Create worksheet from data
  const worksheet = XLSX.utils.json_to_sheet(exportData);

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Evaluations');

  // Generate filename with format: GroupName_MMDDYY.csv
  const filename = `${groupName}_${getFormattedDate()}.csv`;

  // Export to CSV
  XLSX.writeFile(workbook, filename, { bookType: 'csv' });
};

/**
 * Exports student data to XLSX format
 * @param {Array} studentData - Array of student objects
 * @param {string} groupName - Name of the group
 */
export const exportToXLSX = (studentData, groupName) => {
  // Prepare data for export
  const exportData = prepareExportData(studentData);

  // Create worksheet from data
  const worksheet = XLSX.utils.json_to_sheet(exportData);

  // Set column widths for better readability
  worksheet['!cols'] = [
    { wch: 25 }, // Student Name
    { wch: 5 },  // P
    { wch: 5 },  // T
    { wch: 5 },  // H
    { wch: 5 },  // D
    { wch: 8 },  // Lab 1
    { wch: 8 },  // Lab 2
    { wch: 8 },  // Lab 3
    { wch: 15 }, // Points Missing
    { wch: 10 }, // Result
    { wch: 30 }  // Notes
  ];

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Evaluations');

  // Generate filename with format: GroupName_MMDDYY.xlsx
  const filename = `${groupName}_${getFormattedDate()}.xlsx`;

  // Export to XLSX
  XLSX.writeFile(workbook, filename, { bookType: 'xlsx' });
};