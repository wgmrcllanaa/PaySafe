import { useState, useEffect } from 'react';
import FirebaseService, { Transaction } from '@/lib/firebaseService';

export interface ScanHistoryItem extends Transaction {
  message: string;
  platform: string;
  reasons: string[];
}

export const useScanHistory = (userId: string | null) => {
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setScanHistory([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Listen to real-time updates
    const unsubscribe = FirebaseService.listenToTransactions(userId, (transactions) => {
      // Convert transactions to scan history format
      const historyItems: ScanHistoryItem[] = transactions.map(transaction => ({
        ...transaction,
        message: transaction.merchant || 'Unknown message',
        platform: 'SMS',
        reasons: transaction.isFraudulent ? ['High risk score detected'] : ['Message appears safe']
      }));
      
      setScanHistory(historyItems);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const addScanResult = async (scanData: {
    message: string;
    status: 'SCAM' | 'SAFE';
    probability: number;
    reasons: string;
    platform?: string;
  }) => {
    if (!userId) return;

    try {
      const transaction: Transaction = {
        amount: 0, // Not applicable for message scans
        merchant: scanData.message,
        timestamp: Date.now(),
        riskScore: scanData.probability,
        isFraudulent: scanData.status === 'SCAM',
        userId,
        category: 'message_scan',
        location: 'Philippines'
      };

      await FirebaseService.saveTransaction(transaction);

      // Create alert if its a scam
      if (scanData.status === 'SCAM') {
        await FirebaseService.createAlert({
          userId,
          type: 'suspicious_transaction',
          message: `Scam detected in message: "${scanData.message.substring(0, 50)}..."`,
          timestamp: Date.now(),
          isRead: false,
          transactionId: transaction.id
        });
      }
    } catch (err) {
      console.error('Error saving scan result:', err);
      setError('Failed to save scan result');
    }
  };

  const deleteScan = async (scanId: string) => {
    try {
      // Delete from Firebase
      await FirebaseService.deleteTransaction(scanId);
      // The real-time listener will automatically update the local state
    } catch (err) {
      console.error('Error deleting scan:', err);
      setError('Failed to delete scan');
    }
  };

  return {
    scanHistory,
    isLoading,
    error,
    addScanResult,
    deleteScan
  };
}; 