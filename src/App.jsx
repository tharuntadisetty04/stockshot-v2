import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import MediaItem from "./components/MediaItem";
import Pagination from "./components/Pagination";
import ErrorDisplay from "./components/ErrorDisplay";
import { saveAs } from "file-saver";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "./components/Loader";
import debounce from "lodash/debounce";

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [media, setMedia] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const itemsPerPage = 27;
  const totalPages = 5;

  const fetchData = useCallback(
    async (query, pageNumber) => {
      if (!query) return;

      try {
        setIsLoading(true);
        setHasSearched(true);
        const startIndex = (pageNumber - 1) * itemsPerPage;

        // Fetch images from Pexels
        const pexelsImageResponse = await axios.get(
          `https://api.pexels.com/v1/search?query=${query}&per_page=${itemsPerPage}&page=${pageNumber}`,
          {
            headers: {
              Authorization: import.meta.env.VITE_PEXELS_API_KEY,
            },
          }
        );

        const pexelsImages = pexelsImageResponse.data.photos.map((photo) => ({
          type: "image",
          id: photo.id,
          fhd: photo.src.large,
          hd: photo.src.medium,
          sd: photo.src.small,
          portrait: photo.src.portrait,
          landscape: photo.src.landscape,
          user: photo.photographer,
          source: "Pexels",
        }));

        // Fetch videos from Pexels
        const pexelsVideoResponse = await axios.get(
          `https://api.pexels.com/videos/search?query=${query}&per_page=${itemsPerPage}&page=${pageNumber}`,
          {
            headers: {
              Authorization: import.meta.env.VITE_PEXELS_API_KEY,
            },
          }
        );

        const pexelsVideos = pexelsVideoResponse.data.videos.map((video) => ({
          type: "video",
          id: video.id,
          hd_url: video.video_files.find((file) => file.quality === "hd")?.link,
          sd_url: video.video_files.find((file) => file.quality === "sd")?.link,
          file_type: video.video_files[0].file_type,
          user: video.user.name,
          duration: video.duration,
          source: "Pexels",
        }));

        const combinedMedia = [
          ...pexelsImages,
          ...pexelsImages,
          ...pexelsImages,
          ...pexelsVideos,
          ...pexelsVideos,
        ];

        const currentPageMedia = combinedMedia.slice(
          startIndex,
          startIndex + itemsPerPage
        );

        setMedia(currentPageMedia);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    },
    [itemsPerPage]
  );

  const debouncedFetchData = useCallback(
    debounce((query, pageNumber) => fetchData(query, pageNumber), 500),
    [fetchData]
  );

  useEffect(() => {
    if (searchQuery) {
      debouncedFetchData(searchQuery, page);
    }
  }, [searchQuery, page, debouncedFetchData]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleImgDownload = (url) => {
    saveAs(url, "image.jpg");
  };

  const handleVideoDownload = (url) => {
    saveAs(url, "video.mp4");
  };

  const copyToClipboard = (fileUrl) => {
    navigator.clipboard
      .writeText(fileUrl)
      .then(toast.success("URL Copied"))
      .catch((error) => toast.error("Error copying to clipboard:", error));
  };

  return (
    <div className="container mx-auto font-poppins">
      <h1 className="text-center sm:text-4xl text-xl font-semibold py-4 text-purple-600">
        StockShot - Stock Images & Videos
      </h1>

      <div className="flex justify-center items-center flex-col sm:flex-row text-center gap-4 md:mt-1 mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search here"
          className="border-b-2 border-b-purple-400 outline-none p-2 rounded-md bg-slate-50"
        />

        <div className="flex justify-center items-center gap-2">
          <button
            className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 font-medium rounded-md"
            onClick={() => setPage(1)}
            disabled={page === 1}
          >
            Images
          </button>

          <button
            className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 font-medium rounded-md"
            onClick={() => setPage(4)}
          >
            Videos
          </button>
        </div>
      </div>

      {!isLoading && hasSearched && media.length === 0 && (
        <ErrorDisplay message="No Files Found" />
      )}

      <div className="flex justify-center items-center flex-col">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <div className="grid sm:grid-cols-3 sm:gap-4">
              {media &&
                media.map((item) => (
                  <MediaItem
                    key={item.id}
                    item={item}
                    onDownload={
                      item.type === "image"
                        ? handleImgDownload
                        : handleVideoDownload
                    }
                    onCopy={copyToClipboard}
                  />
                ))}
            </div>

            {media.length > 0 && (
              <Pagination
                setPage={setPage}
                currentPage={page}
                totalPages={totalPages}
              />
            )}

            <ToastContainer
              position="top-right"
              autoClose={2500}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default App;
