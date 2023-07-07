import {
  doc,
  addDoc,
  collection,
  deleteDoc,
  updateDoc,
  getDocs,
  query,
  orderBy,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { getDownloadURL, uploadBytes } from 'firebase/storage';
import { auth, db } from '../src/firebase';
import {
  createPost,
  deletePost,
  editPost,
  getPosts,
  addLike,
  removeLike,
} from '../src/lib/firestore';

jest.mock('firebase/firestore');
jest.mock('firebase/storage');

jest.mock('../src/firebase', () => {
  const auth = {
    currentUser: {
      email: 'testmail@mail.com',
      displayName: 'Test user',
    },
  };

  return {
    auth,
    deleteDoc: jest.fn(),
    // other mocked Firebase exports...
  };
});

describe('createPost', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  // Mock the File constructor
  const mockFile = {
    name: 'test.jpg',
    type: 'image/jpeg',
    arrayBuffer: jest.fn(),
    slice: jest.fn(),
  };

  global.File = jest.fn((data, name, options) => ({
    ...mockFile,
    name,
    type: options.type,
  }));

  test('should create a new post with photos', async () => {
    const text = 'Test post text!';
    const files = [
      new File(['photo1'], 'photo1.jpg', { type: 'image/jpeg' }),
      new File(['photo2'], 'photo2.jpg', { type: 'image/jpeg' }),
    ];
    // Mock Firestore addDoc and updateDoc
    const newPostId = 'new-post-id';
    const newPostRef = { id: newPostId, path: `posts/${newPostId}` };
    addDoc.mockResolvedValue(newPostRef);
    updateDoc.mockResolvedValue();
    // Mock Storage methods
    const downloadURLs = ['https://example.com/photo1.jpg', 'https://example.com/photo2.jpg'];
    // Mock uploadBytes and getDownloadURL methods
    uploadBytes.mockImplementation(async () => {});
    getDownloadURL.mockImplementation(async (ref) => {
      if (ref && ref.path) {
        const fileName = ref.path.split('/').pop();
        const index = files.findIndex((file) => file.name === fileName);
        if (index !== -1) {
          return Promise.resolve(downloadURLs[index]);
        }
      }
      return null;
    });
    // Call the createPost function
    await createPost(text, files);
    // Assertions
    expect(addDoc).toHaveBeenCalledWith(collection(db, 'posts'), expect.objectContaining({
      postContent: text,
      user: auth.currentUser.email,
      userName: auth.currentUser.displayName,
    }));
    expect(uploadBytes).toHaveBeenCalledTimes(files.length);
    expect(updateDoc).toHaveBeenCalledWith(newPostRef, {
      photos: expect.arrayContaining([null, null]),
    });
  });
});

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
