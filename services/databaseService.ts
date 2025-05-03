import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

// Define types for our database
export interface User {
  id?: number;
  email: string;
  password: string; // In a real app, this would be hashed
  name?: string;
  profileImage?: string;
  createdAt?: string;
}

export interface SavedHairstyle {
  id?: number;
  userId: number;
  name: string;
  description: string;
  imageUrl?: string;
  faceShape: string;
  dateAdded?: string;
  isAiGenerated?: boolean;
}

export interface HairstyleCategory {
  id?: number;
  name: string;
  description: string;
  imageUrl?: string;
}

// Define SQLite types
type SQLTransactionCallback = (transaction: SQLTransaction) => void;
type SQLErrorCallback = (error: any) => void;
type SQLSuccessCallback = () => void;

interface SQLTransaction {
  executeSql(
    sqlStatement: string,
    args?: any[],
    callback?: (transaction: SQLTransaction, resultSet: SQLResultSet) => void,
    errorCallback?: (transaction: SQLTransaction, error: Error) => void
  ): void;
}

interface SQLResultSet {
  insertId?: number;
  rowsAffected: number;
  rows: {
    length: number;
    item(index: number): any;
    _array: any[];
  };
}

// Initialize SQLite database
let db: any;

if (Platform.OS === 'web') {
  // Mock implementation for web
  db = {
    transaction: (
      txFunction: SQLTransactionCallback,
      errorCallback?: SQLErrorCallback,
      successCallback?: SQLSuccessCallback
    ) => {
      txFunction({
        executeSql: () => {},
      } as SQLTransaction);
      if (successCallback) successCallback();
    }
  };
} else {
  // Native implementation
  db = SQLite.openDatabaseSync("faceStyle.db");
}

