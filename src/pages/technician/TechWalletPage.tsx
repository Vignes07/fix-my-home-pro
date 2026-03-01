import { useState } from 'react'
import { Wallet, ArrowUpRight, ArrowDownRight, CreditCard, Building2, IndianRupee } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/utils/cn'

const walletTransactions = [
    { id: '1', type: 'credit' as const, desc: 'Job payment - AC Service', amount: 319, date: '2026-02-25', time: '3:15 PM' },
    { id: '2', type: 'credit' as const, desc: 'Job payment - Pipe Fix', amount: 279, date: '2026-02-24', time: '5:30 PM' },
    { id: '3', type: 'debit' as const, desc: 'Withdrawal to bank', amount: 5000, date: '2026-02-23', time: '10:00 AM' },
    { id: '4', type: 'credit' as const, desc: 'Job payment - Wiring', amount: 399, date: '2026-02-22', time: '4:45 PM' },
    { id: '5', type: 'credit' as const, desc: 'Referral bonus', amount: 200, date: '2026-02-21', time: '12:00 PM' },
]

export default function TechWalletPage() {
    const [withdrawAmount, setWithdrawAmount] = useState('')

    return (
        <div className="animate-fade-in space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Wallet</h1>
                <p className="text-muted-foreground">Manage your earnings and withdrawals</p>
            </div>

            {/* Balance Card */}
            <Card className="border-0 bg-gradient-to-br from-primary to-accent text-white shadow-elevated">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-white/70">Available Balance</p>
                            <p className="mt-1 text-4xl font-bold">₹12,450</p>
                            <p className="mt-2 text-sm text-white/70">Last updated: Today 3:15 PM</p>
                        </div>
                        <div className="rounded-2xl bg-white/20 p-4">
                            <Wallet className="h-8 w-8" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Withdraw */}
                <Card className="border-0 shadow-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-primary" /> Withdraw to Bank
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="rounded-lg bg-muted/50 p-3">
                            <p className="text-xs text-muted-foreground">Bank Account</p>
                            <p className="font-medium">State Bank of India - ****5678</p>
                            <p className="text-xs text-muted-foreground">SBIN0001234</p>
                        </div>
                        <div className="space-y-2">
                            <Label>Amount to Withdraw</Label>
                            <div className="relative">
                                <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type="number"
                                    placeholder="Enter amount"
                                    className="pl-10"
                                    value={withdrawAmount}
                                    onChange={(e) => setWithdrawAmount(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                {[1000, 2000, 5000].map((amt) => (
                                    <button
                                        key={amt}
                                        type="button"
                                        onClick={() => setWithdrawAmount(String(amt))}
                                        className="rounded-lg border border-border px-3 py-1 text-xs font-medium hover:border-primary/30 transition-colors"
                                    >
                                        ₹{amt.toLocaleString()}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <Button className="w-full" size="lg" disabled={!withdrawAmount || Number(withdrawAmount) <= 0}>
                            Withdraw ₹{withdrawAmount || '0'}
                        </Button>
                        <p className="text-center text-xs text-muted-foreground">
                            Withdrawals are processed within 24 hours
                        </p>
                    </CardContent>
                </Card>

                {/* Transaction History */}
                <Card className="border-0 shadow-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-primary" /> Recent Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {walletTransactions.map((tx) => (
                                <div key={tx.id} className="flex items-center justify-between rounded-lg p-2 hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            'flex h-9 w-9 items-center justify-center rounded-full',
                                            tx.type === 'credit' ? 'bg-emerald-100 dark:bg-emerald-950' : 'bg-red-100 dark:bg-red-950'
                                        )}>
                                            {tx.type === 'credit' ? (
                                                <ArrowDownRight className="h-4 w-4 text-emerald-600" />
                                            ) : (
                                                <ArrowUpRight className="h-4 w-4 text-red-500" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{tx.desc}</p>
                                            <p className="text-xs text-muted-foreground">{tx.date} · {tx.time}</p>
                                        </div>
                                    </div>
                                    <span className={cn('font-bold', tx.type === 'credit' ? 'text-emerald-600' : 'text-red-500')}>
                                        {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
