import { createUser, getLoggedUser } from '../src/lib/auth';
import { createPost } from '../src/lib/firestore';
import { auth } from '../src/firebase';

import { createUserWithEmailAndPassword } from '@firebase/auth';

jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
}));

describe('createUser', () => {
  it('should be a function', () => {
    expect(typeof createUser).toBe('function');
  });

  it('should call createUserWithEmailAndPassword function when executed', async () => {
    await createUser('testmail@mail.com', 'testpassword')

    expect(createUserWithEmailAndPassword).toHaveBeenCalled()
  });

  // it('should return an object', async () => {
  //   const response = await createUser('testingmail2@mail.com', 'testingmailpassword2')
  //   expect(typeof response).toBe('object');
  // });
});

// describe('createPost', () => {
//   it('should be a function', () => {
//     expect(typeof createPost).toBe('function');
//   });

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
// });
