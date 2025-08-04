# Financial Tracker

A comprehensive personal finance management application built with React, Firebase, and Tailwind CSS.

## 🚀 Features

### 📊 Dashboard
- Real-time financial overview
- Monthly income and expense tracking
- AI-powered financial insights and recommendations
- Interactive charts and analytics

### 💰 Transactions
- Add, edit, and delete transactions
- Categorize income and expenses
- Add tags, location, and notes
- Receipt upload support
- Search and filter functionality

### 🎯 Savings Goals
- Set and track savings targets
- Monitor progress with visual indicators
- Add descriptions and notes
- Real-time progress updates

### 💳 Debt Management
- Track multiple debts
- Interest rate calculations
- Minimum payment tracking
- Debt repayment planning
- Monthly interest cost display

### ⚙️ Settings
- Account management
- Data export/import functionality
- Notification preferences
- Privacy and security settings

## 🛠️ Tech Stack

- **Frontend**: React 18, React Router DOM
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Firebase (Authentication, Firestore)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Notifications**: React Hot Toast

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd financial-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a Firebase project
   - Enable Authentication and Firestore
   - Create a `.env` file in the project root and add your Firebase config values (see Environment Variables section)

4. **Start the development server**
   ```bash
   npm start
   ```

## 🔧 Configuration

### Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password, Google)
4. Enable Firestore Database
5. Add your config values to the `.env` file

### Environment Variables
Create a `.env` file in the root directory:
```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

## 📱 Features Overview

### Authentication
- Email/Password login
- Google OAuth
- Password reset functionality
- Secure user sessions

### Data Management
- Real-time synchronization
- Offline support
- Data export/import
- Automatic backups

### Analytics
- Monthly spending analysis
- Category-wise breakdown
- Trend identification
- Personalized recommendations

## 🎨 UI/UX Features

- **Dark/Light Mode**: Toggle between themes
- **Responsive Design**: Works on all devices
- **Smooth Animations**: Framer Motion powered
- **Accessibility**: WCAG compliant
- **Mobile-First**: Optimized for mobile devices

## 📊 Data Structure

### Transactions
```javascript
{
  id: string,
  userId: string,
  type: 'income' | 'expense',
  amount: number,
  description: string,
  category: string,
  date: timestamp,
  tags: string[],
  location: string,
  notes: string,
  receiptUrl: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Savings Goals
```javascript
{
  id: string,
  userId: string,
  name: string,
  description: string,
  targetAmount: number,
  currentAmount: number,
  deadline: timestamp,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Debts
```javascript
{
  id: string,
  userId: string,
  name: string,
  description: string,
  amount: number,
  remainingAmount: number,
  interestRate: number,
  minPayment: number,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Firebase for backend services
- Tailwind CSS for styling
- Framer Motion for animations
- Lucide React for icons
- Recharts for data visualization

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Made with ❤️ using React and Firebase** 