// Initialize the database
export const initDatabase = async (): Promise<void> => {
  console.log('[Database] Initializing database...');
  
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx: SQLTransaction) => {
        // Users table
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            name TEXT,
            profile_image TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
          );`
        );

        // Saved hairstyles table
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS saved_hairstyles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            description TEXT,
            image_url TEXT,
            face_shape TEXT,
            date_added TEXT DEFAULT CURRENT_TIMESTAMP,
            is_ai_generated INTEGER DEFAULT 0,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
          );`
        );

        // Categories for explore page
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS hairstyle_categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            image_url TEXT
          );`
        );

        console.log('[Database] Tables created successfully');
      },
      (error: Error) => {
        console.error('[Database] Error creating tables:', error);
        reject(error);
      },
      () => {
        console.log('[Database] Database initialized successfully');
        resolve();
      }
    );
  });
};

// Initialize with mock data (for testing)
export const initMockData = async (): Promise<void> => {
  console.log('[Database] Adding mock data...');

  // Check if we already have data
  const { count } = await getUserCount();
  if (count > 0) {
    console.log('[Database] Mock data already exists');
    return;
  }

  const categories = [
    {
      name: 'Short Styles',
      description: 'Short hairstyles that are easy to maintain',
      imageUrl: 'https://i.imgur.com/example100.jpg'
    },
    {
      name: 'Medium Length',
      description: 'Versatile medium length hairstyles',
      imageUrl: 'https://i.imgur.com/example101.jpg'
    },
    {
      name: 'Long Hair',
      description: 'Elegant long hairstyles',
      imageUrl: 'https://i.imgur.com/example102.jpg'
    },
    {
      name: 'Curly Hair',
      description: 'Styles for curly and textured hair',
      imageUrl: 'https://i.imgur.com/example103.jpg'
    }
  ];

  // Add demo user
  const userId = await addUser({
    email: 'demo@example.com',
    password: 'password123',
    name: 'Demo User',
    profileImage: 'https://i.pravatar.cc/300'
  });

  // Add categories
  for (const category of categories) {
    await addCategory(category);
  }

  // Add some saved hairstyles for demo user
  const demoHairstyles = [
    {
      userId,
      name: 'Textured Pixie Cut',
      description: 'Short and stylish with texture on top for added volume.',
      imageUrl: 'https://i.imgur.com/example2.jpg',
      faceShape: 'Oval',
      isAiGenerated: false
    },
    {
      userId,
      name: 'Long Layers with Side-Swept Bangs',
      description: 'Elegant style with face-framing layers and soft side-swept bangs.',
      imageUrl: 'https://i.imgur.com/example3.jpg',
      faceShape: 'Heart',
      isAiGenerated: false
    }
  ];

  for (const hairstyle of demoHairstyles) {
    await saveHairstyle(hairstyle);
  }

  console.log('[Database] Mock data added successfully');
};

// User authentication methods
export const addUser = async (user: User): Promise<number> => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx: SQLTransaction) => {
        tx.executeSql(
          `INSERT INTO users (email, password, name, profile_image) VALUES (?, ?, ?, ?);`,
          [user.email, user.password, user.name || null, user.profileImage || null],
          (_: SQLTransaction, result: SQLResultSet) => {
            resolve(result.insertId || 0);
          }
        );
      },
      (error: Error) => {
        console.error('[Database] Error adding user:', error);
        reject(error);
      }
    );
  });
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx: SQLTransaction) => {
        tx.executeSql(
          `SELECT * FROM users WHERE email = ?;`,
          [email],
          (_: SQLTransaction, { rows }: SQLResultSet) => {
            if (rows.length > 0) {
              const user = rows.item(0);
              resolve({
                id: user.id,
                email: user.email,
                password: user.password,
                name: user.name,
                profileImage: user.profile_image,
                createdAt: user.created_at
              });
            } else {
              resolve(null);
            }
          }
        );
      },
      (error: Error) => {
        console.error('[Database] Error getting user:', error);
        reject(error);
      }
    );
  });
};

export const getUserById = async (id: number): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx: SQLTransaction) => {
        tx.executeSql(
          `SELECT * FROM users WHERE id = ?;`,
          [id],
          (_: SQLTransaction, { rows }: SQLResultSet) => {
            if (rows.length > 0) {
              const user = rows.item(0);
              resolve({
                id: user.id,
                email: user.email,
                password: user.password,
                name: user.name,
                profileImage: user.profile_image,
                createdAt: user.created_at
              });
            } else {
              resolve(null);
            }
          }
        );
      },
      (error: Error) => {
        console.error('[Database] Error getting user:', error);
        reject(error);
      }
    );
  });
};

export const getUserCount = async (): Promise<{ count: number }> => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx: SQLTransaction) => {
        tx.executeSql(
          `SELECT COUNT(*) as count FROM users;`,
          [],
          (_: SQLTransaction, { rows }: SQLResultSet) => {
            resolve({ count: rows.item(0).count });
          }
        );
      },
      (error: Error) => {
        console.error('[Database] Error counting users:', error);
        reject(error);
      }
    );
  });
};

export const updateUser = async (user: User): Promise<void> => {
  if (!user.id) throw new Error('User ID is required for update');
  
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx: SQLTransaction) => {
        tx.executeSql(
          `UPDATE users SET name = ?, profile_image = ? WHERE id = ?;`,
          [user.name || null, user.profileImage || null, user.id],
          () => {
            resolve();
          }
        );
      },
      (error: Error) => {
        console.error('[Database] Error updating user:', error);
        reject(error);
      }
    );
  });
};

// Saved hairstyles methods
export const saveHairstyle = async (hairstyle: SavedHairstyle): Promise<number> => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx: SQLTransaction) => {
        tx.executeSql(
          `INSERT INTO saved_hairstyles (
            user_id, name, description, image_url, face_shape, is_ai_generated
          ) VALUES (?, ?, ?, ?, ?, ?);`,
          [
            hairstyle.userId,
            hairstyle.name,
            hairstyle.description || '',
            hairstyle.imageUrl || null,
            hairstyle.faceShape,
            hairstyle.isAiGenerated ? 1 : 0
          ],
          (_: SQLTransaction, result: SQLResultSet) => {
            resolve(result.insertId || 0);
          }
        );
      },
      (error: Error) => {
        console.error('[Database] Error saving hairstyle:', error);
        reject(error);
      }
    );
  });
};

export const getSavedHairstyles = async (userId: number): Promise<SavedHairstyle[]> => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx: SQLTransaction) => {
        tx.executeSql(
          `SELECT * FROM saved_hairstyles WHERE user_id = ? ORDER BY date_added DESC;`,
          [userId],
          (_: SQLTransaction, { rows }: SQLResultSet) => {
            const hairstyles: SavedHairstyle[] = [];
            for (let i = 0; i < rows.length; i++) {
              const item = rows.item(i);
              hairstyles.push({
                id: item.id,
                userId: item.user_id,
                name: item.name,
                description: item.description,
                imageUrl: item.image_url,
                faceShape: item.face_shape,
                dateAdded: item.date_added,
                isAiGenerated: !!item.is_ai_generated
              });
            }
            resolve(hairstyles);
          }
        );
      },
      (error: Error) => {
        console.error('[Database] Error getting saved hairstyles:', error);
        reject(error);
      }
    );
  });
};

export const deleteSavedHairstyle = async (id: number, userId: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx: SQLTransaction) => {
        tx.executeSql(
          `DELETE FROM saved_hairstyles WHERE id = ? AND user_id = ?;`,
          [id, userId],
          () => {
            resolve();
          }
        );
      },
      (error: Error) => {
        console.error('[Database] Error deleting hairstyle:', error);
        reject(error);
      }
    );
  });
};

// Categories for explore page
export const addCategory = async (category: HairstyleCategory): Promise<number> => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx: SQLTransaction) => {
        tx.executeSql(
          `INSERT INTO hairstyle_categories (name, description, image_url) VALUES (?, ?, ?);`,
          [category.name, category.description || '', category.imageUrl || null],
          (_: SQLTransaction, result: SQLResultSet) => {
            resolve(result.insertId || 0);
          }
        );
      },
      (error: Error) => {
        console.error('[Database] Error adding category:', error);
        reject(error);
      }
    );
  });
};

export const getCategories = async (): Promise<HairstyleCategory[]> => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx: SQLTransaction) => {
        tx.executeSql(
          `SELECT * FROM hairstyle_categories;`,
          [],
          (_: SQLTransaction, { rows }: SQLResultSet) => {
            const categories: HairstyleCategory[] = [];
            for (let i = 0; i < rows.length; i++) {
              const item = rows.item(i);
              categories.push({
                id: item.id,
                name: item.name,
                description: item.description,
                imageUrl: item.image_url
              });
            }
            resolve(categories);
          }
        );
      },
      (error: Error) => {
        console.error('[Database] Error getting categories:', error);
        reject(error);
      }
    );
  });
};

// Update saved hairstyle with local image path
export const updateHairstyleImage = async (hairstyleId: number, localImageUri: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx: SQLTransaction) => {
        tx.executeSql(
          `UPDATE saved_hairstyles SET image_url = ? WHERE id = ?;`,
          [localImageUri, hairstyleId],
          () => {
            resolve(true);
          }
        );
      },
      (error: Error) => {
        console.error('[Database] Error updating hairstyle image:', error);
        reject(error);
        return false;
      }
    );
  });
}; 