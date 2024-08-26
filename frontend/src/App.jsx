import React, { useState } from 'react';
import UploadComponent from './UploadComponent';
import DataCleaningComponent from './DataCleaningComponent';
import VisualizationComponent from './VisualizationComponent';
import './App.css';

function App() {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [selectedFilePath, setSelectedFilePath] = useState('');
    const [cleanedFilePath, setCleanedFilePath] = useState('');

    const handleUploadSuccess = (filePath) => {
        setUploadedFiles([...uploadedFiles, filePath]); // Add the new file to the list
        setSelectedFilePath(filePath);
        setCleanedFilePath(''); // Reset cleaned file path on new upload
    };

    const handleFileSelect = (event) => {
        setSelectedFilePath(event.target.value);
    };

    const handleCleanSuccess = (filePath) => {
        setCleanedFilePath(filePath);
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-5">Data Analysis App</h1>
            <UploadComponent onUploadSuccess={handleUploadSuccess} />

            {uploadedFiles.length > 0 && (
                <div className="mb-4">
                    <label>Select File:</label>
                    <select className="form-select" value={selectedFilePath} onChange={handleFileSelect}>
                        {uploadedFiles.map((file, index) => (
                            <option key={index} value={file}>
                                {file.split('/').pop()}
                            </option>
                        ))}
                    </select>
                </div>
            )}
                    <h3>Data Cleaning</h3>
                    <DataCleaningComponent
                        filePath={selectedFilePath}
                        onCleanSuccess={handleCleanSuccess}
                        disabled={!selectedFilePath}
                    />

                    <h3>Data Visualization</h3>
                    <VisualizationComponent
                        filePath={cleanedFilePath || selectedFilePath} // Use cleaned file path if available, otherwise use uploaded file
                        disabled={!selectedFilePath}
                    />
        </div>
    );
}

export default App;
