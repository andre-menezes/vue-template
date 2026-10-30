import { defineStore } from 'pinia';
import type { UserState } from '@typings/store';

/**
 * Identidade e autorização do usuário. Apenas estado: o login/logout é
 * orquestrado por `@shared/helpers/session` (exposto via `useSession`).
 */
export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    userData: null,
    isAuthorized: false,
  }),

  actions: {
    setUserData(userData: UserState['userData']): void {
      this.userData = userData;
      this.isAuthorized = !!userData;
    },
  },
});
