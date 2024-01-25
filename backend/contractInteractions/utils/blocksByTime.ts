export function blocksByTime(chain: string, time: number) {
    switch (chain) {
        case "bsc":
            const bscBlockTime = 3;
            const bscBlock = Math.floor(time / bscBlockTime);
            return bscBlock;

        case "polygon":
            const polygonBlockTime = 2;
            const polygonBlock = Math.floor(time / polygonBlockTime);
            return polygonBlock;

        case "ethereum":
            const ethereumBlockTime = 13;
            const ethereumBlock = Math.floor(time / ethereumBlockTime);
            return ethereumBlock;

        case "goerli":
            const goerliBlockTime = 4;
            const goerliBlock = Math.floor(time / goerliBlockTime);
            return goerliBlock;

        default:
            return 0;
    }

}