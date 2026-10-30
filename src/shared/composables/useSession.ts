import { computed } from 'vue';
import { useUserStore } from '@shared/stores/user.store';
import { endSession, startLogin } from '@shared/helpers/session';

/**
 * Iniciais do nome para avatar: primeira letra do primeiro e do último nome
 * (`Maria da Silva` → `MS`). Nome vazio → `U`.
 */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'U';

  const first = parts[0].charAt(0);
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
  return `${first}${last}`.toUpperCase();
}

/**
 * Composable para expor estado e ações de sessão do usuário.
 * Encapsula a lógica reativa de autenticação para uso em componentes.
 *
 * @example
 * const { isLoggedIn, userName, logout } = useSession();
 */
export function useSession() {
  const userStore = useUserStore();

  const isLoggedIn = computed(() => userStore.isAuthorized);
  const user = computed(() => userStore.userData);
  const userName = computed(() => userStore.userData?.nome ?? '');
  const initials = computed(() => getInitials(userName.value));

  function login(): void {
    startLogin();
  }

  function logout(): Promise<void> {
    return endSession();
  }

  return {
    isLoggedIn,
    user,
    userName,
    initials,
    login,
    logout,
  };
}
