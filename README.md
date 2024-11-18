# Excel Merger with AI Analysis

A Next.js application that allows users to merge multiple Excel files and provides AI-powered analysis of the merged data.

## Features

- Merge multiple Excel (.xlsx, .xls) files
- AI-powered analysis of merged data
- Professional table view of merged content
- Download merged files with analysis
- Progress tracking during merge operations
- Responsive UI with modern design

## Prerequisites

Before running this project, make sure you have:

- Node.js 18+ installed
- RapidAPI key for ChatGPT integration
- npm or yarn package manager

## Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd merge-excel
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory:

```plaintext
RAPIDAPI_KEY=your_rapidapi_key_here
```

## Running the Application

1. Start the development server:
```bash
npm run dev
# or
yarn dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Use

1. Click "Select Excel Files" to choose multiple Excel files
2. Only .xlsx and .xls files are supported
3. Select at least 2 files for merging
4. Click "Merge Files" to start the process
5. View the merged data in the table below
6. Read the AI-generated analysis of your data
7. Download the merged Excel file including the analysis

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- shadcn/ui components
- XLSX for Excel processing
- RapidAPI ChatGPT for analysis

## Project Structure

- `/src/components` - React components
- `/src/lib` - Utility functions and API integrations
- `/src/actions` - Server actions for file processing
- `/src/hooks` - Custom React hooks

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.