import { useState, useEffect, useCallback, useRef } from 'react';
import { getMessages, addMessage, getConversations, markConversationAsRead, setTypingStatus, getTypingStatus, syncUnreadCounts } from '../messagesStore';
import type { Message, Conversation } from '../types';
import { REFRESH_INTERVAL, TYPING_INTERVAL } from './constants';

export const useConversation = (conversationId: number) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [typing, setTyping] = useState<{ me: boolean; other: boolean }>({ me: false, other: false });
    const lastReadConversationId = useRef<number | null>(null);
    const [firstUnreadId, setFirstUnreadId] = useState<number | null>(null);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [firstUnreadIndex, setFirstUnreadIndex] = useState<number | null>(null);
    const [hasShownUnreadBar, setHasShownUnreadBar] = useState<boolean>(false);

    // Charger les messages et conversations
    useEffect(() => {
        const msgs = getMessages(conversationId);
        setMessages(msgs);
        setConversations(getConversations());
        
        // Synchroniser les compteurs de messages non lus
        syncUnreadCounts();
        
        // Calculer les messages non lus
        const unreadMsgs = msgs.filter(msg => !msg.isRead && !msg.isMe);
        const newUnreadCount = unreadMsgs.length;
        
        // Debug pour voir les valeurs calculées
        console.log('useConversation Debug:', {
            conversationId,
            totalMessages: msgs.length,
            unreadMessages: unreadMsgs.length,
            unreadMessagesDetails: unreadMsgs.map(msg => ({ id: msg.id, isRead: msg.isRead, isMe: msg.isMe })),
            firstUnreadMsg: unreadMsgs[0]
        });
        
        setUnreadCount(newUnreadCount);
        
        if (newUnreadCount > 0) {
            const firstUnreadMsg = unreadMsgs[0];
            const index = msgs.findIndex(msg => msg.id === firstUnreadMsg.id);
            setFirstUnreadIndex(index);
            setFirstUnreadId(firstUnreadMsg.id);
            
            console.log('Setting unread bar:', { index, firstUnreadMsgId: firstUnreadMsg.id });
            
            // Si c'est une nouvelle conversation, permettre l'affichage de la barre
            if (lastReadConversationId.current !== conversationId) {
                setHasShownUnreadBar(false);
                console.log('New conversation, allowing unread bar display');
            } else {
                console.log('Same conversation, keeping current hasShownUnreadBar state');
            }
            // Si on est déjà sur cette conversation, garder l'état actuel
        } else {
            setFirstUnreadIndex(null);
            setFirstUnreadId(null);
            setHasShownUnreadBar(true);
            console.log('No unread messages, hiding unread bar');
        }
        
        // Mettre à jour lastReadConversationId
        lastReadConversationId.current = conversationId;
        
        setTyping(getTypingStatus(conversationId));
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
            const currentTypingStatus = getTypingStatus(conversationId);
            setTyping(currentTypingStatus);
        }, TYPING_INTERVAL);
        return () => clearInterval(interval);
    }, [conversationId]);

    // Mettre à jour l'état de typing basé sur le contenu de l'input
    useEffect(() => {
        const isCurrentlyTyping = newMessage.trim().length > 0;
        const shouldUpdateTyping = isCurrentlyTyping !== typing.me;
        
        if (shouldUpdateTyping) {
            setTyping(prev => ({ ...prev, me: isCurrentlyTyping }));
            setTypingStatus(conversationId, 'me', isCurrentlyTyping);
        }
    }, [newMessage, conversationId, typing.me]);

    const handleTyping = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMessage(e.target.value);
    }, []);

    const handleSendMessage = useCallback(() => {
        if (!newMessage.trim()) return;
        
        // Arrêter le typing
        setTyping(prev => ({ ...prev, me: false }));
        setTypingStatus(conversationId, 'me', false);
        
        // Envoyer le message
        addMessage(conversationId, newMessage.trim(), "Moi");
        setMessages(getMessages(conversationId));
        setConversations(getConversations());
        setNewMessage('');
    }, [conversationId, newMessage]);

    const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    }, [handleSendMessage]);

    const handleMarkAsRead = useCallback(() => {
        // Marquer comme lu dans le store
        markConversationAsRead(conversationId);
        // Mettre à jour les variables locales pour faire disparaître la barre
        setUnreadCount(0);
        setFirstUnreadIndex(null);
        setHasShownUnreadBar(true);
        // Forcer la mise à jour des conversations pour la sidebar
        setConversations(getConversations());
    }, [conversationId]);

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
        handleKeyPress,
        handleMarkAsRead
    };
}; 