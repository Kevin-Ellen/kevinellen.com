export default {
  async fetch(): Promise<Response> {
    return new Response(
      "Hello from kevinellen.com - A bundle created at " +
        new Date().toISOString(),
    );
  },
};
