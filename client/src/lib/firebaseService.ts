import { ref, set, get, push, update, onValue, DatabaseReference, remove } from 'firebase/database';
import { database } from './firebase';

// Types for PaySafe Security data
export interface Transaction {
  id?: string;
  amount: number;
  merchant: string;
  timestamp: number;
  riskScore: number;
  isFraudulent: boolean;
  userId: string;
  location?: string;
  category?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  riskProfile: 'low' | 'medium' | 'high';
  createdAt: number;
  lastLogin: number;
}

export interface SecurityAlert {
  id?: string;
  userId: string;
  type: 'suspicious_transaction' | 'unusual_activity' | 'fraud_detected';
  message: string;
  timestamp: number;
  isRead: boolean;
  transactionId?: string;
}

export class FirebaseService {
  // Transactions
  static async saveTransaction(transaction: Transaction): Promise<string> {
    const transactionsRef = ref(database, 'transactions');
    const newTransactionRef = push(transactionsRef);
    const data = { ...transaction, id: newTransactionRef.key, timestamp: Date.now() };
    await set(newTransactionRef, data);
    return newTransactionRef.key!;
  }

  static async getTransactions(userId: string): Promise<Transaction[]> {
    const transactionsRef = ref(database, 'transactions');
    const snapshot = await get(transactionsRef);
    const transactions: Transaction[] = [];
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const transaction = childSnapshot.val();
        if (transaction.userId === userId) {
          transactions.push(transaction);
        }
      });
    }
    return transactions.sort((a, b) => b.timestamp - a.timestamp);
  }

  static listenToTransactions(userId: string, callback: (transactions: Transaction[]) => void) {
    const transactionsRef = ref(database, 'transactions');
    const unsubscribe = onValue(transactionsRef, (snapshot) => {
      const transactions: Transaction[] = [];
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const transaction = childSnapshot.val();
          if (transaction.userId === userId) {
            transactions.push(transaction);
          }
        });
      }
      callback(transactions.sort((a, b) => b.timestamp - a.timestamp));
    });
    return unsubscribe;
  }

  static async deleteTransaction(transactionId: string): Promise<void> {
    const transactionRef = ref(database, `transactions/${transactionId}`);
    await remove(transactionRef);
  }

  // Users
  static async saveUser(user: User): Promise<void> {
    const userRef = ref(database, `users/${user.id}`);
    await set(userRef, {
      ...user,
      createdAt: Date.now(),
      lastLogin: Date.now()
    });
  }

  static async getUser(userId: string): Promise<User | null> {
    const userRef = ref(database, `users/${userId}`);
    const snapshot = await get(userRef);
    return snapshot.exists() ? snapshot.val() : null;
  }

  static async updateUserLastLogin(userId: string): Promise<void> {
    const userRef = ref(database, `users/${userId}`);
    await update(userRef, { lastLogin: Date.now() });
  }

  // Security Alerts
  static async createAlert(alert: SecurityAlert): Promise<string> {
    const alertsRef = ref(database, 'alerts');
    const newAlertRef = push(alertsRef);
    const data = { ...alert, id: newAlertRef.key, timestamp: Date.now(), isRead: false };
    await set(newAlertRef, data);
    return newAlertRef.key!;
  }

  static async getAlerts(userId: string): Promise<SecurityAlert[]> {
    const alertsRef = ref(database, 'alerts');
    const snapshot = await get(alertsRef);
    const alerts: SecurityAlert[] = [];
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const alert = childSnapshot.val();
        if (alert.userId === userId) {
          alerts.push(alert);
        }
      });
    }
    return alerts.sort((a, b) => b.timestamp - a.timestamp);
  }

  static async markAlertAsRead(alertId: string): Promise<void> {
    const alertRef = ref(database, `alerts/${alertId}`);
    await update(alertRef, { isRead: true });
  }

  static listenToAlerts(userId: string, callback: (alerts: SecurityAlert[]) => void) {
    const alertsRef = ref(database, 'alerts');
    const unsubscribe = onValue(alertsRef, (snapshot) => {
      const alerts: SecurityAlert[] = [];
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const alert = childSnapshot.val();
          if (alert.userId === userId) {
            alerts.push(alert);
          }
        });
      }
      callback(alerts.sort((a, b) => b.timestamp - a.timestamp));
    });
    return unsubscribe;
  }
}

export default FirebaseService; 