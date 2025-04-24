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
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };

        const response = await axios.get('https://green-world-vert.vercel.app/auth/profile', config);
        setProfileData(response.data.data);

        // إذا كان المستخدم أدمن، قم بجلب جميع المستخدمين
        if (response.data.data.role === "admin") {
          const usersResponse = await axios.get('https://green-world-vert.vercel.app/auth/users', config);
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

  // تحديد البيانات التي سيتم عرضها (عدم عرض البيانات الحساسة)
  const safeUserData = {
    "Username": profileData.userName,
    "Email": profileData.email,
    "Role": profileData.role,
    "Account Status": profileData.isVerified ? "Verified" : "Not Verified",
    "Member Since": new Date(profileData.createdAt).toLocaleDateString()
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <FaUser className={styles.profileIcon} />
          <h2>Profile Information</h2>
        </div>
        <div className={styles.profileTable}>
          <table>
            <tbody>
              {Object.entries(safeUserData).map(([key, value]) => (
                <tr key={key}>
                  <th>{key}</th>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
                <th>Status</th>
                <th>Member Since</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.userName}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.isVerified ? "Verified" : "Not Verified"}</td>
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