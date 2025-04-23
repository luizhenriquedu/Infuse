export function isPrimitiveType(type: any) {
    return [String, Number, Boolean, Object].includes(type);
}
