import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import styles from './UpdatePlant.module.css';

export default function UpdatePlant() {
    const navigate = useNavigate();
    const { id: plantId } = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const isValidPlantId = (id) => {
        return id && id.length === 24 && /^[0-9a-fA-F]{24}$/.test(id);
    };

    useEffect(() => {
        if (!isValidPlantId(plantId)) {
            setError('Invalid plant ID. ID must be 24 characters long and contain only hexadecimal characters.');
            return;
        }

        const fetchPlant = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`https://green-world-vert.vercel.app/plant/${plantId}`, {
                    headers: {
                        token,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.data.success) {
                    const plant = response.data.data;
                    formik.setValues({
                        name: plant.name || '',
                        scientificName: plant.scientificName || '',
                        category: plant.category || '',
                        origin: plant.origin || '',
                        description: plant.description || '',
                        wateringFrequency: plant.wateringFrequency || '',
                        soilType: plant.soilType || '',
                        temperatureRange: {
                            min: plant.temperatureRange?.min || '',
                            max: plant.temperatureRange?.max || ''
                        },
                        image: null
                    });
                } else {
                    setError(response.data.message || 'Failed to fetch plant data');
                }
            } catch (err) {
                console.error('Fetch error:', err.response?.data);
                setError(err.response?.data?.message || 'Failed to fetch plant details');
            }
        };

        fetchPlant();
    }, [plantId]);

    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        scientificName: Yup.string().required('Scientific name is required'),
        category: Yup.string().required('Category is required'),
        origin: Yup.string().required('Origin is required'),
        description: Yup.string().required('Description is required'),
        wateringFrequency: Yup.string().required('Watering frequency is required'),
        soilType: Yup.string().required('Soil type is required'),
        temperatureRange: Yup.object({
            min: Yup.number().required('Minimum temperature is required'),
            max: Yup.number().required('Maximum temperature is required')
        })
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            scientificName: '',
            category: '',
            origin: '',
            description: '',
            wateringFrequency: '',
            soilType: '',
            temperatureRange: {
                min: '',
                max: ''
            },
            image: null
        },
        validationSchema,
        onSubmit: async (values) => {
            if (!isValidPlantId(plantId)) {
                setError('Invalid plant ID. Cannot update plant.');
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const updateData = {
                    name: values.name,
                    scientificName: values.scientificName,
                    category: values.category,
                    origin: values.origin,
                    description: values.description,
                    wateringFrequency: values.wateringFrequency,
                    soilType: values.soilType,
                    temperatureRange: {
                        min: parseInt(values.temperatureRange.min),
                        max: parseInt(values.temperatureRange.max)
                    }
                };

                const token = localStorage.getItem('token');
                const response = await axios.put(`https://green-world-vert.vercel.app/plant/${plantId}`, updateData, {
                    headers: {
                        'token': token,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.data.success) {
                    navigate('/dashboard/plant');
                } else {
                    setError(response.data.message || 'Failed to update plant');
                }
            } catch (err) {
                console.error('Update error:', err.response?.data);
                setError(err.response?.data?.message || 'An error occurred while updating the plant');
            } finally {
                setLoading(false);
            }
        }
    });

    const categories = [
        'ornamental',
        'medicinal & aromatic',
        'fruit',
        'shade',
        'air-purifying'
    ];

    const wateringFrequencies = [
        'daily',
        'every other day',
        'weekly',
        'biweekly',
        'monthly'
    ];

    return (
        <div className={styles.updatePlantContainer}>
            <h2>Update Your Plant</h2>
            {error && <div className={styles.error}>{error}</div>}
            <form onSubmit={formik.handleSubmit} className={styles.form}>
                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.name}
                        />
                        {formik.touched.name && formik.errors.name && (
                            <div className={styles.error}>{formik.errors.name}</div>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label>Scientific Name</label>
                        <input
                            type="text"
                            name="scientificName"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.scientificName}
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
                            name="category"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.category}
                        >
                            <option value="">Select Category</option>
                            {categories.map(category => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                        {formik.touched.category && formik.errors.category && (
                            <div className={styles.error}>{formik.errors.category}</div>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label>Origin</label>
                        <input
                            type="text"
                            name="origin"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.origin}
                        />
                        {formik.touched.origin && formik.errors.origin && (
                            <div className={styles.error}>{formik.errors.origin}</div>
                        )}
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label>Description</label>
                    <textarea
                        name="description"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.description}
                    />
                    {formik.touched.description && formik.errors.description && (
                        <div className={styles.error}>{formik.errors.description}</div>
                    )}
                </div>

                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label>Watering Frequency</label>
                        <select
                            name="wateringFrequency"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.wateringFrequency}
                        >
                            <option value="">Select Frequency</option>
                            {wateringFrequencies.map(frequency => (
                                <option key={frequency} value={frequency}>
                                    {frequency}
                                </option>
                            ))}
                        </select>
                        {formik.touched.wateringFrequency && formik.errors.wateringFrequency && (
                            <div className={styles.error}>{formik.errors.wateringFrequency}</div>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label>Soil Type</label>
                        <input
                            type="text"
                            name="soilType"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.soilType}
                        />
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
                            name="temperatureRange.max"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.temperatureRange.max}
                        />
                        {formik.touched.temperatureRange?.max && formik.errors.temperatureRange?.max && (
                            <div className={styles.error}>{formik.errors.temperatureRange.max}</div>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label>Temperature Range (Min)</label>
                        <input
                            type="number"
                            name="temperatureRange.min"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.temperatureRange.min}
                        />
                        {formik.touched.temperatureRange?.min && formik.errors.temperatureRange?.min && (
                            <div className={styles.error}>{formik.errors.temperatureRange.min}</div>
                        )}
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label>Upload Image</label>
                    <input
                        type="file"
                        name="image"
                        onChange={(event) => {
                            formik.setFieldValue('image', event.currentTarget.files[0]);
                        }}
                    />
                </div>

                <button type="submit" disabled={loading} className={styles.submitButton}>
                    {loading ? 'Updating...' : 'Update Plant'}
                </button>
            </form>
        </div>
    );
} 