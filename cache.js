class DataCache {
    constructor() {
        this.cache = new Map();
        this.cleanupInterval = setInterval(this.clearExpiredCache.bind(this), 3000);
    }

    async getData(baseUrl) {
        const url = `${baseUrl}/${Math.floor(Math.random() * 200) + 1}`;

        const cachedData = this.cache.get(url);
        if (cachedData && !this.isExpired(cachedData)) {
            return cachedData.value;
        }

        const response = await fetch(url);
        const json = await response.json();
        this.cache.set(url, { time: new Date(), value: json });
        return json;
    }

    clearExpiredCache() {
        const currentTime = new Date();
        this.cache.forEach((value, key) => {
            if ((currentTime - value.time) / 1000 > 10) {
                this.cache.delete(key);
                console.log(`${key} cache deleted 💥`);
            }
        });
    }

    isExpired(cachedData) {
        return (new Date() - cachedData.time) / 1000 > 10;
    }
}

const dataCache = new DataCache();

document.getElementById('fetchButton').addEventListener('click', async () => {
    try {
        const fetchedData = await dataCache.getData('https://jsonplaceholder.typicode.com/todos');
        console.log('Fetched Data:', fetchedData);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});