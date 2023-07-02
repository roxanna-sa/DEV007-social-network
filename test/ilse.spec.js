// // importamos la funcion que vamos a testear
import { createUser } from '../src/lib/auth';

describe('createUser', () => {
  it('should be a function', () => {
    expect(typeof createUser).toBe('function');
  });

  it('should return an object', async () => {
    const response = await createUser('testmail@mail.com', 'testmailpassword')
    expect(typeof response).toBe('object');
  });
});
