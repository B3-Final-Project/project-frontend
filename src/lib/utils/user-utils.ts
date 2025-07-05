/**
 * Utilitaires pour la gestion des utilisateurs
 */

/**
 * Obtient l'ID de l'utilisateur actuel depuis le token de session
 * @returns L'ID de l'utilisateur ou null si non trouvé
 */
export function getCurrentUserIdFromToken(): string | null {
    if (typeof window === "undefined") return null;
    
    try {
        const keys = Object.keys(sessionStorage);
        for (const key of keys) {
            if (key.startsWith("oidc.user:")) {
                const userJson = sessionStorage.getItem(key);
                if (userJson) {
                    const user = JSON.parse(userJson);
                    if (user?.access_token) {
                        const payload = JSON.parse(atob(user.access_token.split('.')[1]));
                        return payload.sub ?? payload.username;
                    }
                }
            }
        }
    } catch (error) {
        console.error('❌ Erreur lors du décodage du token:', error);
    }
    
    return null;
} 