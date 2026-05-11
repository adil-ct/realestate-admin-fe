import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Dropzone from 'react-dropzone';

import { axiosMain } from 'http/axios/axios_main';
import ProgressBar from 'components/ProgressBar';
import { setSavedItem } from 'store/actions';
import PDF from 'assets/images/PDF.png';
import DOC from 'assets/images/DOC.png';
import { Col, Row } from 'reactstrap';

const VideoUpload = ({ data, view }) => {
  const [fileLoading, setFileLoading] = useState({ loading: false, newfiles: 5 });
  const documentImage = { pdf: PDF, msword: DOC };
  const [initialData] = useState(data?.video || {});
  const [selectedFiles, setselectedFiles] = useState(initialData);
  const [changed, setChanged] = useState(false);
  const [uploading, setUploading] = useState(0);
  const dispatch = useDispatch();

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
  };

  useEffect(() => {
    const changedAgain = JSON.stringify(selectedFiles) !== JSON.stringify(initialData);
    if (changedAgain !== changed) {
      setChanged(changedAgain);
      dispatch(setSavedItem({ tab: 5, changed: changedAgain }));
    }
    data.video = selectedFiles;
    if (selectedFiles) {
      data.video.sizeInMegaByte = selectedFiles.size;
      delete data.video.size;
    }
  }, [selectedFiles]);

  const handleAcceptedFiles = async files => {
    const fd = new FormData();
    files.forEach(item => fd.append('video', item));
    if (files[0]?.type?.includes('video')) {
      setUploading(1);
      setFileLoading(prev => ({ ...prev, loading: true, newfiles: files.length }));
    }
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
      setselectedFiles(response.data?.data?.video);
      setFileLoading(prev => ({ ...prev, loading: false }));
    } catch (err) {
      setFileLoading(prev => ({ ...prev, loading: false }));
      setUploading(0);
      const msg =
        err.response?.status === 413
          ? 'Request entity too large to upload'
          : err.response?.data?.msg || 'Something went wrong, server error!';
      toast.error(msg);
    }
  };

  const handleDelete = () => {
    setselectedFiles({});
  };

  return (
    <>
      <ProgressBar uploadPercentage={uploading} setUploading={setUploading} />
      <div className="heading fw-bolder">Upload Infographic</div>

      {!view && (
        <Dropzone
          onDrop={acceptedFiles => {
            handleAcceptedFiles(acceptedFiles);
          }}
          accept="video/mp4,video/x-m4v,video/*,.pdf,image/*"
        >
          {({ getRootProps, getInputProps }) => (
            <div className="dropzone">
              <div className="dz-message needsclick" {...getRootProps()}>
                <input {...getInputProps()} />
                <div className="mb-3">
                  <i className="display-4 text-muted uil uil-cloud-upload" />
                </div>
                <h4>Drop PDF/Video/Image here or click to upload.</h4>
              </div>
            </div>
          )}
        </Dropzone>
      )}
      <div className="d-flex flex-wrap images-container">
        {selectedFiles?.contentType?.includes('video') && Object.keys(selectedFiles)?.length > 1 && (
          <div key={selectedFiles?.key} className="image-container">
            <video width="350" height="240" controls>
              <source src={selectedFiles?.url} type="video/mp4" />
              <track src="captions_en.vtt" kind="captions" srcLang="en" label="english_captions" />
            </video>
            {!view && (
              <button type="button" className="delete-button" onClick={() => handleDelete()}>
                <i className="fa fa-trash mx-2" role="button" />
              </button>
            )}
          </div>
        )}
        {selectedFiles?.contentType === 'application/pdf' && (
          <Row className="document-container p-1 w-100" key={selectedFiles.key}>
            <Col lg={3}>
              <a
                href={selectedFiles.url || selectedFiles.location}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={documentImage[selectedFiles.contentType.split('/').pop()]}
                  alt={selectedFiles.key}
                  height="50"
                  width="50"
                />
              </a>
            </Col>
            <Col lg={4} className="text-break">
              {selectedFiles.key}
            </Col>
            <Col>{formatBytes(selectedFiles.sizeInMegaByte || selectedFiles.size)}</Col>
            {!view && (
              <Col>
                <div className="cross" onClick={() => handleDelete()}>
                  X
                </div>
              </Col>
            )}
          </Row>
        )}
        {selectedFiles?.contentType?.includes('image') && (
          <div key={selectedFiles.key} className="image-container">
            <img
              src={selectedFiles.url}
              alt={selectedFiles.key}
              className="image-preview"
              // onClick={() => handleImageShow(index)}
            />
            {!view && (
              <button type="button" className="delete-button" onClick={() => handleDelete()}>
                <i className="fa fa-trash mx-2" role="button" />
              </button>
            )}
          </div>
        )}

        {!uploading &&
          fileLoading.loading &&
          [...new Array(fileLoading.newfiles)].map(item => (
            <div key={item} className="image-container">
              <div className="skel-image" />
            </div>
          ))}
      </div>
    </>
  );
};

export default VideoUpload;
