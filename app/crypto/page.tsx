"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

// Mock crypto data
const cryptoData = [
  { id: 'bitcoin', name: 'Bitcoin', price: 45000 },
  { id: 'ethereum', name: 'Ethereum', price: 3000 },
  { id: 'cardano', name: 'Cardano', price: 2 },
];

export default function CryptoPurchase() {
  const [amount, setAmount] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cryptoPrices, setCryptoPrices] = useState(cryptoData);
  const router = useRouter();
  const { toast } = useToast()

  useEffect(() => {
    // Fetch real-time crypto prices
    const fetchPrices = async () => {
      // TODO: Implement actual API call to get real-time prices
      // For now, we'll use the mock data
      setCryptoPrices(cryptoData);
    };

    fetchPrices();
    // Set up an interval to fetch prices periodically
    const interval = setInterval(fetchPrices, 60000); // every minute

    return () => clearInterval(interval);
  }, []);

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Implement actual crypto purchase logic
    console.log('Crypto purchase attempt:', { amount, selectedCrypto });
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    toast({
      title: "Crypto Purchase Successful",
      description: `${amount} USD worth of ${selectedCrypto} purchased`,
    })
    router.push('/dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Buy Cryptocurrency</CardTitle>
          <CardDescription>Purchase crypto with USD</CardDescription>
        </CardHeader>
        <form onSubmit={handlePurchase}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="amount">Amount (USD)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="crypto">Select Cryptocurrency</Label>
                <Select onValueChange={setSelectedCrypto} required>
                  <SelectTrigger id="crypto">
                    <SelectValue placeholder="Select cryptocurrency" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {cryptoPrices.map((crypto) => (
                      <SelectItem key={crypto.id} value={crypto.id}>
                        {crypto.name} - ${crypto.price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Buy Crypto
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}