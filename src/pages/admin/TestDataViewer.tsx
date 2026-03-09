import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { api } from '@/services/api'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TableSkeleton } from '@/components/common/skeletons'

export default function TestDataViewer() {
    const [data, setData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchDatabaseData = async () => {
            try {
                const response = await api.get('/data/all')
                setData(response.data.data)
            } catch (err: any) {
                setError(err.message || 'Failed to open connection to the database.')
            } finally {
                setIsLoading(false)
            }
        }

        fetchDatabaseData()
    }, [])

    if (isLoading) return (
        <div className="p-6 max-w-[1400px] mx-auto space-y-6">
            <div>
                <div className="h-8 w-72 bg-muted animate-pulse rounded mb-2" />
                <div className="h-4 w-96 bg-muted animate-pulse rounded" />
            </div>
            <TableSkeleton rows={10} cols={5} />
        </div>
    )
    if (error) return <div className="p-8 text-center text-destructive">Error: {error}</div>

    const renderTable = (rows: any[]) => {
        if (!rows || rows.length === 0) return <p className="text-muted-foreground p-4">No data found in this table.</p>

        const keys = Object.keys(rows[0])

        return (
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                    <thead className="bg-muted text-muted-foreground font-medium uppercase text-xs">
                        <tr>
                            {keys.map((key) => (
                                <th key={key} className="px-4 py-3 border-b">{key}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {rows.map((row, i) => (
                            <tr key={i} className="hover:bg-muted/50 transition-colors">
                                {keys.map((key) => (
                                    <td key={key} className="px-4 py-3">
                                        {typeof row[key] === 'object' && row[key] !== null
                                            ? JSON.stringify(row[key])
                                            : String(row[key])}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }

    return (
        <div className="p-6 max-w-[1400px] mx-auto space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-heading mb-2">Supabase Database Viewer</h1>
                <p className="text-muted-foreground">Showing exact rows from the backend Supabase instance connected via FixMyHome Pro API.</p>
            </div>

            <Card className="shadow-elevated border-border">
                <CardHeader className="bg-muted/30 pb-4">
                    <CardTitle>Data Tables</CardTitle>
                    <CardDescription>Select a tab to view seed data</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Tabs defaultValue="users" className="w-full">
                        <TabsList className="w-full justify-start rounded-none border-b h-12 px-4 bg-transparent">
                            <TabsTrigger value="users" className="data-[state=active]:bg-muted">Users ({data?.users?.length || 0})</TabsTrigger>
                            <TabsTrigger value="technicians" className="data-[state=active]:bg-muted">Technicians ({data?.technicians?.length || 0})</TabsTrigger>
                            <TabsTrigger value="categories" className="data-[state=active]:bg-muted">Categories ({data?.categories?.length || 0})</TabsTrigger>
                            <TabsTrigger value="services" className="data-[state=active]:bg-muted">Services ({data?.services?.length || 0})</TabsTrigger>
                            <TabsTrigger value="bookings" className="data-[state=active]:bg-muted">Bookings ({data?.bookings?.length || 0})</TabsTrigger>
                        </TabsList>

                        <TabsContent value="users" className="m-0 bg-background">{renderTable(data?.users)}</TabsContent>
                        <TabsContent value="technicians" className="m-0 bg-background">{renderTable(data?.technicians)}</TabsContent>
                        <TabsContent value="categories" className="m-0 bg-background">{renderTable(data?.categories)}</TabsContent>
                        <TabsContent value="services" className="m-0 bg-background">{renderTable(data?.services)}</TabsContent>
                        <TabsContent value="bookings" className="m-0 bg-background">{renderTable(data?.bookings)}</TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}
