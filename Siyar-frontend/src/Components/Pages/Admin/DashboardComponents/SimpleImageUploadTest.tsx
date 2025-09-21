import React, { useState } from 'react';
import { useUploadImageMutation } from '../../../../Redux/api/imageApi';
import { FaUpload, FaCheck, FaExclamationTriangle } from 'react-icons/fa';

const SimpleImageUploadTest: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<any>(null);
  
  const [uploadImage, { isLoading, error }] = useUploadImageMutation();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const formData = new FormData();
      formData.append('myfile', selectedFile);

      console.log('Uploading file:', selectedFile.name);
      const result = await uploadImage(formData).unwrap();
      console.log('Upload result:', result);
      
      setUploadResult(result);
    } catch (err: any) {
      console.error('Upload failed:', err);
      setUploadResult({ error: err });
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('URL copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-2xl mx-auto">
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title flex items-center gap-2">
            <FaUpload className="text-primary" />
            Simple Image Upload Test
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text">Select Image File</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="file-input file-input-bordered w-full"
                disabled={isLoading}
              />
            </div>

            {selectedFile && (
              <div className="alert alert-info">
                <div>
                  <strong>Selected:</strong> {selectedFile.name}
                  <br />
                  <strong>Size:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  <br />
                  <strong>Type:</strong> {selectedFile.type}
                </div>
              </div>
            )}

            <button
              className="btn btn-primary w-full"
              onClick={handleUpload}
              disabled={!selectedFile || isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Uploading to Cloudinary...
                </>
              ) : (
                <>
                  <FaUpload />
                  Upload to Cloudinary
                </>
              )}
            </button>

            {error && (
              <div className="alert alert-error">
                <FaExclamationTriangle />
                <div>
                  <strong>Upload Failed:</strong>
                  <pre className="text-xs mt-2 overflow-auto">
                    {JSON.stringify(error, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {uploadResult && !uploadResult.error && (
              <div className="alert alert-success">
                <FaCheck />
                <div className="w-full">
                  <strong>Upload Successful!</strong>
                  <div className="mt-2 space-y-2">
                    <div>
                      <strong>Live URL:</strong>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="text"
                          value={uploadResult.data?.file_url || ''}
                          readOnly
                          className="input input-sm input-bordered flex-1 text-xs"
                        />
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => copyToClipboard(uploadResult.data?.file_url || '')}
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-xs">
                      <strong>Public ID:</strong> {uploadResult.data?.public_id}
                      <br />
                      <strong>File Size:</strong> {uploadResult.data?.file_size} bytes
                      <br />
                      <strong>File Type:</strong> {uploadResult.data?.file_type}
                    </div>

                    {uploadResult.data?.file_url && (
                      <div className="mt-4">
                        <strong>Preview:</strong>
                        <div className="mt-2">
                          <img
                            src={uploadResult.data.file_url}
                            alt="Uploaded"
                            className="max-w-full max-h-48 object-contain border rounded"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {uploadResult?.error && (
              <div className="alert alert-error">
                <FaExclamationTriangle />
                <div>
                  <strong>Upload Error:</strong>
                  <pre className="text-xs mt-2 overflow-auto">
                    {JSON.stringify(uploadResult.error, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleImageUploadTest;
