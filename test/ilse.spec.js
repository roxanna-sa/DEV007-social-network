import { createUser, getLoggedUser } from '../src/lib/auth';
import { createPost } from '../src/lib/firestore';


describe('createUser', () => {
  it('should be a function', () => {
    expect(typeof createUser).toBe('function');
  });

  it('should return an object', async () => {
    const response = await createUser('testingmail@mail.com', 'testingmailpassword')
    expect(typeof response).toBe('object');
  });
});

describe('createPost', () => {
  it('should be a function', () => {
    expect(typeof createPost).toBe('function');
  });

  // it('should return an object', async () => {
  //   const response = await createPost('post content goes here', '')
  //   expect(typeof response).toBe('object');
  // });
});

describe('getLoggedUser', () => {
  it('should be a function', () => {
    expect(typeof getLoggedUser).toBe('function');
  });
});
