# 📚 Student Evaluation System

Version 1.0.1 - Fixed P and T export issue

## ✨ Features

- Upload student lists from .txt files
- Dynamic grading table with checkboxes
- Automatic point calculations
- Notes column (50 characters max)
- Export to CSV/XLSX with all data preserved
- Responsive design

## 🎯 Grading System

- P (Present): Enables all columns
- T (Late): Enables all except D
- H (Homework): 5 points
- D (Initial Activity): 5 points
- Lab 1-3: 10 points each
- Total: 100 points

## 🚀 Quick Start

```bash
npm install
npm run dev
```

## 📊 Export Format

Files are named: `{GroupName}_{MMDDYY}.csv` or `.xlsx`

All columns including P and T are properly exported.

## 🔧 Version 1.0.1 Changes

- Fixed P and T columns not exporting correctly
- Improved state management between components
- Better data flow for exports
