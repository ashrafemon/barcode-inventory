/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: "/",
                destination: "/dashboard",
                permanent: false,
            },
        ];
    },
    images: {
        remotePatterns: [{ hostname: "img.freepik.com" }],
    },
};

export default nextConfig;
