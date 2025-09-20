import { collection, getDocs, addDoc, doc, getDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from "../utils/firebase.js"; // Import the pre-initialized Firestore instance

export const getPosts = async () => {
  try {
    // console.log('getPosts: Starting to fetch from Firebase...');
    // console.log('Database instance:', db);
    const postsCol = collection(db, 'posts');
    // console.log('Posts collection created:', postsCol);
    const postsSnapshot = await getDocs(query(postsCol, orderBy('createdAt', 'desc')));
    // console.log('Posts snapshot received:', postsSnapshot);
    const posts = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // console.log('Mapped posts:', posts);
    return posts;
  } catch (error) {
    // console.error('Error in getPosts:', error);
    throw error;
  }
};

export const getPost = async (id) => {
  if (!id || typeof id !== 'string') {
    throw new Error('Invalid post ID provided');
  }
  const docRef = doc(db, 'posts', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    throw new Error('Post not found');
  }
};

export const createPost = async (postData) => {
  const docRef = await addDoc(collection(db, 'posts'), {
    ...postData,
    createdAt: new Date()
  });
  return docRef.id;
};

export const updatePost = async (id, postData) => {
  const docRef = doc(db, 'posts', id);
  await updateDoc(docRef, postData);
};

export const deletePost = async (id) => {
  const docRef = doc(db, 'posts', id);
  await deleteDoc(docRef);
};

export const getLatestComments = async (limit = 5) => {
  try {
    const commentsCol = collection(db, 'comments');
    const commentsSnapshot = await getDocs(query(commentsCol, orderBy('createdAt', 'desc')));
    const comments = commentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return comments.slice(0, limit);
  } catch (error) {
    console.error('Error in getLatestComments:', error);
    throw error;
  }
};