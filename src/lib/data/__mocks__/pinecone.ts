export class PineconeClient {
  async init() {
    return Promise.resolve();
  }

  Index() {
    return {
      upsert: async () => Promise.resolve(),
      query: async () => Promise.resolve({
        matches: []
      }),
      delete: async () => Promise.resolve()
    };
  }
}
