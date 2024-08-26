import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DataCleaningComponent({ filePath, onCleanSuccess, disabled }) {
    const [operation, setOperation] = useState('');
    const [column, setColumn] = useState('');
    const [fillValue, setFillValue] = useState('');
    const [condition, setCondition] = useState('');
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

    const handleCleanData = async () => {
        if (disabled) {
            alert('Please upload a file before cleaning data.');
            return;
        }

        const payload = {
            file_path: filePath,
            operation,
            column,
            fill_value: fillValue,
            condition,
        };

        try {
            const response = await axios.post('http://127.0.0.1:5000/clean', payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            onCleanSuccess(response.data.cleaned_file_path);
            alert('Data cleaned successfully');
        } catch (error) {
            console.error('Error cleaning data:', error);
            alert('Failed to clean data');
        }
    };

    return (
        <div className="mb-4">
            <div className="mb-2">
                <select className="form-select" onChange={(e) => setOperation(e.target.value)} value={operation} disabled={disabled}>
                    <option value="">Select Operation</option>
                    <option value="dropna">Drop NA</option>
                    <option value="fillna">Fill NA</option>
                    <option value="filter">Filter</option>
                </select>
            </div>
            <select
                className="form-select mb-2"
                onChange={(e) => setColumn(e.target.value)}
                value={column}
                disabled={disabled || columns.length === 0}
            >
                <option value="">Select Column</option>
                {columns.map((col, index) => (
                    <option key={index} value={col}>{col}</option>
                ))}
            </select>
            {operation === 'fillna' && (
                <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Fill Value"
                    onChange={(e) => setFillValue(e.target.value)}
                    value={fillValue}
                    disabled={disabled}
                />
            )}
            {operation === 'filter' && (
                <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Condition"
                    onChange={(e) => setCondition(e.target.value)}
                    value={condition}
                    disabled={disabled}
                />
            )}
            <button className="btn btn-secondary" onClick={handleCleanData} disabled={disabled}>Clean Data</button>
        </div>
    );
}

export default DataCleaningComponent;
