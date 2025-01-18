import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { message, Button, Table, Spin } from 'antd';
import { useNavigate } from "react-router-dom";
import './FoodStuffWallet.css'; // Import file CSS

const FoodStuffWallet = () => {
  const [foodStuffWalletData, setFoodStuffWalletData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expenseData, setExpenseData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [showExpense, setShowExpense] = useState(false);
  const [showIncome, setShowIncome] = useState(false);
  const navigate = useNavigate();
  const [redirecting, setRedirecting] = useState(false);
  const userRole = localStorage.getItem("roleId");
  const messageShown = useRef(false);

  useEffect(() => {
    const fetchFoodStuffWalletData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://soschildrenvillage.azurewebsites.net/api/FoodStuffWallet/FormatFoodWallet');
        setFoodStuffWalletData(response.data);
      } catch (error) {
        console.error(error);
        message.error('Failed to fetch foodstuff wallet data');
      } finally {
        setLoading(false);
      }
    };
    const token = localStorage.getItem("token");

    if (!token || !["1", "4"].includes(userRole)) {
        if (!redirecting && !messageShown.current) {
            setRedirecting(true);
            message.error("You do not have permission to access this page");
            navigate("/home");
            messageShown.current = true;
        }
    } else {
      fetchFoodStuffWalletData();
    }
  }, [navigate, redirecting, userRole]);

  const fetchHouseName = async (houseId) => {
    try {
      const response = await axios.get(`https://soschildrenvillage.azurewebsites.net/api/Houses/GetHouseByIdWithImg/${houseId}`);
      return response.data.houseName || 'Unknown House';
    } catch (error) {
      console.error(`Failed to fetch house name for ID ${houseId}`, error);
      return 'Unknown House';
    }
  };

  const fetchExpenseData = async (id) => {
    try {
      const response = await axios.get(`https://soschildrenvillage.azurewebsites.net/api/Expenses/GetExpenseByFoodWalletId?Id=${id}`);
      const expensePromises = response.data.map(async (expense) => {
        const houseName = await fetchHouseName(expense.houseId);
        return {
          expenseAmount: formatCurrency(expense.expenseAmount),
          description: expense.description,
          expenseday: formatDateTime(expense.expenseday),
          houseName,
        };
      });

      const filteredExpenseData = await Promise.all(expensePromises);
      setExpenseData(filteredExpenseData);
      setShowExpense(true);
      setShowIncome(false);
    } catch (error) {
      console.error(error);
      message.error('Failed to fetch expense data');
    }
  };

  const fetchIncomeData = async (id) => {
    try {
      const response = await axios.get(`https://soschildrenvillage.azurewebsites.net/api/Incomes/GetIncomeByFoodWallet?Id=${id}`);
      const filteredIncomeData = response.data.map((income) => ({
        amount: formatCurrency(income.amount || 0),
        receiveday: formatDateTime(income.receiveday),
        userAccountId: income.userAccountId,
      }));
      setIncomeData(filteredIncomeData);
      setShowIncome(true);
      setShowExpense(false);
    } catch (error) {
      console.error(error);
      message.error('Failed to fetch income data');
    }
  };

  const formatCurrency = (amount) => `${amount.toLocaleString()} VND`;

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Define columns for Expense and Income tables
  const expenseColumns = [
    { title: 'Expense Amount', dataIndex: 'expenseAmount', key: 'expenseAmount',align: "center" },
    { title: 'Description', dataIndex: 'description', key: 'description',align: "center" },
    { title: 'Expense Day', dataIndex: 'expenseday', key: 'expenseday',align: "center" },
    { title: 'House Name', dataIndex: 'houseName', key: 'houseName',align: "center" },
  ];

  const incomeColumns = [
    { title: 'Amount', dataIndex: 'amount', key: 'amount',align: "center" },
    { title: 'Receive Day', dataIndex: 'receiveday', key: 'receiveday',align: "center" },
    { title: 'User Account ID', dataIndex: 'userAccountId', key: 'userAccountId',align: "center" },
  ];

  return (
    <div className="food-wallet-container">
      <h1 className="food-wallet-title">FoodStuff Wallet</h1>

      {loading ? (
        <p className="loading-spinner">Loading...</p>
      ) : (
        <div className="wallet-list">
          {foodStuffWalletData.length > 0 ? (
            <ul className="wallet-items">
              {foodStuffWalletData.map((item) => (
                <div key={item.id} className="wallet-item">
                  <div><strong>Budget:</strong> {formatCurrency(item.budget)}</div>
                  <div className="wallet-actions">
                    <Button onClick={() => fetchExpenseData(item.id)} className="action-btn expense-btn">Show Expense</Button>
                    <Button onClick={() => fetchIncomeData(item.id)} className="action-btn income-btn">Show Income</Button>
                  </div>
                </div>
              ))}
            </ul>
          ) : (
            <p>No data available</p>
          )}
        </div>
      )}

      {/* Show Expense Data */}
      {showExpense && (
        <div className="data-section">
          <h2 className="data-title">Expense Data</h2>
          <Table
            dataSource={expenseData}
            columns={expenseColumns}
            pagination={{ pageSize: 5 }}
          />
        </div>
      )}

      {/* Show Income Data */}
      {showIncome && (
        <div className="data-section">
          <h2 className="data-title">Income Data</h2>
          <Table
            dataSource={incomeData}
            columns={incomeColumns}
            pagination={{ pageSize: 5 }}
          />
        </div>
      )}
    </div>
  );
};

export default FoodStuffWallet;
