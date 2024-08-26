import React, { useState } from 'react';
import axios from 'axios';

function UploadComponent({ onUploadSuccess }) {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);  // Handle only one file
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Please select a file before uploading.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://127.0.0.1:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            onUploadSuccess(response.data.file_path);
            alert('File uploaded successfully');
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Failed to upload file');
        }
    };

    return (
        <div className="mb-4">
            <h3>Upload Dataset</h3>
            <div className="input-group">
                <input type="file" className="form-control" onChange={handleFileChange} />
                <button className="btn btn-primary" onClick={handleUpload}>Upload</button>
            </div>
        </div>
    );
}

export default UploadComponent;
