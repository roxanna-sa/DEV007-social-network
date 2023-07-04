import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { signIn, signInGoogle } from '../src/lib/auth';




jest.mock('firebase/auth');
jest.mock('firebase/firestore');



beforeEach(() => {
    jest.clearAllMocks()
});


describe('Login', () => {
    it('should be a function', () => {
      expect(typeof signIn).toBe('function');
    });
    it('should call signInWithEmailAndPassword when ex', async () => { 
      await signIn('roxanna.sa@gmail.com', '121212');
      expect(signInWithEmailAndPassword).toHaveBeenCalled();
    });
});

describe('Login', () => {
    test('it should return email', async () => {
      signInWithEmailAndPassword.mockReturnValueOnce({ email: 'roxanna.sa@gmail.com' });
      const response = await signIn('roxanna.sa@gmail.com', '121212');
      expect(response.email).toBe('roxanna.sa@gmail.com');
    });
});

describe('LogIn with Google', () => {
    it('should be a function', () => {
      expect(typeof signInGoogle).toBe('function');
    });
    it('should call signInWithPopup', async() => {
      await signInGoogle('roxanna.sa@gmail.com', '121212');
      expect(signInWithPopup).toHaveBeenCalled();
    });
  });


  

  