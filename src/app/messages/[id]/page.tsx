import { use } from 'react';
import ConversationDetail from '@/components/messages/ConversationDetail';

interface ConversationPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function ConversationPage({ params }: ConversationPageProps) {
    const resolvedParams = use(params);
    const conversationId = parseInt(resolvedParams.id);

    return <ConversationDetail conversationId={conversationId} />;
} 