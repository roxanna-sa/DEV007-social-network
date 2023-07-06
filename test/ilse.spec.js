import { createUserWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, db, storage } from '../src/firebase';
import { createUser } from '../src/lib/auth';
import { createPost } from '../src/lib/firestore';
// import * as authFunctions from '../src/lib/auth';

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
    getAuth: jest.fn(() => ({
      currentUser: mockUser, // Provide a mock user object as currentUser
    })),
    createUserWithEmailAndPassword: jest.fn().mockResolvedValueOnce(mockUserCredential),
    sendEmailVerification: jest.fn(),
    updateProfile: jest.fn(),
    // other mocked Firebase functions...
  };
});

jest.mock('firebase/firestore');
jest.mock('firebase/storage');

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

jest.mock('../src/firebase', () => {
  const auth = {
    currentUser: {
      email: 'testmail@mail.com',
      displayName: 'John Doe',
    },
  };

  return {
    auth,
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

  global.File = jest.fn(() => mockFile);

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
    // getDownloadURL.mockImplementation((mockImageRef) => {
    //   const imageRef = ref(storage, `images/${newPost.id}/${file.name}`);
    //   if (!mockImageRef) {
    //     throw new Error('Invalid imageRef');
    //   }
    //   const fileName = mockImageRef.toString().split('/')[2]; // Extract the file name from the imageRef URL
    //   const index = files.findIndex((file) => file.name === fileName);
    //   return Promise.resolve(downloadURLs[index]);
    // });
    getDownloadURL.mockImplementation((imageRef) => {
  const fileName = imageRef.location.path.split('/')[2];
  const index = files.findIndex((file) => file.name === fileName);
  return Promise.resolve(downloadURLs[index]);
});

    // Call the createPost function
    await createPost(text, files);

    // Assertions
    expect(addDoc).toHaveBeenCalledWith(collection(db, 'posts'), {
      postContent: text,
      user: auth.currentUser.email,
      userName: auth.currentUser.displayName,
      timestamp: expect.anything(),
    });

    expect(uploadBytes).toHaveBeenCalledTimes(files.length);
    expect(updateDoc).toHaveBeenCalledWith(newPostRef, { photos: downloadURLs });
  });
});
