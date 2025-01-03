import { useState, useEffect } from 'react';
import { message, Button, Select, Input, Form, Card } from 'antd';
import axios from 'axios';

const { Option } = Select;

const wallets = [
  { id: 1, name: "Facilities Wallet", apiURL: "https://localhost:7073/api/WalletDonation/DonateFacilitiesWallet" },
  { id: 2, name: "Necessities Wallet", apiURL: "https://localhost:7073/api/WalletDonation/DonateNecessitiesWallet" },
  { id: 3, name: "FoodStuff Wallet", apiURL: "https://localhost:7073/api/WalletDonation/DonateFoodStuffWallet" },
  { id: 4, name: "Health Wallet", apiURL: "https://localhost:7073/api/WalletDonation/DonateHealthWallet" },
  { id: 5, name: "System Wallet", apiURL: "https://localhost:7073/api/WalletDonation/DonateSystemWallet" },
];

function DonateNow() {
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [amount, setAmount] = useState(0);
  const [fullName, setFullName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userAccountId, setUserAccountId] = useState(null);

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập
    const storedUserId = localStorage.getItem("userId");
    console.log("Stored User ID:", storedUserId); // Thêm dòng này để kiểm tra giá trị userId trong localStorage
    if (storedUserId) {
      setIsLoggedIn(true);
      setUserAccountId(storedUserId);
    } else {
      setIsLoggedIn(false);
      setUserAccountId(null);
    }
  }, []);
  

  const handleDonate = async () => {
    if (!amount || amount < 10000) {
      message.error("Donation amount must be at least 10,000.");
      return;
    }
    if (!selectedWallet) {
      message.error("Please select a wallet.");
      return;
    }

    // Prepare the request payload
    const paymentRequest = {
      userAccountId,
      amount,
      userName: isLoggedIn ? null : fullName,
      userEmail: isLoggedIn ? null : userEmail,
      phone: isLoggedIn ? null : phone,
      description: isLoggedIn ? null : description,
      address: isLoggedIn ? null : address,
    };

    try {
      // Send the donation request to the selected wallet's endpoint
      const response = await axios.post(selectedWallet.apiURL, paymentRequest);

      if (response.status === 200 && response.data.url) {
        // Redirect the user to the payment URL
        window.location.href = response.data.url;
      } else {
        message.error("Failed to create the payment link.");
      }
    } catch (error) {
      message.error("An error occurred while creating the payment link.");
      console.error("Error:", error);
    }
  };

  return (
    <div style={{ padding: "40px 20px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <Card title="Donate Now" bordered={false} style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.1)", padding: "20px" }}>
          <Form layout="vertical">
            {/* Select Wallet */}
            <Form.Item label="Select Wallet" required>
              <Select
                placeholder="Select a wallet"
                onChange={(walletId) => {
                  const wallet = wallets.find((wallet) => wallet.id === walletId);
                  setSelectedWallet(wallet);
                }}
              >
                {wallets.map((wallet) => (
                  <Option key={wallet.id} value={wallet.id}>
                    {wallet.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* Full Name */}
            {!isLoggedIn && (
              <Form.Item label="Full Name" required>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </Form.Item>
            )}

            {/* Email */}
            {!isLoggedIn && (
              <Form.Item label="Email" required>
                <Input
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </Form.Item>
            )}

            {/* Phone */}
            {!isLoggedIn && (
              <Form.Item label="Phone" required>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                />
              </Form.Item>
            )}

            {/* Description */}
            {!isLoggedIn && (
              <Form.Item label="Description (Optional)">
                <Input.TextArea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter your description (optional)"
                  rows={3}
                />
              </Form.Item>
            )}

            {/* Address */}
            {!isLoggedIn && (
              <Form.Item label="Address (Optional)">
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your address (optional)"
                />
              </Form.Item>
            )}

            {/* Amount */}
            <Form.Item label="Donation Amount" required>
              <Input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                type="number"
              />
            </Form.Item>

            {/* Donate Button */}
            <Form.Item>
              <Button
                type="primary"
                onClick={handleDonate}
                style={{ width: "100%" }}
              >
                Donate Now
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
}

export default DonateNow;
