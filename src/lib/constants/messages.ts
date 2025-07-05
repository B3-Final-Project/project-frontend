/**
 * Constantes pour les messages et textes de l'application
 */

// Messages de notification
export const NOTIFICATION_MESSAGES = {
  // Messages de permission
  PERMISSION_REQUEST: 'Voulez-vous ouvrir les paramètres de notification du navigateur ?',
  PERMISSION_ACTIVATE: 'Activez les notifications pour ne manquer aucun message',
  
  // Messages de statut
  STATUS: {
    ONLINE: 'En ligne',
    OFFLINE: 'Hors ligne',
    TYPING: 'En train d\'écrire',
    NO_MESSAGE: 'Aucun message',
    YOU: 'Vous: ',
  },
  
  // Messages de chargement
  LOADING: {
    CONVERSATIONS: 'Chargement des conversations...',
    MESSAGES: 'Chargement des messages...',
    DEFAULT: 'Chargement...',
  },
  
  // Messages d'état vide
  EMPTY: {
    CONVERSATIONS: {
      TITLE: 'Aucune conversation',
      DESCRIPTION: 'Vous n\'avez pas encore de conversations.',
    },
    MESSAGES: {
      TITLE: 'Aucun message',
      DESCRIPTION: 'Soyez le premier à envoyer un message !',
    },
    DEFAULT: {
      TITLE: 'Aucune donnée',
      DESCRIPTION: 'Aucune donnée disponible pour le moment.',
    },
  },
  
  // Messages d'erreur
  ERROR: {
    TOKEN_DECODE: '❌ Erreur lors du décodage du token:',
    MATCH: 'Erreur lors du match',
    MATCH_DEFAULT: 'Une erreur s\'est produite. Veuillez réessayer.',
  },
  
  // Messages de succès
  SUCCESS: {
    LIKE_SENT: 'Like envoyé ! 💙',
    LIKE_WAITING: 'Votre like a été envoyé. En attente d\'une réponse...',
    PROFILE_PASSED: 'Profil passé',
    PROFILE_PASSED_DESC: 'Ce profil a été passé.',
  },
  
  // Messages de match
  MATCH: {
    NEW_MATCH: '🎉 Nouveau match !',
    NEW_MATCH_DESC: 'Vous avez matché avec {name}{age} ! Commencez à discuter maintenant.',
    CONVERSATION_DELETED: 'Conversation supprimée',
    CONVERSATION_DELETED_BY_OTHER: '{name} a supprimé cette conversation.',
    CONVERSATION_DELETED_BY_ME: 'Vous avez supprimé cette conversation.',
  },
  
  // Messages de conversation
  CONVERSATION: {
    NEW_MESSAGE: 'Nouveau message de {name}',
    DELETE_CONFIRM: 'Êtes-vous sûr de vouloir supprimer cette conversation ?',
    DELETE_CONFIRM_DESC: 'Cette action est irréversible.',
  },
};

// Textes d'interface
export const UI_TEXTS = {
  // Boutons
  BUTTONS: {
    ACTIVATE: 'Activer',
    CANCEL: 'Annuler',
    CONFIRM: 'Confirmer',
    DELETE: 'Supprimer',
    SEND: 'Envoyer',
    REPLY: 'Répondre',
    BACK: 'Retour',
  },
  
  // Titres
  TITLES: {
    MESSAGES: 'Messages',
    CONVERSATION: 'Conversation',
    PROFILE: 'Profil',
    SETTINGS: 'Paramètres',
    ADMIN: 'Administration',
  },
  
  // Labels
  LABELS: {
    ONLINE_STATUS: 'Statut en ligne',
    TYPING_INDICATOR: 'Indicateur de frappe',
    MESSAGE_INPUT: 'Saisie de message',
    NOTIFICATION_SETTINGS: 'Paramètres de notification',
  },
};
