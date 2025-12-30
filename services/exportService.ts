
import JSZip from 'jszip';

export const bundleProjectForMarketplace = async (files: Record<string, string>) => {
  const zip = new JSZip();

  // Add source files to the bundle
  Object.entries(files).forEach(([path, content]) => {
    zip.file(path, content);
  });

  const packageJson = {
    "name": "lexiscan-ai-enterprise",
    "private": true,
    "version": "6.0.0",
    "type": "module",
    "scripts": {
      "dev": "vite",
      "build": "tsc && vite build",
      "preview": "vite preview"
    },
    "dependencies": {
      "react": "^19.0.0",
      "react-dom": "^19.0.0",
      "lucide-react": "^0.562.0",
      "@google/genai": "^1.34.0",
      "jszip": "^3.10.1"
    },
    "devDependencies": {
      "@types/react": "^19.0.0",
      "@types/react-dom": "^19.0.0",
      "typescript": "~5.6.2",
      "vite": "^6.0.0",
      "tailwindcss": "^3.4.1",
      "postcss": "^8.4.0",
      "autoprefixer": "^10.4.0"
    }
  };
  zip.file('package.json', JSON.stringify(packageJson, null, 2));

  // Use a text-based gitignore to avoid Windows 0x80004005 extraction issues with dotfiles
  zip.file('gitignore_template.txt', "node_modules\ndist\n.env*\n.DS_Store\n*.zip");

  const readme = `# 🛡️ LexiScan AI - Enterprise Source Bundle (v6.0)

Congratulations on acquiring the professional source bundle for LexiScan AI. This document provides a simplified, step-by-step guide to getting your local instance running.

---

## 📋 Prerequisites
Before you begin, ensure you have the following installed on your machine:
1. **Node.js (v18 or higher)**: Download from [nodejs.org](https://nodejs.org/)
2. **A Text Editor**: We recommend [VS Code](https://code.visualstudio.com/)
3. **Google Gemini API Key**: Obtain a free key at [aistudio.google.com](https://aistudio.google.com/app/apikey)

---

## 🚀 Quick-Start Installation

### 1. Extraction
- Right-click the ZIP file and select **Extract All**.
- **Windows User Note**: If you encounter a "0x80004005" error, please use **7-Zip** or **WinRAR** to extract the files.

### 2. Environment Setup
- Inside the project folder, rename the file \`gitignore_template.txt\` to \`.gitignore\`.
- Create a new file named \`.env\` in the root folder.
- Add your API key to the \`.env\` file like this:
  \`\`\`env
  VITE_API_KEY=your_actual_key_here
  \`\`\`

### 3. Terminal Commands
Open your terminal (Command Prompt or PowerShell) inside the project folder and run:
\`\`\`bash
# Install all required software libraries
npm install

# Start the local development server
npm run dev
\`\`\`
Your app will now be running at \`http://localhost:5173\`.

---

## 🔑 Administrative Notes
Access to the Creator Studio and software activation are handled via secure internal logic. Please refer to your acquisition documentation for the current master access keys and licensing algorithms. 

To maintain security:
- **Do not** share your source code bundle with unauthorized parties.
- **Do not** modify the verification logic in \`App.tsx\` unless you are updating your internal security protocols.

---

## 🛠️ Troubleshooting
- **API Errors**: Ensure your API key is correct and has a "Paid" tier or is within the "Free" tier limits.
- **Module Not Found**: Run \`npm install\` again to ensure all dependencies are properly downloaded.
- **Port Conflict**: If 5173 is in use, Vite will automatically try 5174.

## 📄 License
This source code is provided for private enterprise use and professional deployment. All rights reserved.
`;
  zip.file('README.md', readme);

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'LexiScan_AI_Enterprise_Bundle.zip';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
