/**
 * @file firestore.ts
 * @description Firestore database utility functions
 * @dependencies firebase/firestore
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  DocumentData,
  QueryConstraint,
  serverTimestamp,
  Timestamp,
  DocumentReference,
  DocumentSnapshot,
  QuerySnapshot
} from 'firebase/firestore';
import { db } from './config';
import { ApiResponse } from '../../types';

/**
 * Generic function to get a document by ID
 * 
 * @param collectionName - The collection to get the document from
 * @param id - The document ID
 * @returns The document data with ID
 * @throws Error if fetching fails
 */
export const getDocumentById = async <T>(
  collectionName: string,
  id: string
): Promise<T> => {
  try {
    const docRef = doc(db, collectionName, id);
    const snapshot = await getDoc(docRef);
    
    if (!snapshot.exists()) {
      throw new Error(`Document not found: ${collectionName}/${id}`);
    }
    
    return { id, ...snapshot.data() } as T;
  } catch (error) {
    console.error(`Error getting ${collectionName} document:`, error);
    throw error;
  }
};

/**
 * Generic function to get multiple documents from a collection
 * 
 * @param collectionName - The collection to query
 * @param constraints - Query constraints (where, orderBy, limit, etc.)
 * @returns Array of documents with IDs
 * @throws Error if query fails
 */
export const getDocuments = async <T>(
  collectionName: string,
  ...constraints: QueryConstraint[]
): Promise<T[]> => {
  try {
    const collectionRef = collection(db, collectionName);
    const q = constraints.length > 0 
      ? query(collectionRef, ...constraints) 
      : query(collectionRef);
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as T);
  } catch (error) {
    console.error(`Error querying ${collectionName} collection:`, error);
    throw error;
  }
};

/**
 * Create or update a document
 * 
 * @param collectionName - The collection to add the document to
 * @param data - The document data
 * @param id - Optional document ID (if not provided, one will be generated)
 * @returns The document ID
 * @throws Error if saving fails
 */
export const saveDocument = async <T extends DocumentData>(
  collectionName: string,
  data: T,
  id?: string
): Promise<string> => {
  try {
    const docRef = id 
      ? doc(db, collectionName, id) 
      : doc(collection(db, collectionName));
    
    // Add timestamps
    const dataWithTimestamps = {
      ...data,
      updatedAt: serverTimestamp(),
      ...(id ? {} : { createdAt: serverTimestamp() })
    };
    
    await (id 
      ? updateDoc(docRef, dataWithTimestamps) 
      : setDoc(docRef, dataWithTimestamps)
    );
    
    return docRef.id;
  } catch (error) {
    console.error(`Error saving ${collectionName} document:`, error);
    throw error;
  }
};

/**
 * Delete a document by ID
 * 
 * @param collectionName - The collection containing the document
 * @param id - The document ID to delete
 * @throws Error if deletion fails
 */
export const deleteDocument = async (
  collectionName: string,
  id: string
): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting ${collectionName} document:`, error);
    throw error;
  }
};

/**
 * Convert Firestore timestamp to Date
 * 
 * @param timestamp - Firestore timestamp
 * @returns JavaScript Date object
 */
export const timestampToDate = (timestamp: Timestamp): Date => {
  return timestamp.toDate();
};

/**
 * Helper function to create query constraints
 */
export const createQueryConstraints = {
  where: where,
  orderBy: orderBy,
  limit: limit
}; 