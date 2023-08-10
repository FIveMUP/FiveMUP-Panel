import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import useAuthStore from '../contexts/auth-context';


export const AuthGuard = (props) => {
  const { children } = props;
  const router = useRouter();
  const { isAuthenticated } = useAuthStore()
  const ignore = useRef(false);
  const [checked, setChecked] = useState(false);

  useEffect(
    () => {
      if (!router.isReady) {
        return;
      }

      // Prevent from calling twice in development mode with React.StrictMode enabled
      if (ignore.current) {
        return;
      }

      ignore.current = true;

      console.log("EPA: ", isAuthenticated)

      if (!isAuthenticated) {
        console.log('Not authenticated, redirecting');
        router
          .replace({
            pathname: '/login',
            query: router.asPath !== '/' ? { continueUrl: router.asPath } : undefined
          })
          .catch(console.error);
      }
       
      setChecked(true);
    },
    [router.isReady, isAuthenticated, router]
  );

  if (!checked) {
    return null;
  }

  // If got here, it means that the redirect did not occur, and that tells us that the user is
  // authenticated / authorized.
  return !isAuthenticated ? null : children;
};

AuthGuard.propTypes = {
  children: PropTypes.node
};
