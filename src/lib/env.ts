export const env = {
  useMocks: process.env.NEXT_PUBLIC_USE_MOCKS === "true",
  celoscanApiKey: process.env.NEXT_PUBLIC_CELOSCAN_API_KEY,
  noahApiKey: process.env.NEXT_PUBLIC_NOAHAI_API_KEY,
  selfApiKey: process.env.NEXT_PUBLIC_SELF_API_KEY,
  selfVerifyUrl: process.env.NEXT_PUBLIC_SELF_VERIFY_URL,
};
