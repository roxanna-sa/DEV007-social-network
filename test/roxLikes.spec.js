import { doc, updateDoc } from 'firebase/firestore';
import { addLike, removeLike } from '../src/lib/firestore';
import { arrayUnion, arrayRemove} from 'firebase/firestore';

jest.mock('firebase/firestore');
jest.mock('firebase/auth');
jest.mock('../src/firebase.js', () => ({
  auth: {
    currentUser: {
    },
  },
}));


describe('addLike', () => {
  it('should be a function', () => {
    expect(typeof addLike).toBe('function');
  });
  
  it('should call updateDoc', async () => {
    const mockingUpdateDoc = jest.fn();
    updateDoc.mockImplementationOnce(mockingUpdateDoc);
    await addLike();
    expect(mockingUpdateDoc).toHaveBeenCalled();
  });

  it('should call arrayUnion', async () => {
    const mockingArrayUnion = jest.fn();
    arrayUnion.mockImplementationOnce(mockingArrayUnion);
    await addLike();
    expect(mockingArrayUnion).toHaveBeenCalled();
  });
});

describe('removeLike', () => {
  it('should be a function', () => {
    expect(typeof removeLike).toBe('function');
  });
  
  it('should call arrayRemove', async () => {
    const mockingArrayRemove = jest.fn();
    arrayRemove.mockImplementationOnce(mockingArrayRemove);
    await removeLike();
    expect(mockingArrayRemove).toHaveBeenCalled();
  });

  it('shoul call updateDoc', async () => {
    const mockingUpDoc = jest.fn();
    updateDoc.mockImplementationOnce(mockingUpDoc);
    await removeLike();
    expect(mockingUpDoc).toHaveBeenCalled();
  });

  it('should call doc', async () => {
    const mockingDoc = jest.fn();
    doc.mockImplementationOnce(mockingDoc);
    await removeLike();
    expect(mockingDoc).toHaveBeenCalled();
  }); 
});
