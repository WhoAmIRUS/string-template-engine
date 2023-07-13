export const isNullable = (value: any): value is null | undefined => value === undefined || value === null;

export function replaceAll(str: string, find: string, replace: string): string {
    return str.replace(new RegExp(find, 'g'), replace);
}

export function isObject(value: unknown): value is object {
    return typeof value === 'object' && !Array.isArray(value) && value !== null;
}

export function getCallOrder() {
    let callOrder: string[] = [];

    const functionDecorator =
        (name: string, func: any) =>
            (...args: any[]) => {
                callOrder.push(name);

                return func(...args);
            };

    const resetCallOrder = () => {
        callOrder = [];
    };

    return {callOrder, resetCallOrder, functionDecorator};
}
