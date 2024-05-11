/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.externals.push({
            "utf-8-validate": "commonjs utf-8-validate",
            bufferutil: "commonjs bufferutil",
        }, 'pino-pretty', 'lokijs', 'encoding');
        return config;
    },
    images: {
        domains: ["web3trust.app"], // Specify the domain here
    },
};

export default nextConfig;
