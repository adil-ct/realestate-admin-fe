import ProgressBar from 'components/ProgressBar';
import { axiosMain } from 'http/axios/axios_main';
import React, { useState, useEffect } from 'react';
import Dropzone from 'react-dropzone';
import { Lightbox } from 'react-modal-image';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { setSavedItem } from 'store/actions';

const ImageUpload = ({ data, view }) => {
  const [initialData] = useState(data.list || []);
  const [changed, setChanged] = useState(false);
  const [fileLoading,setFileLoading] = useState({loading:false,newfiles:5})
  const [main] = useState(JSON.parse(JSON.stringify(data.mainImage || 0)));
  const [mainImg, setMainImg] = useState(JSON.parse(JSON.stringify(data.mainImage || 0)));
  const [uploading, setUploading] = useState(0);
  const dispatch = useDispatch();
  const [selectedFiles, setselectedFiles] = useState(initialData);
  const [image, setImage] = useState();
  useEffect(() => {
    const changedAgain =
      JSON.stringify(selectedFiles) !== JSON.stringify(initialData) || mainImg !== main;
    data.mainImage = mainImg;
    if (changedAgain !== changed) {
      // changed = changedAgain;
      setChanged(changedAgain);
      dispatch(setSavedItem({ tab: 4, changed: changedAgain }));
    }
    data.list = selectedFiles;
  }, [selectedFiles, mainImg]);
  // const formatBytes = (bytes, decimals = 2) => {
  //   if (bytes === 0) return '0 Bytes';
  //   const k = 1024;
  //   const dm = decimals < 0 ? 0 : decimals;
  //   const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  //   const i = Math.floor(Math.log(bytes) / Math.log(k));
  //   return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
  // };
  const handleAcceptedFiles = async files => {
    const fd = new FormData();
    // files.map((file, index) =>
    //   Object.assign(file, {
    //     id: index + selectedFiles.length,
    //     preview: URL.createObjectURL(file),
    //     formattedSize: formatBytes(file.size),
    //   }),
    // );
    files.forEach(item => fd.append('images', item));
    setUploading(1);
    setFileLoading(prev=>({...prev,loading:true,newfiles:files.length}))
    try {
      const response = await axiosMain({
        method: 'post',
        url: '/property/file.upload',
        data: fd,
        onUploadProgress: progress => {
          const { total, loaded } = progress;
          const totalSizeInMB = total / 1000000;
          const loadedSizeInMB = loaded / 1000000;
          const uploadPercentage = Math.floor((loadedSizeInMB / totalSizeInMB) * 100);
          setUploading(uploadPercentage);       
        },
      });
      setselectedFiles([...selectedFiles, ...response?.data?.data?.images ?? []]);
    setFileLoading(prev=>({...prev,loading:false}))
      
    } catch (err) {
    setFileLoading(prev=>({...prev,loading:false}))
      setUploading(0);
      const msg =
        err.response?.status === 413
          ? 'Request entity too large to upload'
          : err.response?.data?.msg || 'Something went wrong, server error!';
      toast.error(msg);
    }
  };
  const handleDelete = id => {
    const mainIndex = data.mainImage || 0;
    if (id === mainIndex) {
      data.mainImage = 0;
    } else if (id < mainIndex) {
      data.mainImage = mainIndex - 1;
    }
    const newFiles = selectedFiles.filter((item, index) => index !== id);
    setselectedFiles(newFiles);
  };
  const handleImageShow = url => (url !== undefined ? setImage(url) : setImage());
  return (
    <>
      <ProgressBar uploadPercentage={uploading} setUploading={setUploading} />
      <div className="heading fw-bolder">Upload Images</div>
      {!view && (
        <Dropzone
          onDrop={acceptedFiles => {
            handleAcceptedFiles(acceptedFiles);
          }}
          accept="image/*"
        >
          {({ getRootProps, getInputProps }) => (
            <div className="dropzone">
              <div className="dz-message needsclick" {...getRootProps()}>
                <input {...getInputProps()} />
                <div className="mb-3">
                  <i className="display-4 text-muted uil uil-cloud-upload" />
                </div>
                <h4>Drop images here or click to upload.</h4>
              </div>
            </div>
          )}
        </Dropzone>
      )}
      <div className="d-flex flex-wrap images-container">
        {selectedFiles.map((item, index) => (
          <div key={item.key} className="image-container">
            <img
              src={item.url}
              alt={item.key}
              className="image-preview"
              onClick={() => handleImageShow(index)}
            />
            {!view && (
              <button type="button" className="delete-button" onClick={() => handleDelete(index)}>
                <i className="fa fa-trash mx-2" role="button" />
              </button>
            )}
            {(!view || index === (data.mainImage || 0)) && (
              <div className="main-image-div p-3">
                <div className="fw-bolder">Set as default</div>

                <input
                  type="radio"
                  name="main-image"
                  defaultChecked={index === (data.mainImage || 0)}
                  onChange={() => setMainImg(index)}
                />
              </div>
            )}
          </div>
        ))}
        {!uploading && fileLoading.loading && [...new Array(fileLoading.newfiles)].map((item) => (
          <div key={item} className="image-container">
            <div
              className="skel-image"
            />
          </div>
        ))}
      </div>
      {image !== undefined ? (
        <>
          <Lightbox
            large={selectedFiles[image]?.url}
            // alt={image.contentType}
            hideDownload
            hideZoom={false}
            showRotate
            imageBackgroundColor="white"
            onClose={() => handleImageShow()}
          />
          <div className="icon-container" onClick={() => handleImageShow()}>
            {selectedFiles[image - 1] && (
              <button
                type="button"
                className="prev-icon"
                onClick={e => {
                  e.stopPropagation();
                  handleImageShow(prev => prev - 1);
                }}
              >
                {'<'}
              </button>
            )}
            {selectedFiles[image + 1] && (
              <button
                type="button"
                className="next-icon"
                onClick={e => {
                  e.stopPropagation();
                  handleImageShow(prev => prev + 1);
                }}
              >
                {'>'}
              </button>
            )}
          </div>
        </>
      ) : null}
    </>
  );
};

export default ImageUpload;
