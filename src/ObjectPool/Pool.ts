export class ObjectPool<T> {
    private pool: T[] = [];
    private active: T[] = [];
    private createFn: () => T;
    private resetFn: (obj: T) => void;
    private maxSize: number;

    constructor(createFn: () => T, resetFn: (obj: T) => void, maxSize: number = 20) {
        this.createFn = createFn;
        this.resetFn = resetFn;
        this.maxSize = maxSize;
        
        for (let i = 0; i < maxSize; i++) {
            this.pool.push(createFn());
        }
    }

    public get(): T | null {
        let obj: T;
        
        if (this.pool.length > 0) {
            obj = this.pool.pop()!;
        } else if (this.active.length < this.maxSize) {
            obj = this.createFn();
        } else {
            return null; 
        }
        
        this.active.push(obj);
        return obj;
    }

    public release(obj: T): void {
        const index = this.active.indexOf(obj);
        if (index > -1) {
            this.active.splice(index, 1);
            this.resetFn(obj);
            this.pool.push(obj);
        }
    }

    public releaseAll(): void {
        while (this.active.length > 0) {
            const obj = this.active.pop()!;
            this.resetFn(obj);
            this.pool.push(obj);
        }
    }

    public getActiveCount(): number {
        return this.active.length;
    }

    public getPoolCount(): number {
        return this.pool.length;
    }
}