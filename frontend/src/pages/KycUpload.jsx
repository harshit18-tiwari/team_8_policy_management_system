import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../api';

function KycUpload({ user, setView }) {
    const [documents, setDocuments] = useState([]);
    const [documentType, setDocumentType] = useState('AADHAR');
    const [documentNumber, setDocumentNumber] = useState('');
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        loadDocuments();
    }, []);

    const loadDocuments = async () => {
        const res = await fetchWithAuth('/kyc/my-documents');
        setDocuments(await res.json());
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            alert("Please select a file");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('document', file);
        formData.append('documentType', documentType);
        formData.append('documentNumber', documentNumber);

        try {
            const res = await fetchWithAuth('/kyc/upload', {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                alert("Document uploaded successfully!");
                setFile(null);
                setDocumentNumber('');
                loadDocuments();
            } else {
                const data = await res.json();
                alert(data.error || "Upload failed");
            }
        } catch (err) {
            alert("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const getStatusBadge = (status) => {
        const colors = {
            'PENDING': 'badge-warning',
            'VERIFIED': 'badge-success',
            'REJECTED': 'badge-danger'
        };
        return colors[status] || 'badge-secondary';
    };

    return (
        <div>
            <h2>KYC Document Upload</h2>
            <p>Upload your identity documents for verification</p>

            <div className="card">
                <h3>Upload New Document</h3>
                <form onSubmit={handleSubmit}>
                    <label>Document Type:</label>
                    <select value={documentType} onChange={e => setDocumentType(e.target.value)}>
                        <option value="AADHAR">Aadhar Card</option>
                        <option value="PAN">PAN Card</option>
                        <option value="LICENSE">Driving License</option>
                        <option value="PASSPORT">Passport</option>
                    </select>

                    <label>Document Number:</label>
                    <input
                        type="text"
                        value={documentNumber}
                        onChange={e => setDocumentNumber(e.target.value)}
                        placeholder="Enter document number"
                        required
                    />

                    <label>Upload Document (PDF/Image):</label>
                    <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={e => setFile(e.target.files[0])}
                        required
                    />

                    <button type="submit" disabled={uploading}>
                        {uploading ? 'Uploading...' : 'Upload Document'}
                    </button>
                    <button type="button" className="secondary" onClick={() => setView('dashboard')}>
                        Back to Dashboard
                    </button>
                </form>
            </div>

            <div className="card">
                <h3>My Documents</h3>
                {documents.length === 0 ? (
                    <p>No documents uploaded yet.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Document Type</th>
                                <th>Document Number</th>
                                <th>Status</th>
                                <th>Uploaded On</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documents.map(doc => (
                                <tr key={doc.id}>
                                    <td>{doc.document_type}</td>
                                    <td>{doc.document_number || 'N/A'}</td>
                                    <td>
                                        <span className={`badge ${getStatusBadge(doc.status)}`}>
                                            {doc.status}
                                        </span>
                                    </td>
                                    <td>{new Date(doc.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default KycUpload;
