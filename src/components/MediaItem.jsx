import React from 'react';

const MediaItem = ({ item, onDownload, onCopy }) => {

    return (
        <>
            <div className='m-2 text-center max-w-sm rounded overflow-hidden shadow-lg h-fit bg-slate-100'>
                {item.type === 'image' ? (
                    <>
                        <img src={item.portrait} alt={`${item.source} Image`} className='w-full h-full max-h-96 duration-300 hover:scale-105 object-cover' loading="lazy" />

                        <div className="flex flex-col m-5">
                            <div className='p-2 flex gap-4 justify-center'>
                                <button onClick={() => onCopy(item.hd)} className='bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 font-medium rounded-md'>Copy URL</button>
                                <button className='bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 font-medium rounded-md' onClick={() => onDownload(item.fhd)}>FHD</button>
                                <button className='bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 font-medium rounded-md' onClick={() => onDownload(item.hd)}>HD</button>
                            </div>

                            <div className='p-2 flex gap-4 justify-center'>
                                <button className='bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 font-medium rounded-md' onClick={() => onDownload(item.sd)}>SD</button>
                                <button className='bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 font-medium rounded-md' onClick={() => onDownload(item.portrait)}>Portrait</button>
                                <button className='bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 font-medium rounded-md' onClick={() => onDownload(item.landscape)}>Landscape</button>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <video controls className='w-full max-h-52 aspect-video'>
                            <source src={item.hd_url} type={item.file_type} />
                            Your browser does not support the video tag.
                        </video>

                        <div className="px-6 py-4">
                            <div className="font-bold text-xl text-purple-600 mb-1">Video by {item.user}</div>
                            <div className="font-bold text-lg text-purple-600">Duration: {item.duration}s</div>
                        </div>

                        <div className='mb-4 flex justify-center gap-4'>
                            <button className='bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 font-medium rounded-md' onClick={() => onDownload(item.hd_url)}>Download HD</button>
                            <button className='bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 font-medium rounded-md' onClick={() => onDownload(item.sd_url)}>Download SD</button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default MediaItem;
