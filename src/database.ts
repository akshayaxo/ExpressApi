export interface Reading {
    time: string;
    name: string;
    value: number;
}

// This is a fake database which stores data in-memory while the process is running
// Feel free to change the data structure to anything else you would like
const database: Record<string, Reading[]> = {};

/**
 * Store a reading in the database using the given key
 */
export const addReading = (key: string, reading: Reading[]): boolean => {
    database.key = reading;
    console.log(key);
    console.log(database.key);
    return true;
};

/**
 * Retrieve a reading from the database using the given key
 */
export const getReading = (key: string): Reading[] | undefined => {
    console.log(database.key);
    return database.key;
};
