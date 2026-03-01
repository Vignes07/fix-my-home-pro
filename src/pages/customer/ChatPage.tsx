import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Send, Paperclip } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/utils/cn'

const mockMessages = [
    { id: '1', sender: 'technician', text: 'Hi! I am on my way to your location.', time: '10:45 AM' },
    { id: '2', sender: 'customer', text: 'Great! How long will it take?', time: '10:46 AM' },
    { id: '3', sender: 'technician', text: 'I should be there in about 15 minutes. Please keep the area accessible.', time: '10:47 AM' },
    { id: '4', sender: 'customer', text: 'Sure, I will keep the door open. Is there anything I need to prepare?', time: '10:48 AM' },
    { id: '5', sender: 'technician', text: 'No special preparation needed. I have all the tools and equipment.', time: '10:49 AM' },
]

export default function ChatPage() {
    const { bookingId } = useParams()
    const [newMessage, setNewMessage] = useState('')

    const handleSend = () => {
        if (!newMessage.trim()) return
        // Would send via socket.io
        setNewMessage('')
    }

    return (
        <div className="flex h-[calc(100vh-4rem)] flex-col animate-fade-in">
            {/* Chat Header */}
            <div className="border-b border-border px-4 py-3">
                <div className="mx-auto flex max-w-3xl items-center gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary">RK</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">Rajesh Kumar</p>
                        <p className="text-xs text-muted-foreground">Booking #{bookingId?.slice(0, 8)}</p>
                    </div>
                    <div className="ml-auto flex h-2.5 w-2.5 items-center">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                        </span>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
                <div className="mx-auto max-w-3xl space-y-3">
                    {mockMessages.map((msg) => (
                        <div
                            key={msg.id}
                            className={cn(
                                'flex',
                                msg.sender === 'customer' ? 'justify-end' : 'justify-start'
                            )}
                        >
                            <div
                                className={cn(
                                    'max-w-[75%] rounded-2xl px-4 py-2.5',
                                    msg.sender === 'customer'
                                        ? 'rounded-br-md bg-primary text-white'
                                        : 'rounded-bl-md bg-muted'
                                )}
                            >
                                <p className="text-sm">{msg.text}</p>
                                <p className={cn(
                                    'mt-1 text-[10px]',
                                    msg.sender === 'customer' ? 'text-white/60' : 'text-muted-foreground'
                                )}>
                                    {msg.time}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Message Input */}
            <div className="border-t border-border px-4 py-3">
                <div className="mx-auto flex max-w-3xl items-center gap-2">
                    <Button variant="ghost" size="icon" className="shrink-0">
                        <Paperclip className="h-4 w-4" />
                    </Button>
                    <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        className="flex-1"
                    />
                    <Button size="icon" onClick={handleSend} className="shrink-0">
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
