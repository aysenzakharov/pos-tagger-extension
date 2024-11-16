export type Tag = [word: string, pos: string]

export async function getTags(text: string): Promise<Tag[]> {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify({ "text": text });
    const requestOptions: RequestInit = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    try {
        const response = await fetch("https://part-of-speech-tool.info/api/v1/pos_tagging/", requestOptions);
        let data = await response.json();
        return data.pos_tags
    } catch (error) {
        console.error('Ошибка при получении POS-тегов:', error);
        return [];
    }
}
