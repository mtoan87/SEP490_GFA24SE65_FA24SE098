import { useState, useEffect } from 'react';
import axios from 'axios';
import { message, Button } from 'antd';

const HealthWallet = () => {
  const [healthWalletData, setHealthWalletData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expenseData, setExpenseData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [showExpense, setShowExpense] = useState(false);
  const [showIncome, setShowIncome] = useState(false);

  useEffect(() => {
    // Fetch data when component mounts
    fetchHealthWalletData();
  }, []);

  const fetchHealthWalletData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://localhost:7073/api/HealthWallet/GetHealthWalletArray');
      setHealthWalletData(response.data);
    } catch (error) {
      console.error(error);
      message.error('Failed to fetch health wallet data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch Expense data based on HealthWallet ID
  const fetchExpenseData = async (id) => {
    try {
      const response = await axios.get(`https://localhost:7073/api/Expenses/GetExpenseByHealthWalletId?Id=${id}`);
      
      // Lọc và lấy chỉ những field cần thiết
      const filteredExpenseData = response.data.map(expense => ({
        expenseAmount: expense.expenseAmount,
        description: expense.description,
        expenseday: expense.expenseday,
        houseId: expense.houseId
      }));

      setExpenseData(filteredExpenseData);
      setShowExpense(true);
      setShowIncome(false); // Khi hiển thị Expense thì ẩn Income
    } catch (error) {
      console.error(error);
      message.error('Failed to fetch expense data');
    }
  };

  // Fetch Income data based on HealthWallet ID
  const fetchIncomeData = async (id) => {
    try {
      const response = await axios.get(`https://localhost:7073/api/Incomes/GetIncomeByHealthWallet?Id=${id}`);
      
      // Lọc và lấy chỉ những field cần thiết
      const filteredIncomeData = response.data.map(income => ({
        amount: income.amount ? income.amount : 'N/A',  // Nếu amount không có thì thay bằng 'N/A'
        receiveday: income.receiveday,
        userAccountId: income.userAccountId
      }));

      setIncomeData(filteredIncomeData);
      setShowIncome(true);
      setShowExpense(false); // Khi hiển thị Income thì ẩn Expense
    } catch (error) {
      console.error(error);
      message.error('Failed to fetch income data');
    }
  };

  return (
    <div>
      <h1>Health Wallet</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {healthWalletData.length > 0 ? (
            <ul>
              {healthWalletData.map((item) => (
                <li key={item.id} style={{ marginBottom: '16px' }}>
                  <div>
                    <strong>ID:</strong> {item.id}
                  </div>
                  <div>
                    <strong>Budget:</strong> {item.budget}
                  </div>
                  <div>
                    <strong>User Account ID:</strong> {item.userAccountId}
                  </div>
                  {/* Add buttons to fetch Expense and Income data */}
                  <Button onClick={() => fetchExpenseData(item.id)} style={{ marginRight: '8px' }}>Show Expense</Button>
                  <Button onClick={() => fetchIncomeData(item.id)}>Show Income</Button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No data available</p>
          )}
        </div>
      )}

      {/* Show Expense Data */}
      {showExpense && (
        <div>
          <h2>Expense Data</h2>
          {expenseData.length > 0 ? (
            <ul>
              {expenseData.map((expense, index) => (
                <li key={index}>
                  <div>
                    <strong>Expense Amount:</strong> {expense.expenseAmount}
                  </div>
                  <div>
                    <strong>Description:</strong> {expense.description}
                  </div>
                  <div>
                    <strong>Expense Day:</strong> {expense.expenseday}
                  </div>
                  <div>
                    <strong>House ID:</strong> {expense.houseId}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No expense data available</p>
          )}
        </div>
      )}

      {/* Show Income Data */}
      {showIncome && (
        <div>
          <h2>Income Data</h2>
          {incomeData.length > 0 ? (
            <ul>
              {incomeData.map((income, index) => (
                <li key={index}>
                  <div>
                    <strong>Amount:</strong> {income.amount}
                  </div>
                  <div>
                    <strong>Receive Day:</strong> {income.receiveday}
                  </div>
                  <div>
                    <strong>User Account ID:</strong> {income.userAccountId}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No income data available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default HealthWallet;
