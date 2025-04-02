declare module 'vis-network/dist/vis-network' {
  export class Network {
    constructor(container: HTMLElement, data: any, options?: any);
    fit(options?: { animation?: { duration: number; easingFunction: string } }): void;
  }
}

declare module 'vis-data' {
  export class DataSet<T> {
    constructor(data?: T[]);
    add(data: T | T[]): void;
    remove(data: T | T[]): void;
    update(data: T | T[]): void;
    get(id: string | number): T | null;
    getIds(): (string | number)[];
    forEach(callback: (item: T) => void): void;
  }
} 