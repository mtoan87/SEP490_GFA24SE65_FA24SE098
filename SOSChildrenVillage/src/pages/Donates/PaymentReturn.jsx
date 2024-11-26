import { useState, useEffect } from 'react';
import { notification, Spin, Card, Row, Col, Divider, Button } from 'antd';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentReturn = () => {
  const [loading, setLoading] = useState(true);
  const [paymentResult, setPaymentResult] = useState(null);
  const location = useLocation();
  const navigate = useNavigate(); // Using useNavigate for routing

  // Extracting query parameters from the URL
  const queryParams = new URLSearchParams(location.search);
  let vnp_TxnRef = queryParams.get('vnp_TxnRef');
  const vnp_ResponseCode = queryParams.get('vnp_ResponseCode');
  const vnp_OrderInfo = queryParams.get('vnp_OrderInfo');

  // Clean the vnp_TxnRef by removing everything after the underscore
  vnp_TxnRef = vnp_TxnRef.split('_')[0];

  // Parsing orderInfo to get childId, walletId, eventId, systemWalletId
  const orderInfo = decodeURIComponent(vnp_OrderInfo); // Decode to get the correct format
  const childIdMatch = orderInfo.match(/childId\s*([A-Za-z0-9]+)/);
  const walletIdMatch = orderInfo.match(/walletId\s*(\d+)/);
  const eventIdMatch = orderInfo.match(/eventId\s*(\d+)/);
  const systemWalletIdMatch = orderInfo.match(/systemWalletId\s*(\d+)/);
  const facilitiesWalletIdMatch = orderInfo.match(/facilitiesWalletId\s*(\d+)/);
  const necessitiesWalletIdMatch = orderInfo.match(/necessitiesWalletId\s*(\d+)/);
  const foodStuffWalletIdMatch = orderInfo.match(/foodStuffWalletId\s*(\d+)/);
  const healthWalletIdMatch = orderInfo.match(/healthWalletId\s*(\d+)/);

  const childId = childIdMatch ? childIdMatch[1] : null;
  const walletId = walletIdMatch ? walletIdMatch[1] : null;
  const eventId = eventIdMatch ? parseInt(eventIdMatch[1], 10) : null;
  const systemWalletId = systemWalletIdMatch ? systemWalletIdMatch[1] : null;
  const facilitiesWalletId = facilitiesWalletIdMatch ? facilitiesWalletIdMatch[1] : null;
  const necessitiesWalletId = necessitiesWalletIdMatch ? necessitiesWalletIdMatch[1] : null;
  const foodStuffWalletId = foodStuffWalletIdMatch ? foodStuffWalletIdMatch[1] : null;
  const healthWalletId = healthWalletIdMatch ? healthWalletIdMatch[1] : null;

  // If systemWalletId is still null, let's log an error for better debugging
  if (!systemWalletId) {
    console.error("systemWalletId not found in the orderInfo:", orderInfo);
  }

  // Build the API URL dynamically, conditionally including walletId and new wallet params
  let apiUrl = `https://soschildrenvillage.azurewebsites.net/api/Payments/return?vnp_TxnRef=${vnp_TxnRef}&vnp_ResponseCode=${vnp_ResponseCode}&childId=${childId || ""}&eventId=${eventId || ""}
  &systemWalletId=${systemWalletId || ""}
  &facilitiesWalletId=${facilitiesWalletId || ""}
  &necessitiesWalletId=${necessitiesWalletId || ""}
  &foodStuffWalletId=${foodStuffWalletId || ""}
  &healthWalletId=${healthWalletId || ""}
  `;

  if (walletId) {
    apiUrl += `&walletId=${walletId}`; // Add walletId if available
  }

  console.log('Generated API URL:', apiUrl);


  useEffect(() => {
    let timeoutId; // To store the timeout reference

    const fetchPaymentResult = async () => {
      // Set a timeout to handle processing timeouts
      timeoutId = setTimeout(() => {
        if (loading) {
          setLoading(false);
          notification.error({
            message: 'Payment Processing Timeout',
            description: 'The payment processing took too long. Please try again.',
          });
        }
      }, 120000); // Set a 2-minute timeout

      try {
        // Attempt to get the payment result from the API
        const response = await axios.get(apiUrl);

        // Once the response is received, clear the timeout
        clearTimeout(timeoutId);

        setPaymentResult(response.data);
        setLoading(false);

        // Show the appropriate notification based on success or failure
        if (response.data.success) {
          notification.success({
            message: 'Payment Successful',
            description: `Amount: ${response.data.amount}`,
          });
        } else {
          // Show error notification for already paid donations
          if (response.data.message === "This donation has already been paid.") {
            notification.info({
              message: 'Payment Already Made',
              description: `Donation has already been paid.`,
            });
          } else {
            notification.error({
              message: 'Payment Failed',
              description: `Donation , Amount: ${response.data.amount}`,
            });
          }
        }
      } catch (error) {
        // Remove error notification for processing error
        clearTimeout(timeoutId);
        setLoading(false);

        // Do not show "Payment Processing Error" notification
        // We leave the catch block empty to avoid showing any error message
      }
    };

    // Call the function to fetch the payment result
    fetchPaymentResult();

    // Cleanup timeout when the component is unmounted
    return () => {
      clearTimeout(timeoutId); // Clear timeout on component unmount
    };
  }, [apiUrl, loading]);

  const goToHome = () => {
    navigate('/home'); // Redirect to the home page
  };

  return (
    <div style={{ padding: '40px', backgroundColor: '#f0f2f5' }}>
      <Spin spinning={loading}>
        <Card bordered={false} style={{ width: '100%', maxWidth: '600px', margin: 'auto' }}>
          <Row justify="center">
            <Col span={24} style={{ textAlign: 'center' }}>
              <h2 style={{ color: '#1890ff' }}>Payment</h2>
              <Divider />
              {paymentResult && (
                <div>
                  <p><strong>Status:</strong> {paymentResult.status}</p>
                  <p><strong>Amount:</strong> {paymentResult.amount}</p>
                  {paymentResult.success ? (
                    <Button type="primary" onClick={goToHome}>Go to Home</Button>
                  ) : (
                    <Button type="danger" onClick={goToHome}>Go to Home</Button>
                  )}
                </div>
              )}
            </Col>
          </Row>
        </Card>
      </Spin>
    </div>
  );
};

export default PaymentReturn;
