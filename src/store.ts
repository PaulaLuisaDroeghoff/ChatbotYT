// store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AccountManagementState {
  userData: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    street: string;
    postCode: string;
    city: string;
    country: string;
    email: string;
    notificationsEnabled: boolean;
  };
  passwordData: {
    oldPassword: string;
    newPassword: string;
  };
  passwordMessage: string;
  editingField: string | null;
  isPasswordModalOpen: boolean;
  isDeleteModalOpen: boolean;

  updateUserData: (key: string, value: string) => void;
  toggleNotifications: () => void;
  setEditingField: (field: string | null) => void;
  handlePasswordChange: (field: string, value: string) => void;
  setPasswordMessage: (message: string) => void;
  togglePasswordModal: () => void;
  toggleDeleteModal: () => void;
  resetPasswordData: () => void;
  // New properties for BankConnections
  bankConnections: BankConnection[];
  addConnection: (connection: BankConnection) => void;
  removeConnection: (id: number) => void;
}

interface Category {
  icon: string;
  title: string;
  amount: number;
  route: string;
}

interface SavingGoal {
  image: string;     
  title: string;
  totalAmount: number;
  savedAmount: number;
  milestones: string[];
  progress: number;  
  route: string;   
}  

interface Transaction {
  id: number;
  transaction: string;
  category: string;
  amount: number;
  date: string;
}

interface BankConnection {
  id: number;
  bankName: string;
  accountType: string;
  accountNumber: string;
  sortCode: string;
  iban: string;
  bic: string;
  lastSynced: string;
  lastFourDigits: string;
}

interface BudgetState extends AccountManagementState {
  categories: Category[];
  totalBudget: number;
  addCategory: (newCategory: Category) => void;
  updateCategory: (title: string, amount: number) => void;
  savingGoals: SavingGoal[];
  addSavingGoal: (goal: SavingGoal) => void;
  deleteSavingGoal: (index: number) => void;
  updateTotalBudget: (newBudget: number) => void;
  transactions: Record<string, Transaction[]>; // key is category, value is list of transactions for that category
  addTransaction: (category: string, transaction: Transaction) => void;
  updateTransaction: (category: string, id: number, updatedTransaction: Partial<Transaction>) => void;
  deleteTransaction: (category: string, id: number) => void;
}

