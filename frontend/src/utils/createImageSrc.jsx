export default function createImageSrc(bufferArray) {
    return new Promise((resolve, reject) => {
        const blob = new Blob([new Uint8Array(bufferArray)], { type: 'image/png' });
        const reader = new FileReader();
        
        reader.onloadend = () => {
            resolve(reader.result);
        };
        
        reader.onerror = () => {
            reject(new Error('Failed to read the file.'));
        };
        
        reader.readAsDataURL(blob);
    });
}
