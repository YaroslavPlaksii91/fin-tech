/// <reference types="vite/client" />

interface serverTokenResponse {
  key: string;
  user: User;
}

interface User {
  id: number | null;
  email: string;
  first_name: string;
  last_name: string;
}

interface GoogleAuthProps {
  setIsError: (boolean: boolean) => void;
}

interface ImportMetaEnv {
  VITE_API_BASE: string;
}
