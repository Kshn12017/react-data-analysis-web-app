import React, { useState, useEffect } from 'react';
import axios from 'axios';

function VisualizationComponent({ filePath, disabled }) {
    const [chartType, setChartType] = useState('');
    const [xColumn, setXColumn] = useState('');
    const [yColumn, setYColumn] = useState('');
    const [imageSrc, setImageSrc] = useState('');
    const [columns, setColumns] = useState([]);

    useEffect(() => {
        if (filePath) {
            axios.post('http://127.0.0.1:5000/columns', { file_path: filePath })
                .then(response => {
                    setColumns(response.data.columns);
                })
                .catch(error => {
                    console.error('Error fetching columns:', error);
                });
        }
    }, [filePath]);

    const handleGenerateChart = async () => {
        if (disabled) {
            alert('Please upload a file before generating a chart.');
            return;
        }

        const payload = {
            file_path: filePath,
            chart_type: chartType,
            x_column: xColumn,
            y_column: yColumn,
        };

        try {
            const response = await axios.post('http://127.0.0.1:5000/visualize', payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
                responseType: 'blob',
            });
            const imageBlob = new Blob([response.data], { type: 'image/png' });
            const imageUrl = URL.createObjectURL(imageBlob);
            setImageSrc(imageUrl);
            alert('Chart generated successfully');
        } catch (error) {
            console.error('Error generating chart:', error);
            alert('Failed to generate chart');
        }
    };

    return (
        <div className="mb-4">
            <div className="mb-2">
                <select className="form-select" onChange={(e) => setChartType(e.target.value)} value={chartType} disabled={disabled}>
                    <option value="">Select Chart Type</option>
                    <option value="bar">Bar Chart</option>
                    <option value="line">Line Chart</option>
                    <option value="scatter">Scatter Plot</option>
                    <option value="histogram">Histogram</option>
                </select>
            </div>
            <select
                className="form-select mb-2"
                onChange={(e) => setXColumn(e.target.value)}
                value={xColumn}
                disabled={disabled || columns.length === 0}
            >
                <option value="">Select X Column</option>
                {columns.map((col, index) => (
                    <option key={index} value={col}>{col}</option>
                ))}
            </select>
            {chartType !== 'histogram' && (
                <select
                    className="form-select mb-2"
                    onChange={(e) => setYColumn(e.target.value)}
                    value={yColumn}
                    disabled={disabled || columns.length === 0}
                >
                    <option value="">Select Y Column</option>
                    {columns.map((col, index) => (
                        <option key={index} value={col}>{col}</option>
                    ))}
                </select>
            )}
            <button className="btn btn-success" onClick={handleGenerateChart} disabled={disabled}>
                Generate Chart
            </button>
            {imageSrc && (
                <div className="mt-3">
                    <img src={imageSrc} alt="Generated Chart" className="img-fluid" />
                </div>
            )}
        </div>
    );
}

export default VisualizationComponent;