const useBudgetStore = create<BudgetState>()(
  persist(
    (set) => ({
      categories: [
        { icon: 'ReceiptText', title: 'Utilities', amount: 75, route: '/transactions?budget=utilities' },
        { icon: 'House', title: 'Rent', amount: 1200, route: '/transactions?budget=rent' },
        { icon: 'CarFront', title: 'Transportation', amount: 63, route: '/transactions?budget=transportation' },
        { icon: 'ShoppingBasket', title: 'Groceries', amount: 510, route: '/transactions?budget=groceries' },
        { icon: 'RollerCoaster', title: 'Entertainment', amount: 267, route: '/transactions?budget=entertainment' },
        { icon: 'Dumbbell', title: 'Sports', amount: 150, route: '/transactions?budget=sports' },
      ],
      totalBudget: 2900,
      updateTotalBudget: (newBudget: number) =>
        set((state) => ({
          totalBudget: state.totalBudget + newBudget,
        })),
      addCategory: (newCategory) =>
        set((state) => ({
          categories: [...state.categories, newCategory],
        })),
      updateCategory: (title, amount) =>
        set((state) => ({
          categories: state.categories.map((cat) =>
            cat.title === title ? { ...cat, amount } : cat
          ),
        })),
      savingGoals: [
        {
          image: "/Umbrella.png", 
          title: 'Beach Vacation', 
          totalAmount: 2000,
          savedAmount:1400,
          milestones: ['Book flight', 'Reserve hotel'],
          progress: 70, 
          route: '/goaldetail?goal=beachvacation'
        },
        {
          image: 'Car.jpeg', 
          title: 'New Car', 
          totalAmount: 25000,
          savedAmount: 6250,
          milestones: ['Car itself', 'Insurance'],
          progress: 25, 
          route: '/goaldetail?goal=newcar'
        },
        {
          image: '/Machine.jpg', 
          title: 'Coffee Machine', 
          totalAmount: 500, 
          savedAmount: 350,
          milestones: ['Buy the machines', 'Buy coffee grinder'],
          progress: 70, 
          route: '/goaldetail?goal=coffeemachine'
        },
      ],
      addSavingGoal: (goal) =>
        set((state) => ({
          savingGoals: [...state.savingGoals, goal],
        })),
      deleteSavingGoal: (index) =>
        set((state) => ({
          savingGoals: state.savingGoals.filter((_, i) => i !== index),
        })),
      updateSavingGoalAmount: (goalTitle: string, newSavedAmount: number) =>
        set((state) => ({
          savingGoals: state.savingGoals.map((goal) =>
            goal.title === goalTitle ? { ...goal, savedAmount: newSavedAmount } : goal
          ),
        })),
      transactions: {
        entertainment: [
          { id: 1, transaction: 'Cinema Tickets', category: 'Entertainment', amount: 50.0, date: '2025-03-09' },
          { id: 2, transaction: 'Theater Show', category: 'Entertainment', amount: 60.0, date: '2025-03-08' },
          { id: 3, transaction: 'Concert', category: 'Entertainment', amount: 75.0, date: '2025-03-06' },
          { id: 4, transaction: 'Amusement Park', category: 'Entertainment', amount: 82.0, date: '2025-03-05' },
        ],
        groceries: [
          { id: 1, transaction: 'Tesco', category: 'Grocery', amount: 50.5, date: '2025-03-09' },
          { id: 2, transaction: 'Waitrose', category: 'Grocery', amount: 16.8, date: '2025-03-09' },
          { id: 3, transaction: 'M&S Food', category: 'Grocery', amount: 20.65, date: '2025-03-08' },
          { id: 4, transaction: 'Asda', category: 'Grocery', amount: 102.3, date: '2025-03-06' },
        ],
        rent: [
          { id: 1, transaction: 'Flat Rent', category: 'Rent', amount: 1000.0, date: '2025-03-09' },
          { id: 2, transaction: 'Parking Spot Rent', category: 'Rent', amount: 200.0, date: '2025-03-08' },
        ],
        sports: [
          { id: 1, transaction: 'Gym Membership', category: 'Sports', amount: 50.0, date: '2025-03-09' },
          { id: 2, transaction: 'Tennis Lessons', category: 'Sports', amount: 40.0, date: '2025-03-08' },
          { id: 3, transaction: 'Swimming Pool', category: 'Sports', amount: 30.0, date: '2025-03-06' },
          { id: 4, transaction: 'Yoga Class', category: 'Sports', amount: 30.0, date: '2025-03-05' },
        ],
        transportation: [
          { id: 1, transaction: 'Bus Ticket', category: 'Transport', amount: 15.0, date: '2025-03-09' },
          { id: 2, transaction: 'Train Ride', category: 'Transport', amount: 20.0, date: '2025-03-08' },
          { id: 3, transaction: 'Taxi', category: 'Transport', amount: 18.0, date: '2025-03-06' },
          { id: 4, transaction: 'Bike Rental', category: 'Transport', amount: 10.0, date: '2025-03-05' },
        ],
        utilities: [
          { id: 1, transaction: 'Water Bill', category: 'Utilities', amount: 20.0, date: '2025-03-09' },
          { id: 2, transaction: 'Gas', category: 'Utilities', amount: 15.0, date: '2025-03-08' },
          { id: 3, transaction: 'Wifi', category: 'Utilities', amount: 20.0, date: '2025-03-06' },
          { id: 4, transaction: 'Electricity', category: 'Utilities', amount: 20.0, date: '2025-03-05' },
        ],
      },
      setTransactions: (transactions) => set({ transactions }),

      addTransaction: (category, transaction) =>
        set((state) => ({
          transactions: {
            ...state.transactions,
            [category]: [
              ...state.transactions[category],
              transaction,
            ],
          },
        })),
      updateTransaction: (category, id, updatedTransaction) =>
        set((state) => ({
          transactions: {
            ...state.transactions,
            [category]: state.transactions[category].map((t) =>
              t.id === id ? { ...t, ...updatedTransaction } : t
            ),
          },
        })),
      deleteTransaction: (category, id) =>
        set((state) => ({
          transactions: {
            ...state.transactions,
            [category]: state.transactions[category].filter((t) => t.id !== id),
          },
        })),
      
      userData: {
        firstName: 'David',
        lastName: 'Smith',
        dateOfBirth: '1990-01-01',
        street: '123 Main St',
        postCode: '12345',
        city: 'London',
        country: 'United Kingdom',
        email: 'user@dreamstack.com',
        notificationsEnabled: true,
      },
      passwordData: {
        oldPassword: '',
        newPassword: '',
      },
      passwordMessage: '',
      editingField: null,
      isPasswordModalOpen: false,
      isDeleteModalOpen: false,

      
      // Bank connections state
      bankConnections: [
        {
          id: 1,
          bankName: 'Barclays',
          accountType: 'Checking',
          accountNumber: '12345678',
          sortCode: '12-34-56',
          iban: 'GB29NWBK60161331926819',
          bic: 'NWBKGB2L',
          lastFourDigits: '4321',
          lastSynced: '2 hours ago',
        },
        {
          id: 2,
          bankName: 'HSBC',
          accountType: 'Savings',
          accountNumber: '87654321',
          sortCode: '65-43-21',
          iban: 'GB29HBUK60161331926819',
          bic: 'HBUKGB4B',
          lastFourDigits: '7890',
          lastSynced: '1 day ago',
        },
      ],

      // Actions to modify bank connections
      addConnection: (connection) =>
        set((state) => ({
          bankConnections: [...state.bankConnections, connection],
        })),

      removeConnection: (id) =>
        set((state) => ({
          bankConnections: state.bankConnections.filter((conn) => conn.id !== id),
        })),

      updateUserData: (key, value) =>
        set((state) => ({
          userData: { ...state.userData, [key]: value },
        })),

      toggleNotifications: () =>
        set((state) => ({
          userData: { ...state.userData, notificationsEnabled: !state.userData.notificationsEnabled },
        })),

      setEditingField: (field) => set({ editingField: field }),

      handlePasswordChange: (field, value) =>
        set((state) => ({
          passwordData: { ...state.passwordData, [field]: value },
        })),

      setPasswordMessage: (message) => set({ passwordMessage: message }),

      togglePasswordModal: () => set((state) => ({ isPasswordModalOpen: !state.isPasswordModalOpen })),

      toggleDeleteModal: () => set((state) => ({ isDeleteModalOpen: !state.isDeleteModalOpen })),

      resetPasswordData: () =>
        set({
          passwordData: { oldPassword: '', newPassword: '' },
          passwordMessage: '',
        }),
    }),
    {
      name: 'budget-store', // unique name
    }
  )
);

export default useBudgetStore;
