import React, { useEffect, useState } from 'react';
import { message, Button, Spin, Result, Card } from 'antd';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom'; // React Router v6 (useNavigate)

function PaymentReturnPage() {
  const location = useLocation(); // Access URL search params
  const navigate = useNavigate(); // Use to navigate after payment verification
  const [paymentStatus, setPaymentStatus] = useState(null); // To store payment status
  const [isLoading, setIsLoading] = useState(true); // To manage loading state

  // Extract query parameters from the URL
  const queryParams = new URLSearchParams(location.search);
  const vnp_TxnRef = queryParams.get('vnp_TxnRef');
  const vnp_ResponseCode = queryParams.get('vnp_ResponseCode');
  const vnp_SecureHash = queryParams.get('vnp_SecureHash');

  useEffect(() => {
    // Validate if necessary parameters exist
    if (!vnp_TxnRef || !vnp_ResponseCode || !vnp_SecureHash) {
      message.error("Missing payment information. Please check again.");
      setIsLoading(false);
      return;
    }

    // Prepare the query string with the required parameters
    const url = `https://localhost:7073/api/Payments/return?vnp_TxnRef=${vnp_TxnRef}&vnp_ResponseCode=${vnp_ResponseCode}&vnp_SecureHash=${vnp_SecureHash}`;

    // Send request to backend to verify the payment
    axios
      .get(url) // Using GET request as the API expects query params in the URL
      .then((response) => {
        setIsLoading(false);
        if (response.status === 200 && response.data.success) {
          setPaymentStatus({
            success: true,
            donationId: response.data.donationId,
            paymentId: response.data.paymentId,
            amount: response.data.amount,
            status: response.data.status
          });
        } else {
          setPaymentStatus({
            success: false,
            amount: response.data.amount,
            message: "Payment failed"
          });
        }
      })
      .catch((error) => {
        setIsLoading(false);
        setPaymentStatus({ success: false, message: "An error occurred. Please try again." });
        console.error("Error:", error);
      });
  }, [vnp_TxnRef, vnp_ResponseCode, vnp_SecureHash]);

  return (
    <div style={{ padding: "40px 20px", backgroundColor: "#f9f9f9", minHeight: "10vh" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <Card title="Payment Result" bordered={false} style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.1)", padding: "20px" }}>
          {isLoading ? (
            <div style={{ textAlign: 'center' }}>
              <Spin size="large" />
              <p>Validating payment...</p>
            </div>
          ) : (
            <>
              <Result
                status={paymentStatus.success ? "success" : "error"}
                title={paymentStatus.success ? "Payment Successful!" : "Payment Failed"}
                subTitle={paymentStatus.success ? `Amount: ${paymentStatus.amount} VND` : `Amount: ${paymentStatus.amount}`}
                extra={[
                  <Button key="home" type="primary" onClick={() => navigate('/')} style={{ width: '100%' }}>
                    Go back to Home
                  </Button>
                ]}
              />
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

export default PaymentReturnPage;
