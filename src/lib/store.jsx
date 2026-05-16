import { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { db, auth as fbAuth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';

const AppContext = createContext(null);
const AuthContext = createContext(null);

const defaultAuth = { isLoggedIn: false, hasPaid: false, userId: null, userName: '', email: '' };

function authReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, ...action.user, isLoggedIn: !!action.user.userId };
    case 'PAY':
      return { ...state, hasPaid: true };
    case 'LOGOUT':
      return { ...defaultAuth };
    default:
      return state;
  }
}

const defaultState = {
  athletes: [],
  divisions: {},
  brackets: {},
  results: {},
  settings: { name: '', logo: '', points: { gold: 5, silver: 3, bronze: 1 } },
};

function appReducer(state, action) {
  switch (action.type) {
    case 'LOAD':
      return { ...defaultState, ...action.state };
    case 'ADD_ATHLETE':
      return { ...state, athletes: [...state.athletes, action.athlete] };
    case 'DELETE_ATHLETE':
      return { ...state, athletes: state.athletes.filter(a => a.id !== action.id) };
    case 'SET_DIVISIONS':
      return { ...state, divisions: action.divisions };
    case 'SET_BRACKET':
    case 'UPDATE_BRACKETS':
      return { ...state, brackets: { ...state.brackets, [action.division]: action.rounds } };
    case 'SET_RESULT':
      return { ...state, results: { ...state.results, [action.division]: action.result } };
    case 'SET_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.settings } };
    case 'RESET':
      return { ...defaultState };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [auth, authDispatch] = useReducer(authReducer, defaultAuth);
  const [state, dispatch] = useReducer(appReducer, defaultState);
  
  // Use a Ref to track if the last update came from the cloud
  const isFromCloud = useRef(false);
  const isLoaded = useRef(false);

  // 1. Firebase Auth
  useEffect(() => {
    return onAuthStateChanged(fbAuth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.exists() ? userDoc.data() : { hasPaid: false };
        authDispatch({ 
          type: 'SET_USER', 
          user: { userId: user.uid, userName: user.displayName, email: user.email, hasPaid: userData.hasPaid } 
        });
      } else {
        authDispatch({ type: 'LOGOUT' });
      }
    });
  }, []);

  // 2. Real-time Subscription (Cloud -> App)
  useEffect(() => {
    if (auth.userId && auth.hasPaid) {
      const unsub = onSnapshot(doc(db, 'tournaments', auth.userId), (snapshot) => {
        if (snapshot.exists()) {
          const cloudData = snapshot.data();
          // Flag this as a cloud update so we don't save it back
          isFromCloud.current = true;
          dispatch({ type: 'LOAD', state: cloudData });
          isLoaded.current = true;
        } else {
          // New user: Initial save to create the doc
          setDoc(doc(db, 'tournaments', auth.userId), defaultState);
          isLoaded.current = true;
        }
      });
      return unsub;
    }
  }, [auth.userId, auth.hasPaid]);

  // 3. Persistence (App -> Cloud)
  useEffect(() => {
    // Only save if:
    // - User is logged in and paid
    // - Data is fully loaded from cloud at least once
    // - This specific change DID NOT come from a cloud sync
    if (auth.userId && auth.hasPaid && isLoaded.current) {
      if (isFromCloud.current) {
        // Reset the flag and skip this save
        isFromCloud.current = false;
        return;
      }

      const timer = setTimeout(() => {
        console.log("Saving to Cloud...");
        setDoc(doc(db, 'tournaments', auth.userId), state, { merge: true })
          .catch(err => console.error("Cloud Save Error:", err));
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [state, auth.userId, auth.hasPaid]);

  // 4. Update payment status in Firestore
  useEffect(() => {
    if (auth.userId && auth.hasPaid) {
      setDoc(doc(db, 'users', auth.userId), { hasPaid: true }, { merge: true });
    }
  }, [auth.hasPaid, auth.userId]);

  return (
    <AuthContext.Provider value={{ auth, authDispatch }}>
      <AppContext.Provider value={{ state, dispatch }}>
        {children}
      </AppContext.Provider>
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext); }
export function useApp() { return useContext(AppContext); }
