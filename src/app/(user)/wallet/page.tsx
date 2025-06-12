"use client";

import { useState, useEffect } from "react";
import { Header } from "../home/components/header";
import { Sidebar } from "../home/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  ArrowUpRight, 
  ArrowDownLeft,
  Coins,
  Receipt
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { fetchTransactionHistory, type Transaction } from "@/apis/coupon";
import { formatDistanceToNow } from "date-fns";

export default function WalletPage() {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  const isMobile = useIsMobile();

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      setLoading(true);
      
      // Load balance from localStorage
      const walletBalance = localStorage.getItem('wallet_val');
      setBalance(walletBalance ? parseFloat(walletBalance) : 0);

      // Load transaction history
      const transactionData = await fetchTransactionHistory();
      if (transactionData?.data) {
        // Flatten the transaction data structure
        const flatTransactions = transactionData.data.map(item => item.data);
        setTransactions(flatTransactions);
      }
    } catch (error) {
      console.error("Error loading wallet data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const getTransactionIcon = (transaction: Transaction) => {
    if (transaction.depositAmount > 0) {
      return <ArrowUpRight className="w-4 h-4 text-green-600" />;
    } else if (transaction.withdrawalAmount > 0) {
      return <ArrowDownLeft className="w-4 h-4 text-red-600" />;
    }
    return <Receipt className="w-4 h-4 text-muted-foreground" />;
  };

  const getTransactionAmount = (transaction: Transaction) => {
    if (transaction.depositAmount > 0) {
      return `+${formatCurrency(transaction.depositAmount)}`;
    } else if (transaction.withdrawalAmount > 0) {
      return `-${formatCurrency(transaction.withdrawalAmount)}`;
    }
    return formatCurrency(0);
  };

  const getTransactionColor = (transaction: Transaction) => {
    if (transaction.depositAmount > 0) {
      return "text-green-600";
    } else if (transaction.withdrawalAmount > 0) {
      return "text-red-600";
    }
    return "text-muted-foreground";
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      'completed': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'failed': 'bg-red-100 text-red-800',
      'cancelled': 'bg-gray-100 text-gray-800',
    };

    return (
      <Badge 
        variant="secondary" 
        className={statusColors[status.toLowerCase() as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}
      >
        {status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          {!isMobile && <Sidebar />}
          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="animate-pulse">
                <div className="h-8 bg-muted rounded w-1/4 mb-6" />
                <Card>
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-1/3" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-12 bg-muted rounded w-1/2" />
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        {!isMobile && <Sidebar />}
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">My Wallet</h1>
                <p className="text-muted-foreground">Manage your coins and transactions</p>
              </div>
            </div>

            {/* Balance Card */}
            <Card className="mb-8 relative overflow-hidden bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Coins className="h-4 w-4" />
                      Available Balance
                    </p>
                    <p className="text-4xl font-bold text-foreground">
                      {formatCurrency(balance)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Equivalent to {Math.floor(balance)} coins
                    </p>
                  </div>
                  <div className="p-4 bg-primary/10 rounded-full">
                    <Wallet className="h-12 w-12 text-primary" />
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full translate-y-12 -translate-x-12" />
              </CardContent>
            </Card>

            {/* Transaction History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Transaction History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <div className="text-center py-12">
                    <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No transactions yet</h3>
                    <p className="text-muted-foreground">
                      Your transaction history will appear here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div 
                        key={transaction._id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-muted rounded-full">
                            {getTransactionIcon(transaction)}
                          </div>
                          <div>
                            <p className="font-medium">{transaction.txnDescription}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              <span>
                                {formatDistanceToNow(new Date(transaction.txnDateTime), { 
                                  addSuffix: true 
                                })}
                              </span>
                              <span>•</span>
                              <span>{transaction.txnMode}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className={`font-semibold ${getTransactionColor(transaction)}`}>
                            {getTransactionAmount(transaction)}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {getStatusBadge(transaction.txnStatus)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}