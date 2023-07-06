import {
  logOut,
  getLoggedUser
} from '../src/lib/auth';
import {
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import {
  deletePost,
  editPost
} from '../src/lib/firestore';
import {
  deleteDoc,
  doc,
  updateDoc
} from 'firebase/firestore';
import { db } from '../src/firebase';

// Test para logOut
jest.mock('firebase/auth');

beforeEach(() => {
  jest.clearAllMocks()
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

// Test para deletePost mafer

jest.mock('firebase/firestore');

describe('deletePost', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be an async function', () => {
    expect(deletePost).toBeInstanceOf(Function);
    expect(deletePost.constructor.name).toBe('AsyncFunction');
  });

  it('should call deleteDoc with the correct arguments', async () => {
    const postId = 'postId';
    const deleteDocMock = jest.fn();
    deleteDoc.mockImplementation(deleteDocMock);

    await deletePost(postId);

    expect(deleteDocMock).toHaveBeenCalledWith(doc(db, 'posts', postId));
  });
});


// Test para editPost mafer


jest.mock('firebase/firestore');

describe('editPost', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be an async function', () => {
    expect(editPost).toBeInstanceOf(Function);
    expect(editPost.constructor.name).toBe('AsyncFunction');
  });

  it('should call updateDoc with the correct arguments', async () => {
    const postId = 'postId';
    const editInput = 'New content';
    const postRefMock = jest.fn();
    const updateDocMock = jest.fn();
    doc.mockReturnValue(postRefMock);
    updateDoc.mockImplementation(updateDocMock);

    await editPost(postId, editInput);

    expect(doc).toHaveBeenCalledWith(db, 'posts', postId);
    expect(updateDocMock).toHaveBeenCalledWith(postRefMock, {
      postContent: editInput,
    });
  });
});


// Test para getLoggedUser Mafer
jest.mock('firebase/auth');

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



// // Mock de las funciones localStorage y signOut
// const localStorageMock = {
//   clear: jest.fn(),
//   removeItem: jest.fn(),
// };

// const authMock = {
//   signOut: jest.fn(),
// };

// // Mock global de localStorage
// global.localStorage = localStorageMock;

// // Prueba de la función logOut
// describe('logOut', () => {
//   beforeEach(() => {
//     localStorageMock.clear.mockClear();
//     localStorageMock.removeItem.mockClear();
//     authMock.signOut.mockClear();
//   });

//   it('debe limpiar el almacenamiento local y cerrar sesión', () => {
//     logOut();

//     expect(localStorageMock.clear).toHaveBeenCalled();
//     expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');
//     expect(authMock.signOut).toHaveBeenCalled();
//   });
// });