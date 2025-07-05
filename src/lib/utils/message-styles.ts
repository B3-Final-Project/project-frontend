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
 * Obtient l'alignement approprié pour un message selon l'expéditeur
 */
export function getMessageAlignment(isMe: boolean): string {
    return isMe ? MESSAGE_ALIGNMENT.SENDER : MESSAGE_ALIGNMENT.RECEIVER;
}

/**
 * Obtient les classes CSS appropriées pour un message selon l'expéditeur
 */
export function getMessageClasses(isMe: boolean): string {
    return isMe ? MESSAGE_CLASSES.SENDER : MESSAGE_CLASSES.RECEIVER;
}

/**
 * Obtient les classes CSS appropriées pour un timestamp selon l'expéditeur
 */
export function getTimestampClasses(isMe: boolean): string {
    return isMe ? TIMESTAMP_CLASSES.SENDER : TIMESTAMP_CLASSES.RECEIVER;
}

/**
 * Obtient l'indicateur de lecture approprié
 */
export function getReadIndicator(isRead: boolean): string {
    return isRead ? READ_INDICATORS.READ : READ_INDICATORS.UNREAD;
}

/**
 * Obtient les classes CSS appropriées pour l'indicateur de lecture
 */
export function getReadIndicatorClasses(isRead: boolean): string {
    return isRead ? READ_INDICATOR_CLASSES.READ : READ_INDICATOR_CLASSES.UNREAD;
}

/**
 * Obtient le statut utilisateur approprié
 */
export function getUserStatus(isOnline: boolean): string {
    return isOnline ? USER_STATUS.ONLINE : USER_STATUS.OFFLINE;
} 