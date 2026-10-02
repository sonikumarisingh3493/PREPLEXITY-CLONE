import EventEmitter from "events";

const handleStream = async (
  stream: AsyncIterable<any>,
  emitter: EventEmitter
): Promise<void> => {
  try {
    let responseText = "";

    for await (const event of stream) {

      // -----------------------------
      // STREAMING AI RESPONSE
      // -----------------------------
      if (
        event.event === "on_chain_stream" &&
        event.name === "FinalResponseGenerator"
      ) {
        const chunk = event.data?.chunk;

        if (typeof chunk === "string") {
          responseText += chunk;

          emitter.emit(
            "data",
            JSON.stringify({
              type: "response",
              data: chunk,
            })
          );
        }
      }

      // -----------------------------
      // SEARCH RESULTS
      // -----------------------------
      if (
        event.event === "on_chain_end" &&
        event.name === "FinalSourceRetriever"
      ) {
        const sources = event.data?.output;

        if (Array.isArray(sources)) {
          emitter.emit(
            "data",
            JSON.stringify({
              type: "sources",
              data: sources,
            })
          );

          // Send YouTube videos separately
          emitter.emit(
            "data",
            JSON.stringify({
              type: "videos",
              data: sources.map((video: any) => ({
                title: video.title || "Untitled Video",

                url: video.url || "",

                img_src:
                  video.img_src ||
                  video.thumbnail ||
                  "",

                iframe_src:
                  video.iframe_src ||
                  "",
              })),
            })
          );
        }
      }
    }

    // -----------------------------
    // STREAM COMPLETE
    // -----------------------------

    emitter.emit(
      "data",
      JSON.stringify({
        type: "done",
      })
    );

    emitter.emit("end");

  } catch (err) {
    console.error("HANDLE STREAM ERROR:", err);

    emitter.emit("error", err);
  }
};

export default handleStream;
