'use client';

import React, { useState } from 'react';
import { IoAdd, IoClose, IoSearch } from 'react-icons/io5';
import { useMessagesSocket } from '../../hooks/useMessagesSocket';
import { useCreateConversation } from '../../hooks/react-query/messages';
import { useMatches, useAllUsersAsMatches } from '../../hooks/react-query/match';
import { useCurrentUserId } from '../../hooks/useAuthToken';
import { User } from '../../lib/routes/profiles/interfaces/user.interface';

interface CreateConversationButtonProps {
  readonly onConversationCreated?: (conversationId: string) => void;
}

export const CreateConversationButton: React.FC<CreateConversationButtonProps> = ({
  onConversationCreated
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  
  const { createConversation } = useMessagesSocket();
  const createConversationMutation = useCreateConversation();
  
  // Essayer d'abord l'API matches, puis fallback sur tous les profils
  const { data: matches, isLoading: matchesLoading } = useMatches();
  const { data: allProfiles, isLoading: profilesLoading } = useAllUsersAsMatches();
  
  const currentUserId = useCurrentUserId();

  // Fonction pour extraire un tableau d'un objet ou d'un tableau
  const extractArrayFromData = (data: any): any[] => {
    if (Array.isArray(data)) {
      return data;
    }
    if (data && typeof data === 'object') {
      // Chercher une propriété qui contient un tableau
      const arrayProps = Object.values(data).filter(val => Array.isArray(val));
      if (arrayProps.length > 0) {
        return arrayProps[0];
      }
    }
    return [];
  };

  // Utiliser les matches si disponibles et non vides, sinon tous les profils
  const matchesArray = extractArrayFromData(matches);
  const allProfilesArray = extractArrayFromData(allProfiles);
  
  // Utiliser matches si non vide, sinon fallback sur allProfiles
  const availableUsers = matchesArray.length > 0 ? matchesArray : allProfilesArray;
  
  const isLoading = matchesLoading ?? profilesLoading;

  // Filtrer les utilisateurs basés sur la recherche et exclure l'utilisateur actuel
  // S'assurer que availableUsers est bien un tableau avant d'appeler filter
  const filteredUsers = Array.isArray(availableUsers) ? availableUsers.filter((user: User) => {
    const fullName = `${user.name} ${user.surname}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                         user.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const isNotCurrentUser = user.id !== currentUserId;
    
    return matchesSearch && isNotCurrentUser;
  }) : [];

  const handleCreateConversation = async () => {
    if (!selectedUserId) return;

    try {
      // Créer la conversation via socket
      createConversation({ user2_id: selectedUserId });
      
      // Créer aussi via API pour avoir l'ID de la conversation
      const conversation = await createConversationMutation.mutateAsync({ user2_id: selectedUserId });
      
      if (conversation && onConversationCreated) {
        onConversationCreated(conversation.id);
      }
      
      // Fermer le modal
      setIsOpen(false);
      setSelectedUserId(null);
      setSearchTerm('');
    } catch (error) {
      console.error('Erreur lors de la création de la conversation:', error);
    }
  };

  // Préparer le contenu de la liste des utilisateurs
  let usersListContent;
  if (isLoading) {
    usersListContent = <div className="p-4 text-center text-gray-500">Chargement des utilisateurs...</div>;
  } else if (filteredUsers.length === 0) {
    usersListContent = (
      <div className="p-4 text-center text-gray-500">
        {searchTerm ? 'Aucun utilisateur trouvé' : 'Aucun utilisateur disponible'}
      </div>
    );
  } else {
    usersListContent = (
      <div className="divide-y divide-gray-100">
        {filteredUsers.map((user: User) => (
          <button
            key={user.id}
            onClick={() => setSelectedUserId(user.id)}
            className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
              selectedUserId === user.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-600 font-medium">
                  {user.name.charAt(0)}{user.surname.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">
                  {user.name} {user.surname}
                </h3>
                {user.location && (
                  <p className="text-sm text-gray-500 truncate">{user.location}</p>
                )}
              </div>
              {selectedUserId === user.id && (
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <IoAdd className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Bouton pour ouvrir le modal */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        <IoAdd className="w-4 h-4" />
        <span className="hidden sm:inline">Nouvelle conversation</span>
        <span className="sm:hidden">Nouvelle</span>
      </button>

      {/* Modal de création de conversation */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Nouvelle conversation</h2>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setSelectedUserId(null);
                  setSearchTerm('');
                }}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <IoClose className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher un utilisateur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Liste des utilisateurs */}
            <div className="flex-1 overflow-y-auto max-h-96">
              {usersListContent}
            </div>

            {/* Footer avec bouton de création */}
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={handleCreateConversation}
                disabled={!selectedUserId || createConversationMutation.isPending}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {createConversationMutation.isPending ? 'Création...' : 'Créer la conversation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}; 