import { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { db, auth as fbAuth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';

const AppContext = createContext(null);
const AuthContext = createContext(null);

const defaultAuth = { isLoggedIn: false, hasPaid: false, userId: null, userName: '', email: '', loading: true };

function authReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, ...action.user, isLoggedIn: !!action.user.userId, loading: false };
    case 'PAY':
      return { ...state, hasPaid: true };
    case 'LOGOUT':
      return { ...defaultAuth, loading: false };
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
      const newState = { ...defaultState, ...action.state };
      // De-stringify brackets and results if they came from cloud
      if (typeof newState.brackets === 'string') {
        try { newState.brackets = JSON.parse(newState.brackets); } catch(e) { newState.brackets = {}; }
      }
      if (typeof newState.results === 'string') {
        try { newState.results = JSON.parse(newState.results); } catch(e) { newState.results = {}; }
      }
      return newState;
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
  
  const isFromCloud = useRef(false);
  const isLoaded = useRef(false);

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

  useEffect(() => {
    if (auth.userId && auth.hasPaid) {
      const unsub = onSnapshot(doc(db, 'tournaments', auth.userId), (snapshot) => {
        if (snapshot.exists()) {
          const cloudData = snapshot.data();
          isFromCloud.current = true;
          dispatch({ type: 'LOAD', state: cloudData });
          isLoaded.current = true;
        } else {
          setDoc(doc(db, 'tournaments', auth.userId), { ...defaultState, brackets: "{}", results: "{}" });
          isLoaded.current = true;
        }
      });
      return unsub;
    }
  }, [auth.userId, auth.hasPaid]);

  useEffect(() => {
    if (auth.userId && auth.hasPaid && isLoaded.current) {
      if (isFromCloud.current) {
        isFromCloud.current = false;
        return;
      }

      const timer = setTimeout(() => {
        // Stringify nested structures to avoid Firestore errors
        const syncState = { 
            ...state,
            brackets: JSON.stringify(state.brackets),
            results: JSON.stringify(state.results)
        };

        const logoData = syncState.settings.logo;
        if (logoData && logoData.startsWith('data:image')) {
            syncState.settings.logo = "CLOUD_STORAGE";
            setDoc(doc(db, 'logos', auth.userId), { logo: logoData }, { merge: true });
        }

        setDoc(doc(db, 'tournaments', auth.userId), syncState, { merge: true })
          .catch(err => {
            console.error("Critical Sync Error:", err);
            alert("🚨 CLOUD ERROR: " + err.message);
          });
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [state, auth.userId, auth.hasPaid]);

  useEffect(() => {
    if (auth.userId && auth.hasPaid && isLoaded.current) {
        getDoc(doc(db, 'logos', auth.userId)).then(snap => {
            if (snap.exists() && snap.data().logo) {
                dispatch({ type: 'SET_SETTINGS', settings: { logo: snap.data().logo } });
            }
        });
    }
  }, [auth.userId, auth.hasPaid, isLoaded.current]);

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
