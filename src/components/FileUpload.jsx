import React, { useState } from 'react';
import { uploadFiles } from '../../api.js'; // 🔗 Master API bridge

const FileUpload = ({ onFileSelected }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      // 🌐 Use the centralized bridge. 
      // The bridge handles the token and URL, and the interceptor handles 401 errors.
      const result = await uploadFiles('upload', formData); 
      
      if (result) {
        console.log("File uploaded successfully!");
        onFileSelected(selectedFile, result.data); 
      }
    } catch (error) {
      console.error("Upload error details:", error);
      alert("Upload failed: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6 border-2 border-dashed border-gray-700 rounded-lg text-center bg-[#1a2035]">
      <h3 className="text-lg font-semibold mb-2">Upload File</h3>
      <input type="file" onChange={handleFileChange} disabled={isUploading} />
      {isUploading && (
        <p className="text-blue-400 mt-2 text-sm animate-pulse">
          AI is analyzing your file... this might take a few seconds.
        </p>
      )}
    </div>
  );
};

export default FileUpload;