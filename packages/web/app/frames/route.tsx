export { GET, POST } from "frames.js/render/next";

// export const POST = async (req: NextRequest, res: any) => {
//   console.log("show");
//
//   const redirectHandler = (prevFrame: PreviousFrame) => {
//     return "https://www.google.com";
//   };
//
//   return new Response(null, {
//     status: 302,
//     headers: {
//       Location: "http://www.google.com",
//     },
//   });
// };