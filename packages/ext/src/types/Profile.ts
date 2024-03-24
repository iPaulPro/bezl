export interface Profile {
    fid?: number;
    pfpUrl?: string;
    username?: string;
    displayName?: string;
    bio?: string;
    custody?: `0x${string}`;
    verifications?: `0x${string}`[];
}