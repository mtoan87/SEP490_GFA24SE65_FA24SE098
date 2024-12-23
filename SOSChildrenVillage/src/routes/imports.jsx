// Admin Layout imports
import TableLayout from '../components/layout/Admin/Layout/Table/TableLayout';
import DashboardLayout from '../components/layout/Admin/Layout/Dashboard/DashboardLayout';

// Admin Page imports
import AdminDashboard from '../pages/Admin/Dashboard/AdminDashboard';
import UserManagement from '../pages/Admin/User/UserManagement';
import HouseManagement from '../pages/Admin/Houses/HouseManagement';
import ChildManagement from '../pages/Admin/Child/ChildrenManagement';
import AcademicReport from '../pages/Admin/Academic/AcademicReport';
import BookingManagement from '../pages/Admin/Bookings/BookingManagement';
import BookingSlotManagement from '../pages/Admin/BookingSlots/BookingSlotManagement';
import DonationManagement from '../pages/Admin/Donations/DonationManagement';
import EventManagement from '../pages/Admin/Events/EventManagement';
import ExpenseManagement from '../pages/Admin/Expense/ExpenseManagement';
import FacilitiesWallet from '../pages/Admin/FacilitiesWallet/FacilitiesWallet';
import FoodStuffWallet from '../pages/Admin/FoodStuffWallet/FoodStuffWallet';
import HealthReport from '../pages/Admin/Health/HealthReport';
import HealthWallet from '../pages/Admin/HealthWallet/HealthWallet';
import IncomeManagement from '../pages/Admin/Income/IncomeManagement';
import NecessitiesWallet from '../pages/Admin/NecessitiesWallet/NecessitiesWallet';
import PaymentsManagement from '../pages/Admin/Payments/PaymentsManagement';
import RolesManagement from '../pages/Admin/Roles/RolesManagement';
import SystemWallet from '../pages/Admin/SystemWallet/SystemWallet';
import TransactionManagement from '../pages/Admin/Transactions/TransactionManagement';
import VillageManagement from '../pages/Admin/Villages/VillageManagement';

// Home and Authentication imports
import HomePages from '../components/layout/HomePage/HomePage';
import Login from '../components/layout/Authenication/Login';
import Register from '../components/layout/Authenication/Register';
import UserDetail from '../components/layout/User/UserProfile';
import EditUserProfile from '../components/layout/User/EditUserProfile';
import ChangePasswordPage from '../components/layout/User/ChangePasswordPage';
import HistoryPage from '../components/layout/History/HistoryPage';

// Event and Child Page imports
import ChildDetailPage from '../components/layout/Child/ChildDetailPage';
import EventDetailPage from '../components/layout/Event/EventDetailPage';

// Financial Page imports
import Donate from '../components/layout/Donation/DonatePage';
import DonateHistoryPage from '../components/layout/User/DonateHistoryPage';
import PaymentReturnPage from '../components/layout/Donation/PaymentReturnPage';
import VillageHistoryPage from '../components/layout/User/VillageHistoryPage';
import ListHousePage from '../components/layout/Booking/ListHousePage';
import BookingHistoryPage from '../components/layout/Booking/BookingHistoryPage';

export {
    // Admin Layout
    TableLayout,
    DashboardLayout,

    // Admin Pages
    AdminDashboard,
    UserManagement,
    HouseManagement,
    ChildManagement,
    AcademicReport,
    BookingManagement,
    BookingSlotManagement,
    DonationManagement,
    EventManagement,
    ExpenseManagement,
    FacilitiesWallet,
    FoodStuffWallet,
    HealthReport,
    HealthWallet,
    IncomeManagement,
    NecessitiesWallet,
    PaymentsManagement,
    RolesManagement,
    SystemWallet,
    TransactionManagement,
    VillageManagement,

    // Home and Authentication
    HomePages,
    Login,
    Register,
    UserDetail,
    EditUserProfile,
    ChangePasswordPage,
    HistoryPage,

    // Event and Child Pages
    ChildDetailPage,
    EventDetailPage,

    // Financial Pages
    Donate,
    DonateHistoryPage,
    PaymentReturnPage,
    VillageHistoryPage,
    ListHousePage,
    BookingHistoryPage
};


// import { createBrowserRouter, Navigate } from 'react-router-dom';
// import AdminLayout from '../components/layout/Admin/AdminLayout';
// import AdminDashboard from '../pages/Admin/Dashboard/AdminDashboard';
// import UserManagement from '../pages/Admin/User/UserManagement';
// import HouseManagement from '../pages/Admin/Houses/HouseManagement';
// import ChildManagement from '../pages/Admin/Child/ChildrenManagement';
// import HomePages from '../pages/Home/HomePage';
// import Login from '../pages/Authenication/Login';
// import UserDetail from '../pages/User/UserProfile';
// import Register from '../pages/Authenication/Register';
// import Donate from '../pages/Donates/DonatePage';
// // import { element } from 'prop-types';
// import PaymentReturnPage from '../pages/Donates/PaymentReturnPage';
// import EditUserProfile from '../pages/User/EditUserProfile';
// import EventDetailPage from '../pages/EventPage/EventDetailPage';
// import ChildDetailPage from '../pages/ChildPage/ChildDetailPage';
// import DonateHistoryPage from '../pages/User/DonateHistoryPage';