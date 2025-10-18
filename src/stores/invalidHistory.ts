import { writable } from 'svelte/store';

export const invalidHistory = writable<string[]>([]);
