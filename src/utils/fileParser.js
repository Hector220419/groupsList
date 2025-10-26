export const parseStudentFile = (file) => {
  return new Promise((resolve, reject) => {
    if (!file.name.endsWith('.txt')) {
      reject(new Error('Invalid file type. Please upload a .txt file.'));
      return;
    }

    const groupName = file.name.replace('.txt', '');
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const content = event.target.result;
        const students = content
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0);

        if (students.length === 0) {
          reject(new Error('File is empty or contains no valid student names.'));
          return;
        }

        resolve({ groupName, students });
      } catch (error) {
        reject(new Error('Error parsing file content.'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Error reading file.'));
    };

    reader.readAsText(file);
  });
};

export const validateStudentName = (name) => {
  return name && name.trim().length > 0 && /[a-zA-Z]/.test(name);
};