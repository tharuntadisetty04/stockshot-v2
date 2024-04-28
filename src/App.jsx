import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from './components/SearchBar';
import MediaItem from './components/MediaItem';
import Pagination from './components/Pagination';
import ErrorDisplay from './components/ErrorDisplay';
import { saveAs } from 'file-saver';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [media, setMedia] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 30;
  const totalPages = 3;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        if (!searchQuery) return;
        const startIndex = (page - 1) * itemsPerPage;

        // Fetch images from Pexels
        const pexelsResponse = await axios.get(
          `https://api.pexels.com/v1/search?query=${searchQuery}&per_page=${itemsPerPage}&page=${page}`
          , {
            headers: {
              Authorization: import.meta.env.VITE_PEXELS_API_KEY
            }
          });

        const pexelsImages = pexelsResponse.data.photos.map(photo => ({
          type: 'image',
          id: photo.id,
          fhd: photo.src.large,
          hd: photo.src.medium,
          sd: photo.src.small,
          portrait: photo.src.portrait,
          landscape: photo.src.landscape,
          user: photo.photographer,
          source: "Pexels",
        }));

        const combinedImages = [...pexelsImages, ...pexelsImages, ...pexelsImages];
        const currentPageImages = combinedImages.slice(startIndex, startIndex + itemsPerPage);

        setMedia(currentPageImages);

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [searchQuery, page]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleImgDownload = (url) => {
    saveAs(url, 'image.jpg')
  };

  const copyToClipboard = (fileUrl) => {
    navigator.clipboard.writeText(fileUrl)
      .then(notify())
      .catch((error) => console.error('Error copying to clipboard:', error));
  };

  const notify = () => toast("URL Copied ...");

  return (
    <div className="container mx-auto font-poppins">
      <h1 className="text-center sm:text-4xl text-xl font-semibold py-4 text-purple-500">Pixlr - Stock Images Gallery</h1>

      <div className='flex justify-center items-center flex-col sm:flex-row text-center gap-4 md:mt-1 mb-4'>
        <SearchBar value={searchQuery} onChange={handleSearch} />
      </div>

      {!isLoading && media.length === 0 && <ErrorDisplay message="No Images Found" />}

      <div className='flex justify-center items-center flex-col'>
        {!isLoading && (
          <>
            <div className='grid sm:grid-cols-3 sm:gap-4'>
              {media.map(item => (
                <MediaItem
                  key={item.id}
                  item={item}
                  onDownload={handleImgDownload}
                  onCopy={copyToClipboard}
                />
              ))}
            </div>
            <ToastContainer />
          </>
        )}
        {!isLoading && (
          <Pagination setPage={setPage} currentPage={page} totalPages={totalPages} />
        )}
      </div>
    </div>
  );
};

export default App;
