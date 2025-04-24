// src/Components/Profile/Profile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Profile.module.css';
import { FaUser } from 'react-icons/fa';

export default function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get('https://green-world-vert.vercel.app/auth/profile');
        setProfileData(response.data.data);

        // إذا كان المستخدم أدمن، قم بجلب جميع المستخدمين
        if (response.data.data.role === "admin") {
          const usersResponse = await axios.get('https://green-world-vert.vercel.app/auth/users');
          setAllUsers(usersResponse.data.data);
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!profileData) return <div className={styles.error}>No profile data found</div>;

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <FaUser className={styles.profileIcon} />
          <h2>Profile Information</h2>
        </div>
        <div className={styles.profileInfo}>
          <div className={styles.infoItem}>
            <label>Username:</label>
            <span>{profileData.userName}</span>
          </div>
          <div className={styles.infoItem}>
            <label>Email:</label>
            <span>{profileData.email}</span>
          </div>
          <div className={styles.infoItem}>
            <label>Role:</label>
            <span>{profileData.role}</span>
          </div>
          <div className={styles.infoItem}>
            <label>Account Created:</label>
            <span>{new Date(profileData.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* عرض جدول المستخدمين للأدمن فقط */}
      {profileData.role === "admin" && (
        <div className={styles.usersTable}>
          <h3>System Users</h3>
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Verified</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.userName}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.isVerified ? "Yes" : "No"}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}