import { updateDoc } from 'firebase/firestore';
import { addLike } from '../src/lib/firestore';
import { signIn } from '../src/lib/auth';

jest.mock('firebase/firestore');
jest.mock('firebase/auth');

beforeEach(async () => {
  jest.clearAllMocks();
  // Autenticar al usuario antes de cada prueba
  await signIn('roxanna.sa@gmail.com', '121212');
});

describe('Add like', () => {
  it('deberia llamar a la funcion updateDoc cuando es ejecutada', async () => {
    const updateDocMock = jest.fn(); // Crear función simulada para updateDoc
    updateDoc.mockImplementation(updateDocMock);

    const postId = 'ID';
    await signIn('roxanna.sa@gmail.com', '121212'); // Autenticar nuevamente antes de llamar a addLike
    await addLike(postId);
    expect(updateDocMock).toHaveBeenCalled();
  });
});
