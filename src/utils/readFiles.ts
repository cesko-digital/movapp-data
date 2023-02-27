import {promises, Stats} from 'node:fs'
import {join} from 'node:path'

const {readdir, stat} = promises

export const readFiles = async (
    dir: string,
    checkShouldIgnore?: (uri: string, stats: Stats) => boolean,
    concurrency = 100,
): Promise<string[]> => {
    const collected: string[] = [];
    const queue = [dir];
    const visit = async (file: string) => {
        const stats = await stat(file);
        if (checkShouldIgnore?.(file, stats)) return;
        if (stats.isDirectory()) {
            queue.push(...(await readdir(file)).map(f => join(file, f)));
            return;
        }
        collected.push(file);
    };
    while (queue.length) {
        await Promise.all(
            queue.splice(0, concurrency).map(visit)
        );
    }
    return collected;
};
