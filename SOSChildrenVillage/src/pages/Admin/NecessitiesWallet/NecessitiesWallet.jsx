import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { message, Button, Table } from 'antd';
import { useNavigate } from "react-router-dom";
import './NecessitiesWallet.css'; // Nếu bạn muốn thêm style riêng biệt cho NecessitiesWallet

const NecessitiesWallet = () => {
  const [necessitiesWalletData, setNecessitiesWalletData] = useState([]);
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
    const fetchNecessitiesWalletData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://soschildrenvillage.azurewebsites.net/api/NecessitiesWallet/GetNecessitiesWalletsArray');
        setNecessitiesWalletData(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error(error);
        message.error('Failed to fetch necessities wallet data');
      } finally {
        setLoading(false);
      }
    };
    const token = localStorage.getItem("token");

    if (!token || !["1", "4"].includes(userRole)) {
      if (!redirecting && !messageShown.current) {
        setRedirecting(true);
        message.error("You do not have permission to access this page");
        navigate("/admin");
        messageShown.current = true;
      }
    } else {
      fetchNecessitiesWalletData();
    }
  }, [navigate, redirecting, userRole]);

  const formatCurrency = (amount) => `${amount.toLocaleString()} VND`;

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const fetchExpenseData = async (id) => {
    try {
      const response = await axios.get(`https://soschildrenvillage.azurewebsites.net/api/Expenses/GetExpenseByNescilitiesWalletId?Id=${id}`);
      const expenseArray = Array.isArray(response.data) ? response.data : [];
      const filteredExpenseData = expenseArray.map(expense => ({
        key: expense.id,
        expenseAmount: formatCurrency(expense.expenseAmount),
        description: expense.description,
        expenseday: formatDateTime(expense.expenseday),
        houseId: expense.houseId,
      }));
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
      const response = await axios.get(`https://soschildrenvillage.azurewebsites.net/api/Incomes/GetIncomeByNescilitiesWallet?Id=${id}`);
      const incomeArray = Array.isArray(response.data) ? response.data : [];
      const filteredIncomeData = incomeArray.map(income => ({
        key: income.id,
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

  const expenseColumns = [
    { title: 'Expense Amount', dataIndex: 'expenseAmount', key: 'expenseAmount' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Expense Day', dataIndex: 'expenseday', key: 'expenseday' },
    { title: 'House ID', dataIndex: 'houseId', key: 'houseId' },
  ];

  const incomeColumns = [
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
    { title: 'Receive Day', dataIndex: 'receiveday', key: 'receiveday' },
    { title: 'User Account ID', dataIndex: 'userAccountId', key: 'userAccountId' },
  ];

  return (
    <div className="necessities-wallet-container">
      <h1 className="necessities-wallet-title">Necessities Wallet</h1>
      {loading ? (
        <p className="loading-spinner">Loading...</p>
      ) : (
        <div className="wallet-list">
          {necessitiesWalletData.length > 0 ? (
            <ul className="wallet-items">
              {necessitiesWalletData.map((item) => (
                <div className="wallet-item" key={item.id}>
                  <div>
                    <strong>Budget:</strong> {formatCurrency(item.budget)}
                  </div>
                  <div className="wallet-actions">
                    <Button className="action-btn expense-btn" onClick={() => fetchExpenseData(item.id)}>Show Expense</Button>
                    <Button className="action-btn income-btn" onClick={() => fetchIncomeData(item.id)}>Show Income</Button>
                  </div>
                </div>
              ))}
            </ul>
          ) : (
            <p>No data available</p>
          )}
        </div>
      )}

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

export default NecessitiesWallet;
