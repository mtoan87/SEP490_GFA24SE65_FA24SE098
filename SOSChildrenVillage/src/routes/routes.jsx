import { createBrowserRouter, Navigate } from './routerConfig';
import {
    TableLayout,
    DashboardLayout,
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
    ActivityManagement,
    ChildNeedManagement,
    ChildProgressManagement,
    InventoryManagement,
    SchoolManagement,
    SubjectsManagement,
    TransferHistoryManagement,
    TransferRequestManagement,
    HomePages,
    Login,
    Register,
    UserDetail,
    EditUserProfile,
    ChildDetailPage,
    EventDetailPage,
    Donate,
    DonateHistoryPage,
    PaymentReturnPage,
    ChangePasswordPage,
    VillageHistoryPage,
    ListHousePage,
    BookingHistoryPage,
    HistoryPage,
    TransparencyPage,
    VillageDetailPage,
    HouseDetailPage,
    GoogleAuth,
    ChildrenBadManagement,
} from './imports';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/home" replace />
  },
  {
    path: '/home',
    element: <HomePages />,
  },
  {
    path: '/admin',
    children: [
      // Dashboard Route
      {
        element: <DashboardLayout />,
        children: [
          {
            path: '',
            element: <AdminDashboard />,
          },
        ],
      },

      // Table Routes
      {
        element: <TableLayout />,
        children: [
          {
            path: 'user-management',
            element: <UserManagement />,
          },
          {
            path: 'house-management',
            element: <HouseManagement />,
          },
          {
            path: 'child-management',
            element: <ChildManagement />,
          },
          {
            path: 'village-management',
            element: <VillageManagement />,
          },
          {
            path: 'academic-report',
            element: <AcademicReport />,
          },
          {
            path: 'booking-management',
            element: <BookingManagement />,
          },
          {
            path: 'booking-slot-management',
            element: <BookingSlotManagement />,
          },
          {
            path: 'donation-management',
            element: <DonationManagement />,
          },
          {
            path: 'event-management',
            element: <EventManagement />,
          },
          {
            path: 'expense-management',
            element: <ExpenseManagement />,
          },
          {
            path: 'children-bad-management',
            element: <ChildrenBadManagement />,
          },
          {
            path: 'facilities-wallet',
            element: <FacilitiesWallet />,
          },
          {
            path: 'foodstuff-wallet',
            element: <FoodStuffWallet />,
          },
          {
            path: 'health-report',
            element: <HealthReport />,
          },
          {
            path: 'health-wallet',
            element: <HealthWallet />,
          },
          {
            path: 'income-management',
            element: <IncomeManagement />,
          },
          {
            path: 'necessities-wallet',
            element: <NecessitiesWallet />,
          },
          {
            path: 'payment-management',
            element: <PaymentsManagement />,
          },
          {
            path: 'roles-management',
            element: <RolesManagement />,
          },
          {
            path: 'system-wallet',
            element: <SystemWallet />,
          },
          {
            path: 'transaction-management',
            element: <TransactionManagement />,
          },
          {
            path: 'activity-management',
            element: <ActivityManagement />,
          },
          {
            path: 'child-need-management',
            element: <ChildNeedManagement />,
          },
          {
            path: 'child-progress-management',
            element: <ChildProgressManagement />,
          },
          {
            path: 'inventory-management',
            element: <InventoryManagement />,
          },
          {
            path: 'school-management',
            element: <SchoolManagement />,
          },
          {
            path: 'subjects-management',
            element: <SubjectsManagement />,
          },
          {
            path: 'transfer-history-management',
            element: <TransferHistoryManagement />,
          },
          {
            path: 'transfer-request-management',
            element: <TransferRequestManagement />,
          },
        ],
      },
    ],
  },

  // Authentication routes
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/callback',
    element: <GoogleAuth />,
  },

  // User routes
  {
    path: '/userdetail',
    element: <UserDetail />,
  },
  {
    path: '/edituserprofile',
    element: <EditUserProfile />,
  },
  {
    path: '/changepassword',
    element: <ChangePasswordPage />,
  },
  {
    path: '/list-house/:villageId',
    element: <ListHousePage/>,
  },
  {
    path: '/bookinghistory',
    element: <BookingHistoryPage />,
  },
  {
    path: '/history',
    element: <HistoryPage />,
  },
  {
    path: '/transparency',
    element: <TransparencyPage />,
  },
  // Event and Child routes
  {
    path: '/eventdetail/:id',
    element: <EventDetailPage />,
  },
  {
    path: '/childdetail/:id',
    element: <ChildDetailPage />,
  },
  {
    path: '/villagedetail/:id',
    element: <VillageDetailPage />,
  },
  {
    path: '/housedetail/:id',
    element: <HouseDetailPage />,
  },

  // Financial routes
  {
    path: '/donateHistory',
    element: <DonateHistoryPage />,
  },
  {
    path: '/villageHistory',
    element: <VillageHistoryPage />,
  },
  {
    path: '/donate',
    element: <Donate />,
  },
  {
    path: '/paymentreturn',
    element: <PaymentReturnPage />,
  },

  // Fallback route
  {
    path: '*',
    element: <Navigate to="/home" replace />,
  },
]);

export default router;