// src/system-handler/xmlSitemap.handler.ts

const handleXmlSitemap = async (): Promise<Response> => {
  return new Response(`<urlset></urlset>`, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
    },
  });
};
export default handleXmlSitemap;
