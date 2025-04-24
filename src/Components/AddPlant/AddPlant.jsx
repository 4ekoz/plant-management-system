import React, { useState, useRef } from 'react';
import styles from './AddPlant.module.css';
import { FaBars } from 'react-icons/fa';

export default function AddPlant() {
    const [uploadedImage, setUploadedImage] = useState(null);
    const inputRef = useRef(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file) => {
        if (file.size > 20 * 1024 * 1024) {
            alert('File size should not exceed 20MB');
            return;
        }
        const imageUrl = URL.createObjectURL(file);
        setUploadedImage(imageUrl);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <>
            {/* Sidebar Toggle Button - Only shows on mobile */}
            <button className={styles.sidebarToggle} onClick={toggleSidebar}>
                <FaBars />
            </button>

            {/* Overlay - Only shows on mobile when sidebar is open */}
            <div
                className={`${styles.overlay} ${isSidebarOpen ? styles.show : ''}`}
                onClick={() => setIsSidebarOpen(false)}
            />

            {/* Sidebar */}
            <div className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
                {/* Your existing sidebar content */}
            </div>

            {/* Main Content */}
            <div className={styles.updateContent}>
                <h1>Add New Plant</h1>

                <div className={styles.formSection}>
                    <div className={styles.inputRow}>
                        <div className={styles.formGroup}>
                            <label>Name</label>
                            <input type="text" placeholder="Enter Plant Name" />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Scientific Name</label>
                            <input type="text" placeholder="Enter Plant Scientific Name" />
                        </div>
                    </div>

                    <div className={styles.inputRow}>
                        <div className={styles.formGroup}>
                            <label>Category</label>
                            <input type="text" placeholder="Enter your category" />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Origin</label>
                            <input type="text" placeholder="Enter your origin" />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Description</label>
                        <input type="text" placeholder="Enter your description" />
                    </div>

                    <div className={styles.inputRow}>
                        <div className={styles.formGroup}>
                            <label>Watering Frequency</label>
                            <input type="text" placeholder="Enter your water frequency" />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Soil Type</label>
                            <input type="text" placeholder="Enter your data" />
                        </div>
                    </div>

                    <div className={styles.inputRow}>
                        <div className={styles.formGroup}>
                            <label>Temperature Range (Max)</label>
                            <input type="text" placeholder="Enter your data" />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Temperature Range (Min)</label>
                            <input type="text" placeholder="Enter your data" />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Upload Image</label>
                        <div
                            className={styles.uploadArea}
                            onDrop={handleDrop}
                            onDragOver={(e) => e.preventDefault()}
                        >
                            <input
                                ref={inputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleChange}
                                style={{ display: 'none' }}
                            />
                            <button
                                className={styles.uploadButton}
                                onClick={() => inputRef.current.click()}
                            >
                                Choose images or drag & drop it here.
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
} 