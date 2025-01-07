import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (error) {
      // Nếu có lỗi, thông báo cho người dùng
      console.error('Google OAuth Error:', error);
      alert('OAuth login failed. Please try again.');
      navigate('/login');
      return;
    }

    if (code) {
      // Nếu có mã xác thực, lấy token từ Google
      const getAccessToken = async () => {
        try {
          const response = await axios.post('https://oauth2.googleapis.com/token', {
            code,
            client_id: '334049821575-i56alrskjiqp857pn7ceustmbrkvr9aj.apps.googleusercontent.com', // Thay bằng Client ID của bạn
            client_secret: 'YOUR_CLIENT_SECRET', // Thay bằng Client Secret của bạn
            redirect_uri: 'http://localhost:5173/callback', // URL callback của bạn
            grant_type: 'authorization_code',
          });

          const { access_token, id_token, expires_in } = response.data;

          // Gửi ID token vào API để xác thực hoặc lưu vào localStorage
          const loginResponse = await axios.post('https://soschildrenvillage.azurewebsites.net/api/Login/LoginGoogle', {
            accessToken: id_token,
          });

          // Lưu thông tin người dùng vào localStorage và điều hướng người dùng
          if (loginResponse.data.statusCode === 200) {
            localStorage.setItem('accessToken', loginResponse.data.accessToken);
            localStorage.setItem('roleId', loginResponse.data.roleId);
            localStorage.setItem('userAccountId', loginResponse.data.userAccountId);

            // Điều hướng người dùng đến trang chính hoặc trang admin
            navigate(loginResponse.data.roleId === '1' ? '/admin' : '/home');
          } else {
            alert('Google login failed.');
            navigate('/login');
          }
        } catch (error) {
          console.error('Error during token exchange or login:', error);
          alert('An error occurred. Please try again.');
          navigate('/login');
        }
      };

      getAccessToken();
    }
  }, [navigate]);

  return <div>Loading...</div>;
};

export default CallbackPage;
