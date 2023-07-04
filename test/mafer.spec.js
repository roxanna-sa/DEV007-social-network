import { logOut } from '../src/lib/auth';
import { auth } from '../src/firebase';
import { signOut } from "firebase/auth";
import { deletePost } from '../src/lib/firestore';
import { deleteDoc } from 'firebase/firestore';
import { doc } from 'firebase/firestore';
import { db } from '../src/firebase';
import { editPost } from '../src/lib/firestore';
import { updateDoc } from 'firebase/firestore';


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