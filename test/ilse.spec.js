import { createUser, getLoggedUser } from '../src/lib/auth';
import { createPost } from '../src/lib/firestore';
import * as authFunctions from './../src/lib/auth';
import { createUserWithEmailAndPassword } from 'firebase/auth';

// jest.mock('firebase/auth');
// authFunctions.createUser = jest.fn();

// jest.mock('firebase/auth', () => {
//   const originalModule = jest.requireActual('firebase/auth');
//   const mockUserCredential = {
//     user: {
//       uid: '123456789', // mock user ID
//       email: 'testmail@mail.com', // mock user email
//       // other user properties...
//     },
//     // other properties returned by the userCredential object
//   };
//   return {
//     ...originalModule,
//     createUserWithEmailAndPassword: jest.fn().mockResolvedValueOnce(mockUserCredential),
//     getAuth: jest.fn(),
//     sendEmailVerification: jest.fn(),
//     updateProfile: jest.fn(),
//   };
// });
jest.mock('firebase/auth', () => {
  const mockUser = {
    uid: '123456789', // mock user ID
    email: 'testmail@mail.com', // mock user email
    getIdToken: jest.fn().mockResolvedValue('mockToken'), // mock implementation of getIdToken
    // other user properties...
  };

  const mockUserCredential = {
    user: mockUser,
    // other properties returned by the userCredential object
  };
  return {
    getAuth: jest.fn(),
    createUserWithEmailAndPassword: jest.fn().mockResolvedValueOnce(mockUserCredential),
    sendEmailVerification: jest.fn(),
    updateProfile: jest.fn(),
    // other mocked Firebase functions...
  };
});

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

describe('createPost', () => {
  it('should be a function', () => {
    expect(typeof createPost).toBe('function');
  });

  // it('should return an object', async () => {
  //   const auth = {
  //     currentUser: {
  //       email: 'test@example.com',
  //       displayName: 'Test User',
  //     },
  //   };

  //   const response = await createPost('post content goes here', '')
  //   expect(typeof response).toEqual('object');
  // });
// });

// describe('getLoggedUser', () => {
//   it('should be a function', () => {
//     expect(typeof getLoggedUser).toBe('function');
//   });
});
