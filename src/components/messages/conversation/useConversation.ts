import { useState, useEffect, useCallback, useRef } from 'react';
import { getMessages, addMessage, getConversations, markConversationAsRead, setTypingStatus, getTypingStatus } from '../messagesStore';
import type { Message, Conversation } from '../types';
import { REFRESH_INTERVAL, TYPING_INTERVAL } from './constants';

export const useConversation = (conversationId: number) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const lastReadConversationId = useRef<number | null>(null);
    const [firstUnreadId, setFirstUnreadId] = useState<number | null>(null);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [firstUnreadIndex, setFirstUnreadIndex] = useState<number | null>(null);
    const [typing, setTyping] = useState<{ me: boolean; other: boolean }>({ me: false, other: false });

    // Charger les messages et conversations
    useEffect(() => {
        setMessages(getMessages(conversationId));
        setConversations(getConversations());
        markConversationAsRead(conversationId);
        lastReadConversationId.current = conversationId;
        const msgs = getMessages(conversationId);
        const unreadMsgs = msgs.filter(msg => !msg.isRead && !msg.isMe);
        setFirstUnreadId(unreadMsgs.length > 0 ? unreadMsgs[0].id : null);
        setUnreadCount(unreadMsgs.length);
        setFirstUnreadIndex(unreadMsgs.length > 0 ? msgs.findIndex(msg => msg.id === unreadMsgs[0].id) : null);
    }, [conversationId]);

    // Forcer le rechargement des messages si le store change
    useEffect(() => {
        const interval = setInterval(() => {
            setMessages(getMessages(conversationId));
            setConversations(getConversations());
        }, REFRESH_INTERVAL);
        return () => clearInterval(interval);
    }, [conversationId]);

    // Mettre à jour l'état de typing depuis le store
    useEffect(() => {
        const interval = setInterval(() => {
            setTyping(getTypingStatus(conversationId));
        }, TYPING_INTERVAL);
        return () => clearInterval(interval);
    }, [conversationId]);

    const handleTyping = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMessage(e.target.value);
        if (e.target.value.trim() === '') {
            setIsTyping(false);
            setTypingStatus(conversationId, 'me', false);
        } else if (!isTyping) {
            setIsTyping(true);
            setTypingStatus(conversationId, 'me', true);
        }
    }, [conversationId, isTyping]);

    const handleSendMessage = useCallback(() => {
        if (!newMessage.trim()) return;
        addMessage(conversationId, newMessage.trim(), "Moi");
        setMessages(getMessages(conversationId));
        setConversations(getConversations());
        setNewMessage('');
        setIsTyping(false);
        setTypingStatus(conversationId, 'me', false);
    }, [conversationId, newMessage]);

    const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    }, [handleSendMessage]);

    return {
        messages,
        conversations,
        newMessage,
        typing,
        unreadCount,
        firstUnreadIndex,
        lastReadConversationId: lastReadConversationId.current,
        handleTyping,
        handleSendMessage,
        handleKeyPress
    };
}; 