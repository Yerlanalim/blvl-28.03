/**
 * @file storage.ts
 * @description Firebase Storage utility functions
 * @dependencies firebase/storage
 */

import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  list,
  ListResult,
  StorageReference,
  uploadString
} from 'firebase/storage';
import { storage } from './config';

/**
 * Upload a file to Firebase Storage
 * 
 * @param path - The path to upload the file to
 * @param file - The file to upload
 * @returns The download URL for the uploaded file
 * @throws Error if upload fails
 */
export const uploadFile = async (
  path: string,
  file: File
): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

/**
 * Upload a string (e.g., base64 data) to Firebase Storage
 * 
 * @param path - The path to upload the data to
 * @param data - The string data to upload
 * @param format - The format of the data
 * @returns The download URL for the uploaded file
 * @throws Error if upload fails
 */
export const uploadFileFromString = async (
  path: string,
  data: string,
  format: 'raw' | 'base64' | 'base64url' | 'data_url' = 'data_url'
): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadString(storageRef, data, format);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file from string:', error);
    throw error;
  }
};

/**
 * Get the download URL for a file
 * 
 * @param path - The path to the file
 * @returns The download URL
 * @throws Error if getting the URL fails
 */
export const getFileURL = async (path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('Error getting file URL:', error);
    throw error;
  }
};

/**
 * Delete a file from Firebase Storage
 * 
 * @param path - The path to the file to delete
 * @throws Error if deletion fails
 */
export const deleteFile = async (path: string): Promise<void> => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

/**
 * List files in a directory
 * 
 * @param path - The path to list files from
 * @returns A ListResult object
 * @throws Error if listing fails
 */
export const listFiles = async (path: string): Promise<ListResult> => {
  try {
    const storageRef = ref(storage, path);
    return await list(storageRef);
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
}; 