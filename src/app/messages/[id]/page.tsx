import { use } from 'react';
import ConversationPage from '@/components/messages/ConversationPage';

interface ConversationPageProps {
    readonly params: Promise<{
        id: string;
    }>;
}

export default function ConversationPageWrapper({ params }: ConversationPageProps) {
    const resolvedParams = use(params);
    const conversationId = resolvedParams.id;

    return <ConversationPage initialConversationId={conversationId} />;
} 