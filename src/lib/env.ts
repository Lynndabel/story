export const env = {
  get useMocks() {
    return process.env.NEXT_PUBLIC_USE_MOCKS === "true";
  },
  get celoscanApiKey() {
    return process.env.NEXT_PUBLIC_CELOSCAN_API_KEY;
  },
  get noahApiKey() {
    return process.env.NEXT_PUBLIC_NOAHAI_API_KEY;
  },
  get selfApiKey() {
    return process.env.NEXT_PUBLIC_SELF_API_KEY;
  },
  get selfVerifyUrl() {
    return process.env.NEXT_PUBLIC_SELF_VERIFY_URL;
  },
};
