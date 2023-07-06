import { getDocs, query, orderBy, collection } from 'firebase/firestore';
import { getPosts } from '../src/lib/firestore';
import { db } from '../src/firebase'; 

jest.mock('firebase/firestore');


describe('getPosts', () => {
  it('should return an array of posts', async () => {
    const mockData = [
      { id: '1', data: jest.fn(() => ({ title: 'Post 1' })) },
      { id: '2', data: jest.fn(() => ({ title: 'Post 2' })) },
    ];

    const mockSnapshot = {
      forEach: (callback) => {
        mockData.forEach((doc) => callback(doc));
      },
    };

    const mockQuery = jest.fn();
    collection.mockReturnValue(mockQuery);
    query.mockReturnValue(mockQuery);
    getDocs.mockResolvedValue(mockSnapshot);

    const result = await getPosts();

    const expectedPosts = [
      { id: '1', title: 'Post 1' },
      { id: '2', title: 'Post 2' },
    ];

    expect(collection).toHaveBeenCalledWith(db, 'posts');
    expect(query).toHaveBeenCalledWith(mockQuery, orderBy('timestamp', 'desc'));
    expect(getDocs).toHaveBeenCalledWith(mockQuery);
    expect(result).toEqual(expectedPosts);
  });
});