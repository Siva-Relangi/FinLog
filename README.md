# 💰 FinLog - Personal Finance Tracker

A modern and feature-rich personal finance tracking app built with **React Native** and **Expo**. Easily manage your expenses, categorize spending, and analyze your financial habits with clean visuals and charts. FinLog brings simplicity and clarity to your financial journey.

## ✨ Features

### 📱 Core Functionality
- **Splash Screen**: Clean and animated FinLog branding
- **Add Expenses**: Record expenses with category, amount, and notes
- **Expense Management**: View, filter, and delete transactions
- **Data Persistence**: Local storage with AsyncStorage
- **Real-time Updates**: Instant synchronization across all screens

### 📊 Analytics & Insights
- **Summary Cards**: Track Today, This Week, and This Month totals
- **Category Breakdown**: Visualize expenses by category
- **Interactive Charts**:
  - Pie chart for monthly spending
  - Bar chart for Category Based spending
- **Percentage Analysis**: Category-based spending ratios

### 🔍 Search & Filtering
- **Search by Note/Category**
- **Filter by Category**
- **Sort by Latest Expense & Amount**

### 🏷️ Category Management
- **Predefined Categories**: Food 🍔, Travel ✈️, Shopping 🛍️, Bills 📄, Others 📌
- **Custom Categories**: Add personalized categories with icons
- **Delete/Edit Categories**: Full control over category list

### ⚙️ Settings & Data
- **Manage Categories**
- **Clear All Data** with confirmation
- **Restore Defaults** for quick reset

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- npm / yarn
- Expo CLI
- Emulator/Simulator or Expo Go app

### Installation

```bash
# Clone repository
git clone <your-repo-url>
cd FinLog

# Install dependencies
npm install
# or
yarn install

# Run development server
npm start
# or
yarn start
```

Run on device/emulator:
```bash
npm run android   # Android
npm run ios       # iOS
npm run web       # Web
```

---

## 🏗️ Project Structure

```
FinLog/
├── assets/                # App icons and splash assets
│   ├── adaptive-icon.png
│   ├── favicon.png
│   ├── icon.png
│   └── splash-icon.png
│
├── components/            # Reusable UI components
│   ├── AnimatedPressable.tsx
│   ├── AppHeader.tsx
│   ├── CategoryIcon.tsx
│   ├── ChartCard.tsx
│   ├── EmptyState.tsx
│   ├── ExpenseItem.tsx
│   ├── FilterBar.tsx
│   └── ToolCard.tsx
│
├── context/               # Global app context
│   └── DataContext.tsx
│
├── screens/               # App screens
│   ├── AddExpenseScreen.tsx
│   ├── HomeScreen.tsx
│   ├── Settingsscreen.tsx
│   └── SplashScreen.tsx
│
├── storage/               # Data persistence
│   └── storage.ts
│
├── theme/                 # App theming
│   └── theme.ts
│
├── types/                 # TypeScript types
│   └── index.ts
│
├── utils/                 # Utility functions
│   ├── date.ts
│   └── list.ts
│
├── .expo/                 # Expo configuration
├── .git/                  # Git repo files
├── .gitignore
├── app.json               # Expo config
├── App.tsx                # Root app component
├── index.ts               # Entry point
├── package.json           # Dependencies & scripts
├── package-lock.json
└── tsconfig.json          # TypeScript config
```

---

## 🎨 UI/UX
- **Minimalist & Modern**
- **Clean Typography & Icons**
- **Category Colors for clarity**
- **Smooth Transitions & Animations**
- **Dark & Light mode ready** (if enabled)

---

## 📱 Screens

### 1. Splash Screen
- Animated FinLog branding
- Auto-navigates to app

### 2. Home Screen
- Expense summary (Today, Week, Month)
- Expense list with search & filter
- Category-wise charts

### 3. Add Expense Screen
- Enter amount, category, and notes
- Validation & feedback

### 4. Settings Screen
- Add/Edit/Delete categories
- Reset & clear data options

---

## 🔧 Technical Stack
- **React Native + Expo**
- **React Navigation** (bottom tabs & stack)
- **AsyncStorage** for persistence
- **React Native Chart Kit** for charts
- **Date-fns** for date handling

---

## 📊 Data Models

```ts
interface Expense {
  id: string;
  amount: number;
  category: string;
  note?: string;
  date: string;
  timestamp: number;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}
```

---

## 🧪 Testing Checklist
- [ ] Add expense  
- [ ] Delete expense  
- [ ] Category filtering  
- [ ] Charts update correctly  
- [ ] Data persists after reload  
- [ ] Add/Delete category works  

---

## 📄 License
This project is licensed under the **MIT License**.

---

**Built with ❤️ using React Native & Expo**
