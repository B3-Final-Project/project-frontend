/**
 * Utilitaires pour les styles des messages
 */

import { NOTIFICATION_MESSAGES } from '../constants/messages';

// Constantes pour les statuts utilisateur
export const USER_STATUS = {
    ONLINE: NOTIFICATION_MESSAGES.STATUS.ONLINE,
    OFFLINE: NOTIFICATION_MESSAGES.STATUS.OFFLINE
} as const;

// Classes CSS pour l'alignement des messages
export const MESSAGE_ALIGNMENT = {
    SENDER: 'justify-end',
    RECEIVER: 'justify-start'
} as const;

// Classes CSS pour les messages
export const MESSAGE_CLASSES = {
    SENDER: 'max-w-[90%] md:max-w-[75%] rounded-2xl bg-blue-500 text-white p-2 md:p-3',
    RECEIVER: 'max-w-[90%] md:max-w-[75%] rounded-2xl bg-white text-gray-900 shadow-sm border border-gray-100 p-2.5 md:p-3.5'
} as const;

// Classes CSS pour les timestamps
export const TIMESTAMP_CLASSES = {
    SENDER: 'text-blue-100',
    RECEIVER: 'text-gray-500'
} as const;

// Indicateurs de lecture
export const READ_INDICATORS = {
    READ: '✓✓',
    UNREAD: '✓'
} as const;

// Classes CSS pour les indicateurs de lecture
export const READ_INDICATOR_CLASSES = {
    READ: 'text-blue-100',
    UNREAD: 'text-blue-200'
} as const;

/**
 * Méthodes pour l'alignement des messages
 */
export const MessageAlignment = {
    getSenderAlignment: (): string => MESSAGE_ALIGNMENT.SENDER,
    getReceiverAlignment: (): string => MESSAGE_ALIGNMENT.RECEIVER,
    getAlignment: (isMe: boolean): string => isMe ? MESSAGE_ALIGNMENT.SENDER : MESSAGE_ALIGNMENT.RECEIVER
} as const;

/**
 * Méthodes pour les classes CSS des messages
 */
export const MessageClasses = {
    getSenderClasses: (): string => MESSAGE_CLASSES.SENDER,
    getReceiverClasses: (): string => MESSAGE_CLASSES.RECEIVER,
    getClasses: (isMe: boolean): string => isMe ? MESSAGE_CLASSES.SENDER : MESSAGE_CLASSES.RECEIVER
} as const;

/**
 * Méthodes pour les classes CSS des timestamps
 */
export const TimestampClasses = {
    getSenderClasses: (): string => TIMESTAMP_CLASSES.SENDER,
    getReceiverClasses: (): string => TIMESTAMP_CLASSES.RECEIVER,
    getClasses: (isMe: boolean): string => isMe ? TIMESTAMP_CLASSES.SENDER : TIMESTAMP_CLASSES.RECEIVER
} as const;

/**
 * Méthodes pour les indicateurs de lecture
 */
export const ReadIndicators = {
    getReadIndicator: (): string => READ_INDICATORS.READ,
    getUnreadIndicator: (): string => READ_INDICATORS.UNREAD,
    getIndicator: (isRead: boolean): string => isRead ? READ_INDICATORS.READ : READ_INDICATORS.UNREAD
} as const;

/**
 * Méthodes pour les classes CSS des indicateurs de lecture
 */
export const ReadIndicatorClasses = {
    getReadClasses: (): string => READ_INDICATOR_CLASSES.READ,
    getUnreadClasses: (): string => READ_INDICATOR_CLASSES.UNREAD,
    getClasses: (isRead: boolean): string => isRead ? READ_INDICATOR_CLASSES.READ : READ_INDICATOR_CLASSES.UNREAD
} as const;

/**
 * Méthodes pour le statut utilisateur
 */
export const UserStatus = {
    getOnlineStatus: (): string => USER_STATUS.ONLINE,
    getOfflineStatus: (): string => USER_STATUS.OFFLINE,
    getStatus: (isOnline: boolean): string => isOnline ? USER_STATUS.ONLINE : USER_STATUS.OFFLINE
} as const;

// Fonctions de compatibilité pour maintenir l'API existante
/**
 * @deprecated Utilisez MessageAlignment.getAlignment() à la place
 */
export function getMessageAlignment(isMe: boolean): string {
    return MessageAlignment.getAlignment(isMe);
}

/**
 * @deprecated Utilisez MessageClasses.getClasses() à la place
 */
export function getMessageClasses(isMe: boolean): string {
    return MessageClasses.getClasses(isMe);
}

/**
 * @deprecated Utilisez TimestampClasses.getClasses() à la place
 */
export function getTimestampClasses(isMe: boolean): string {
    return TimestampClasses.getClasses(isMe);
}

/**
 * @deprecated Utilisez ReadIndicators.getIndicator() à la place
 */
export function getReadIndicator(isRead: boolean): string {
    return ReadIndicators.getIndicator(isRead);
}

/**
 * @deprecated Utilisez ReadIndicatorClasses.getClasses() à la place
 */
export function getReadIndicatorClasses(isRead: boolean): string {
    return ReadIndicatorClasses.getClasses(isRead);
}

/**
 * @deprecated Utilisez UserStatus.getStatus() à la place
 */
export function getUserStatus(isOnline: boolean): string {
    return UserStatus.getStatus(isOnline);
} 