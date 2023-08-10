import { Auth } from '@zalter/identity-js';

const noop = () => {};

export const ENABLE_AUTH = process.env.NEXT_PUBLIC_ENABLE_ZALTER_AUTH === 'true';

export const auth = {
  login: async (username, password) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login?username=${username}&password=${password}`, {
        method: 'POST',
      }).catch(err => {
        console.log(err)
      })
      
      const { message, token } = await response.json();

      if (response.ok === false) {
        return {
          error: message,
          token: null
        }
      }

      localStorage.setItem('token', token);

      return {
        error: null,
        token
      }
  },
  getToken: () => {
    return localStorage.getItem('token');
  }
}