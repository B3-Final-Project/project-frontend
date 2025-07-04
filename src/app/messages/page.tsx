import MessagesList from '@/components/messages/MessagesList';

export default function MessagesPage() {
    return (
        <div className="md:h-screen h-[calc(100vh-50px)] bg-gray-50">
            <MessagesList />
        </div>
    );
}
