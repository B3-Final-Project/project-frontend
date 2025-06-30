import MessagesList from '@/components/messages/MessagesList';

export default function MessagesPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto p-4">
                <div className="bg-white rounded-lg shadow-sm">
                    <MessagesList />
                </div>
            </div>
        </div>
    );
}
