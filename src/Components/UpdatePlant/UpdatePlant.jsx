import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import styles from './UpdatePlant.module.css';

const validationSchema = Yup.object({
    name: Yup.string().required('Plant name is required'),
    scientificName: Yup.string().required('Scientific name is required'),
    category: Yup.string().required('Category is required'),
    origin: Yup.string().required('Origin is required'),
    description: Yup.string().required('Description is required'),
    wateringFrequency: Yup.string().required('Watering frequency is required'),
    soilType: Yup.string().required('Soil type is required'),
    temperatureRangeMax: Yup.number().required('Maximum temperature is required'),
    temperatureRangeMin: Yup.number().required('Minimum temperature is required')
});

export default function UpdatePlant() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [currentImage, setCurrentImage] = useState(null);

    const formik = useFormik({
        initialValues: {
            name: '',
            scientificName: '',
            category: '',
            origin: '',
            description: '',
            wateringFrequency: '',
            soilType: '',
            temperatureRangeMax: '',
            temperatureRangeMin: '',
            image: null
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const formData = new FormData();
                formData.append('name', values.name);
                formData.append('scientificName', values.scientificName);
                formData.append('category', values.category);
                formData.append('origin', values.origin);
                formData.append('description', values.description);
                formData.append('wateringFrequency', values.wateringFrequency);
                formData.append('soilType', values.soilType);
                formData.append('temperatureRangeMax', values.temperatureRangeMax);
                formData.append('temperatureRangeMin', values.temperatureRangeMin);

                if (values.image) {
                    formData.append('image', values.image);
                }

                const token = localStorage.getItem('token');
                if (!token) {
                    toast.error('Please login first');
                    navigate('/login');
                    return;
                }

                await axios.put(
                    `https://green-world-vert.vercel.app/plant/${id}`,
                    formData,
                    {
                        headers: {
                            token: token,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );

                toast.success('Plant updated successfully!');
                navigate('/dashboard/plant');
            } catch (error) {
                console.error('Error updating plant:', error);
                if (error.response?.status === 401) {
                    toast.error('Session expired. Please login again');
                    navigate('/login');
                } else {
                    toast.error(error.response?.data?.message || 'Error updating plant');
                }
            }
        }
    });

    useEffect(() => {
        const fetchPlantData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    toast.error('Please login first');
                    navigate('/login');
                    return;
                }

                const response = await axios.get(
                    `https://green-world-vert.vercel.app/plant/${id}`,
                    {
                        headers: {
                            token: token
                        }
                    }
                );

                const plantData = response.data.data;
                formik.setValues({
                    name: plantData.name || '',
                    scientificName: plantData.scientificName || '',
                    category: plantData.category || '',
                    origin: plantData.origin || '',
                    description: plantData.description || '',
                    wateringFrequency: plantData.wateringFrequency || '',
                    soilType: plantData.soilType || '',
                    temperatureRangeMax: plantData.temperatureRange?.max || '',
                    temperatureRangeMin: plantData.temperatureRange?.min || '',
                    image: null
                });

                if (plantData.Image?.secure_url) {
                    setCurrentImage(plantData.Image.secure_url);
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching plant data:', error);
                if (error.response?.status === 401) {
                    toast.error('Session expired. Please login again');
                    navigate('/login');
                } else {
                    toast.error('Error loading plant data');
                }
                setLoading(false);
            }
        };

        fetchPlantData();
    }, [id, navigate]);

    if (loading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    return (
        <div className={styles.updateContainer}>
            <h2 className={styles.title}>Update Your Plant</h2>
            <div className={styles.formContainer}>
                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label>Name</label>
                        <input
                            type="text"
                            {...formik.getFieldProps('name')}
                        />
                        {formik.touched.name && formik.errors.name && (
                            <div className={styles.error}>{formik.errors.name}</div>
                        )}
                    </div>
                    <div className={styles.formGroup}>
                        <label>Scientific Name</label>
                        <input
                            type="text"
                            {...formik.getFieldProps('scientificName')}
                        />
                        {formik.touched.scientificName && formik.errors.scientificName && (
                            <div className={styles.error}>{formik.errors.scientificName}</div>
                        )}
                    </div>
                </div>

                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label>Category</label>
                        <select
                            {...formik.getFieldProps('category')}
                        >
                            <option value="">Select category</option>
                            <option value="indoor">Indoor</option>
                            <option value="outdoor">Outdoor</option>
                            <option value="medicinal">Medicinal & Aromatic</option>
                            <option value="shade">Shade</option>
                        </select>
                        {formik.touched.category && formik.errors.category && (
                            <div className={styles.error}>{formik.errors.category}</div>
                        )}
                    </div>
                    <div className={styles.formGroup}>
                        <label>Origin</label>
                        <input
                            type="text"
                            {...formik.getFieldProps('origin')}
                        />
                        {formik.touched.origin && formik.errors.origin && (
                            <div className={styles.error}>{formik.errors.origin}</div>
                        )}
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label>Description</label>
                    <input
                        type="text"
                        {...formik.getFieldProps('description')}
                    />
                    {formik.touched.description && formik.errors.description && (
                        <div className={styles.error}>{formik.errors.description}</div>
                    )}
                </div>

                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label>Watering Frequency</label>
                        <select
                            {...formik.getFieldProps('wateringFrequency')}
                        >
                            <option value="">Select frequency</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="biweekly">Bi-weekly</option>
                            <option value="monthly">Monthly</option>
                        </select>
                        {formik.touched.wateringFrequency && formik.errors.wateringFrequency && (
                            <div className={styles.error}>{formik.errors.wateringFrequency}</div>
                        )}
                    </div>
                    <div className={styles.formGroup}>
                        <label>Soil Type</label>
                        <select
                            {...formik.getFieldProps('soilType')}
                        >
                            <option value="">Select soil type</option>
                            <option value="sandy">Sandy</option>
                            <option value="clay">Clay</option>
                            <option value="loamy">Loamy</option>
                            <option value="peaty">Peaty</option>
                            <option value="chalky">Chalky</option>
                        </select>
                        {formik.touched.soilType && formik.errors.soilType && (
                            <div className={styles.error}>{formik.errors.soilType}</div>
                        )}
                    </div>
                </div>

                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label>Temperature Range (Max)</label>
                        <input
                            type="number"
                            {...formik.getFieldProps('temperatureRangeMax')}
                        />
                        {formik.touched.temperatureRangeMax && formik.errors.temperatureRangeMax && (
                            <div className={styles.error}>{formik.errors.temperatureRangeMax}</div>
                        )}
                    </div>
                    <div className={styles.formGroup}>
                        <label>Temperature Range (Min)</label>
                        <input
                            type="number"
                            {...formik.getFieldProps('temperatureRangeMin')}
                        />
                        {formik.touched.temperatureRangeMin && formik.errors.temperatureRangeMin && (
                            <div className={styles.error}>{formik.errors.temperatureRangeMin}</div>
                        )}
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label>Current Image</label>
                    {currentImage && (
                        <img
                            src={currentImage}
                            alt="Current plant"
                            className={styles.currentImage}
                        />
                    )}
                    <label className={styles.uploadLabel}>Upload New Image</label>
                    <input
                        type="file"
                        onChange={(event) => {
                            formik.setFieldValue('image', event.currentTarget.files[0]);
                        }}
                        className={styles.fileInput}
                    />
                </div>

                <button type="submit" className={styles.submitButton} onClick={formik.handleSubmit}>
                    Update Plant
                </button>
            </div>
        </div>
    );
} 