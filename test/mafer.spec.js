import { logOut } from '../src/lib/auth';
import { auth } from '../src/firebase';
import { signOut } from "firebase/auth";

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