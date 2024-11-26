function normalizeText(input: string):string {
    if(typeof input !== "string") {
        throw new TypeError("input must be a string");
    }

    const from = "séíóúáÁÉÍÓÚAEIOU";
    const to = "seiouaAEIOUaeiou";


    const mapping = new Map<string, string>();
    for (let i = 0; i < from.length; i++) {
        mapping.set(from[i], to[i]);
    }

    const result = input
    .replace(/\s+/g, "")
    .split("")
    .map((char) => mapping.get(char) || char)
    .join("")
    .toLowerCase();

    return result;
}

export default normalizeText;