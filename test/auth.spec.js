import {
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import {
  createUser,
  signIn,
  signInGoogle,
  logOut,
  getLoggedUser,
} from '../src/lib/auth';

jest.mock('firebase/auth', () => {
  const mockUser = {
    uid: '123456789', // mock user ID
    email: 'testmail@mail.com', // mock user email
    getIdToken: jest.fn().mockResolvedValue('mockToken'), // mock implementation of getIdToken
  };

  const mockUserCredential = {
    user: mockUser,
  };

  const mockSignInWithPopup = jest.fn();

  return {
    getAuth: jest.fn(() => ({
      currentUser: mockUser, // Provide a mock user object as currentUser
    })),
    createUserWithEmailAndPassword: jest.fn().mockResolvedValueOnce(mockUserCredential),
    signInWithEmailAndPassword: jest.fn(),
    sendEmailVerification: jest.fn(),
    updateProfile: jest.fn(),
    signOut: jest.fn(),
    signInWithPopup: mockSignInWithPopup,
    onAuthStateChanged: jest.fn(),
  };
});

jest.mock('firebase/firestore');
jest.mock('firebase/storage');

describe('createUser', () => {
  it('should be a function', () => {
    expect(typeof createUser).toBe('function');
  });

  it('should call createUserWithEmailAndPassword function when executed', async () => {
    const userMail = 'testmail@mail.com';
    const userPass = 'testpassword';
    const displayName = 'John Doe';

    // Call the function you want to test
    await createUser(userMail, userPass, displayName);

    // Assert that the nested function was called
    expect(createUserWithEmailAndPassword).toHaveBeenCalled();
  });
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Login', () => {
  it('should be a function', () => {
    expect(typeof signIn).toBe('function');
  });

  it('should call signInWithEmailAndPassword when executed', async () => {
    await signIn('roxanna.sa@gmail.com', '121212');
    expect(signInWithEmailAndPassword).toHaveBeenCalled();
  });

  it('it should return email', async () => {
    signInWithEmailAndPassword.mockReturnValueOnce({ email: 'roxanna.sa@gmail.com' });
    const response = await signIn('roxanna.sa@gmail.com', '121212');
    expect(response.email).toBe('roxanna.sa@gmail.com');
  });
});

describe('LogIn with Google', () => {
  it('should be a function', () => {
    expect(typeof signInGoogle).toBe('function');
  });

  it('should call signInWithPopup', async () => {
    const mockSignInWithPopup = jest.fn();
    signInWithPopup.mockImplementation(mockSignInWithPopup);

    await signInGoogle();

    expect(mockSignInWithPopup).toHaveBeenCalled();
  });
});

describe('getLoggedUser', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should resolve with user email if user is logged in', async () => {
    const user = { email: 'test@example.com' };
    const onAuthStateChangedMock = jest.fn((auth, callback) => {
      callback(user);
    });
    onAuthStateChanged.mockImplementation(onAuthStateChangedMock);

    const result = await getLoggedUser();

    expect(onAuthStateChangedMock).toHaveBeenCalled();
    expect(result).toBe(user.email);
  });

  it('should resolve with null if no user is logged in', async () => {
    const onAuthStateChangedMock = jest.fn((auth, callback) => {
      callback(null);
    });
    onAuthStateChanged.mockImplementation(onAuthStateChangedMock);

    const result = await getLoggedUser();

    expect(onAuthStateChangedMock).toHaveBeenCalled();
    expect(result).toBeNull();
  });
});

// Test para logOut
beforeEach(() => {
  jest.clearAllMocks();
});

const localStorageMock = {
  clear: jest.fn(),
  removeItem: jest.fn(),
};

// Reemplazar el objeto global localStorage con la implementación simulada
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

describe('logOut', () => {
  afterEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  it('should be a function', () => {
    expect(typeof logOut).toBe('function');
  });

  it('should call signOut', () => {
    const signOutMock = jest.fn();
    signOut.mockImplementation(signOutMock);

    logOut();

    expect(signOutMock).toHaveBeenCalled();
  });
});
