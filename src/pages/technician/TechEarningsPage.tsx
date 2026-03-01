import { DollarSign, TrendingUp, Calendar, ArrowUpRight, ArrowDownRight, BarChart3 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const earningStats = [
    { label: 'Today', value: '₹1,247', change: '+₹348', up: true },
    { label: 'This Week', value: '₹8,450', change: '+₹1,200', up: true },
    { label: 'This Month', value: '₹32,500', change: '+18%', up: true },
    { label: 'Last Month', value: '₹28,350', change: '-5%', up: false },
]

const transactions = [
    { id: '1', service: 'AC Regular Service', customer: 'Priya S.', date: '2026-02-25', amount: 399, commission: 80, net: 319 },
    { id: '2', service: 'Pipe Leak Fix', customer: 'Arjun M.', date: '2026-02-24', amount: 349, commission: 70, net: 279 },
    { id: '3', service: 'Wiring & Rewiring', customer: 'Kumar K.', date: '2026-02-24', amount: 499, commission: 100, net: 399 },
    { id: '4', service: 'Switch Repair', customer: 'Meena R.', date: '2026-02-23', amount: 149, commission: 30, net: 119 },
    { id: '5', service: 'Tap Repair', customer: 'Suresh G.', date: '2026-02-23', amount: 199, commission: 40, net: 159 },
]

export default function TechEarningsPage() {
    return (
        <div className="animate-fade-in space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Earnings</h1>
                <p className="text-muted-foreground">Track your income and commissions</p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {earningStats.map((stat) => (
                    <Card key={stat.label} className="border-0 shadow-card">
                        <CardContent className="p-5">
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                            <p className="mt-1 text-2xl font-bold">{stat.value}</p>
                            <div className={`mt-1 flex items-center gap-1 text-xs font-medium ${stat.up ? 'text-emerald-600' : 'text-red-500'}`}>
                                {stat.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                                {stat.change}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Chart Placeholder */}
            <Card className="border-0 shadow-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-primary" /> Earnings Trend
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex h-48 items-center justify-center rounded-xl bg-muted/50">
                        <div className="text-center">
                            <BarChart3 className="mx-auto mb-2 h-10 w-10 text-muted-foreground/50" />
                            <p className="text-sm text-muted-foreground">Chart will be integrated with Recharts</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Transaction History */}
            <Card className="border-0 shadow-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-primary" /> Recent Transactions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="pb-3 text-left font-medium text-muted-foreground">Service</th>
                                    <th className="pb-3 text-left font-medium text-muted-foreground">Customer</th>
                                    <th className="pb-3 text-left font-medium text-muted-foreground">Date</th>
                                    <th className="pb-3 text-right font-medium text-muted-foreground">Amount</th>
                                    <th className="pb-3 text-right font-medium text-muted-foreground">Commission</th>
                                    <th className="pb-3 text-right font-medium text-muted-foreground">Net</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((tx) => (
                                    <tr key={tx.id} className="border-b border-border/50 last:border-0">
                                        <td className="py-3 font-medium">{tx.service}</td>
                                        <td className="py-3 text-muted-foreground">{tx.customer}</td>
                                        <td className="py-3 text-muted-foreground">{tx.date}</td>
                                        <td className="py-3 text-right">₹{tx.amount}</td>
                                        <td className="py-3 text-right text-red-500">-₹{tx.commission}</td>
                                        <td className="py-3 text-right font-bold text-emerald-600">₹{tx.net}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
