"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Link from 'next/link';
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

// Mock data for the chart
const data = [
  { name: 'Jan', BDT: 4000, USD: 2400, BTC: 2400 },
  { name: 'Feb', BDT: 3000, USD: 1398, BTC: 2210 },
  { name: 'Mar', BDT: 2000, USD: 9800, BTC: 2290 },
  { name: 'Apr', BDT: 2780, USD: 3908, BTC: 2000 },
  { name: 'May', BDT: 1890, USD: 4800, BTC: 2181 },
  { name: 'Jun', BDT: 2390, USD: 3800, BTC: 2500 },
  { name: 'Jul', BDT: 3490, USD: 4300, BTC: 2100 },
];

export default function Dashboard() {
  const [balance, setBalance] = useState({ BDT: 10000, USD: 100, BTC: 0.005 });
  const [transferAmount, setTransferAmount] = useState('');
  const [transferCurrency, setTransferCurrency] = useState('BDT');
  const [recipient, setRecipient] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast()

  useEffect(() => {
    // Fetch user balance from API
    // This is a mock implementation
    const fetchBalance = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBalance({ BDT: 15000, USD: 150, BTC: 0.007 });
      setIsLoading(false);
    };

    fetchBalance();
  }, []);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Implement actual transfer logic
    console.log('Transfer:', { amount: transferAmount, currency: transferCurrency, recipient });
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    // Update balance (this is just a mock, real implementation would involve blockchain transactions)
    setBalance(prev => ({
      ...prev,
      [transferCurrency]: prev[transferCurrency as keyof typeof prev] - Number(transferAmount)
    }));
    setTransferAmount('');
    setRecipient('');
    setIsLoading(false);
    toast({
      title: "Transfer Successful",
      description: `${transferAmount} ${transferCurrency} sent to ${recipient}`,
    })
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Balance</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <>
                <p>BDT: {balance.BDT.toFixed(2)}</p>
                <p>USD: {balance.USD.toFixed(2)}</p>
                <p>BTC: {balance.BTC.toFixed(8)}</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Transfer</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTransfer}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="currency">Currency</Label>
                  <Select onValueChange={setTransferCurrency} defaultValue={transferCurrency}>
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="BDT">BDT</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="BTC">BTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="recipient">Recipient</Label>
                  <Input
                    id="recipient"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Transfer
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              <Button asChild>
                <Link href="/deposit">Deposit BDT</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/exchange">Convert Currency</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/crypto">Buy Crypto</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Balance History</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="BDT" stroke="#8884d8" />
              <Line type="monotone" dataKey="USD" stroke="#82ca9d" />
              <Line type="monotone" dataKey="BTC" stroke="#ffc658" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Tabs defaultValue="transactions" className="mt-8">
        <TabsList>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          <TabsTrigger value="exchange">Currency Exchange</TabsTrigger>
          <TabsTrigger value="crypto">Crypto Market</TabsTrigger>
        </TabsList>
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest financial activities</CardDescription>
            </CardHeader>
            <CardContent>
              {/* TODO: Implement transaction history */}
              <p>No recent transactions</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="exchange">
          <Card>
            <CardHeader>
              <CardTitle>Currency Exchange</CardTitle>
              <CardDescription>Convert between currencies</CardDescription>
            </CardHeader>
            <CardContent>
              {/* TODO: Implement currency exchange functionality */}
              <p>Currency exchange feature coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="crypto">
          <Card>
            <CardHeader>
              <CardTitle>Crypto Market</CardTitle>
              <CardDescription>Live cryptocurrency prices and trading</CardDescription>
            </CardHeader>
            <CardContent>
              {/* TODO: Implement crypto market functionality */}
              <p>Crypto market feature coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}