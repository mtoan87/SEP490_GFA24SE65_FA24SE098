import { useState, useEffect } from 'react';
import axios from 'axios';
import { message, Button, Spin, Divider } from 'antd';
import './FoodStuffWallet.css'; // Import file CSS

const FoodStuffWallet = () => {
  const [foodStuffWalletData, setFoodStuffWalletData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expenseData, setExpenseData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [showExpense, setShowExpense] = useState(false);
  const [showIncome, setShowIncome] = useState(false);

  useEffect(() => {
    // Fetch data when component mounts
    fetchFoodStuffWalletData();
  }, []);

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

  const fetchExpenseData = async (id) => {
    try {
      const response = await axios.get(`https://soschildrenvillage.azurewebsites.net/api/Expenses/GetExpenseByFoodWalletId?Id=${id}`);
      const filteredExpenseData = response.data.map(expense => ({
        expenseAmount: expense.expenseAmount,
        description: expense.description,
        expenseday: expense.expenseday,
        houseId: expense.houseId
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
      const response = await axios.get(`https://soschildrenvillage.azurewebsites.net/api/Incomes/GetIncomeByFoodWallet?Id=${id}`);
      const filteredIncomeData = response.data.map(income => ({
        amount: income.amount ? income.amount : 'N/A',
        receiveday: income.receiveday,
        userAccountId: income.userAccountId
      }));
      setIncomeData(filteredIncomeData);
      setShowIncome(true);
      setShowExpense(false);
    } catch (error) {
      console.error(error);
      message.error('Failed to fetch income data');
    }
  };
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) {
      return 'N/A'; // Prevent error in case of null/undefined value
    }
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  if (!event) {
    return <div className="loading">Loading...</div>;
  }
  return (
    <div className="food-wallet-container">
      <h1 className="food-wallet-title">FoodStuff Wallet</h1>

      {loading ? (
        <Spin size="large" className="loading-spinner" />
      ) : (
        <div className="wallet-list">
          {foodStuffWalletData.length > 0 ? (
            <div className="wallet-items">
              {foodStuffWalletData.map((item) => (
                <div key={item.id} className="wallet-item">
                  <div><strong>Budget:</strong> {formatCurrency(item.budget)}</div>
                  <div className="wallet-actions">
                    <Button onClick={() => fetchExpenseData(item.id)} className="action-btn expense-btn">Show Expense</Button>
                    <Button onClick={() => fetchIncomeData(item.id)} className="action-btn income-btn">Show Income</Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No data available</p>
          )}
        </div>
      )}

      {/* Show Expense Data */}
      {showExpense && (
        <div className="data-section">
          <h2 className="data-title">Expense Data</h2>
          {expenseData.length > 0 ? (
            <div className="data-items">
              {expenseData.map((expense, index) => (
                <div key={index} className="data-item">
                  <div><strong>Expense Amount:</strong> {formatCurrency(expense.expenseAmount)}</div>
                  <div><strong>Description:</strong> {expense.description}</div>
                  <div><strong>Expense Day:</strong> {expense.expenseday}</div>
                  <div><strong>House ID:</strong> {expense.houseId}</div>
                </div>
              ))}
            </div>
          ) : (
            <p>No expense data available</p>
          )}
        </div>
      )}

      {/* Show Income Data */}
      {showIncome && (
        <div className="data-section">
          <h2 className="data-title">Income Data</h2>
          {incomeData.length > 0 ? (
            <div className="data-items">
              {incomeData.map((income, index) => (
                <div key={index} className="data-item">
                  <div><strong>Amount:</strong> {formatCurrency(income.amount)}</div>
                  <div><strong>Receive Day:</strong> {income.receiveday}</div>
                  <div><strong>User Account ID:</strong> {income.userAccountId}</div>
                </div>
              ))}
            </div>
          ) : (
            <p>No income data available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default FoodStuffWallet;
