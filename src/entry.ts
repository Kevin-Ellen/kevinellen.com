export default {
  async fetch(): Promise<Response> {
    return new Response(
      "Hello from kevinellen.com - B bundle created at " +
        new Date().toISOString(),
    );
  },
};
