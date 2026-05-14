import React, { useEffect, useState } from 'react';
import Dropzone from 'react-dropzone';
import PDF from 'assets/images/PDF.png';
import DOC from 'assets/images/DOC.png';
import { Col, Row } from 'reactstrap';
import { useDispatch } from 'react-redux';
import { setSavedItem } from 'store/actions';
import { axiosMain } from 'http/axios/axios_main';
import { toast } from 'react-toastify';
import ProgressBar from 'components/ProgressBar';

const DocumentUpload = ({ data, view, rental,status }) => {
  const documentImage = { pdf: PDF, msword: DOC };
  const [changed, setChanged] = useState(false);
  const [uploading, setUploading] = useState(0);
  const [main] = useState(data.main ? [data.main] : []);
  const [others] = useState(data.others || []);
  const [selectedFiles, setselectedFiles] = useState(others);
  const [mainDoc, setMainDoc] = useState(main);
  const isDraft = status==="Draft"
  const dispatch = useDispatch();
  useEffect(() => {
    const changedAgain =
      JSON.stringify(selectedFiles) !== JSON.stringify(others) ||
      JSON.stringify(mainDoc) !== JSON.stringify(main);
    if (changedAgain !== changed) {
      setChanged(changedAgain);
      dispatch(setSavedItem({ tab: 3, changed: changedAgain }));
    }
  }, [selectedFiles, mainDoc]);
  const formatBytes = (bytes, decimals = 2) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.max(0, Math.min(sizes.length - 1, Math.floor(Math.log(bytes) / Math.log(k))));
    return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
  };

  const formatFileSize = item => {
    if (item?.sizeInMegaByte != null) {
      const mb = Number(item.sizeInMegaByte);
      if (mb < 1) return `${(mb * 1024).toFixed(2)} KB`;
      return `${mb.toFixed(2)} MB`;
    }
    return formatBytes(item?.size);
  };
  const handleAcceptedFiles = async (files, type) => {
    if (!files.length) return;
    const fd = new FormData();
    const docType = type ? 'mainDoc' : 'documents';
    // files.map(file =>
    //   Object.assign(file, {
    //     preview: URL.createObjectURL(file),
    //     formattedSize: formatBytes(file.size),
    //     img: documentImage[file.name.split('.').pop()],
    //   }),
    // );
    try {
      files.forEach(item => fd.append(docType, item));
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
      if (type) {
        data.main = response.data?.data?.[docType];
        setMainDoc([data.main]);
      } else {
        const otherDocs =  [...selectedFiles, ...(response?.data?.data?.[docType] ?? [])];
        data.others = otherDocs;
        setselectedFiles([...data.others]);
      }
    } catch (err) {
      setUploading(0);
      const msg =
        err.response?.status === 413
          ? 'Request entity too large to upload'
          : err.response?.data?.msg || 'Something went wrong, server error!';
      toast.error(msg);
    }
  };
  const handleDelete = (id, type) => {
    if (type) {
      setMainDoc([]);
      data.main = undefined;
      return;
    }
    data.others = selectedFiles.filter((item, index) => index !== id);
    setselectedFiles(data.others);
  };
  return (
    <>
      <ProgressBar uploadPercentage={uploading} setUploading={setUploading} />
      <div className="heading fw-bolder">Upload Document</div>
      <div className="mb-4">
        {!mainDoc.length && !view ? (
          <Dropzone
            onDrop={acceptedFiles => {
              handleAcceptedFiles(acceptedFiles, 'main');
            }}
            accept=".pdf,.doc"
            multiple={false}
          >
            {({ getRootProps, getInputProps }) => (
              <div className="dropzone">
                <div className="dz-message needsclick" {...getRootProps()}>
                  <input {...getInputProps()} />
                  <div className="mb-3">
                    <i className="display-4 text-muted uil uil-cloud-upload" />
                  </div>
                  <h4>Upload main document</h4>
                  <h5>Drop files here or click to upload.</h5>
                </div>
              </div>
            )}
          </Dropzone>
        ) : (
          <div>
            {mainDoc.length ? <h5>Main Document</h5> : null}
            {mainDoc.map(item => (
              <Row className="document-container" key={item.key}>
                <Col lg={3}>
                  <a href={item.location || item.url} target="_blank" rel="noreferrer">
                    <img
                      src={documentImage[item.contentType.split('/').pop()]}
                      alt={item.key}
                      height="50"
                      width="50"
                    />
                  </a>
                </Col>
                <Col lg={4} className="text-break">
                  {item.key}
                </Col>
                <Col>{formatFileSize(item)}</Col>
                {!view && isDraft && (
                  <Col>
                    <div className="cross" onClick={() => handleDelete(0, 'main')}>
                      X
                    </div>
                  </Col>
                )}
              </Row>
            ))}
          </div>
        )}
      </div>
      {!view && (
        <Dropzone
          onDrop={acceptedFiles => {
            handleAcceptedFiles(acceptedFiles);
          }}
          accept=".pdf,.doc"
        >
          {({ getRootProps, getInputProps }) => (
            <div className="dropzone">
              <div className="dz-message needsclick" {...getRootProps()}>
                <input {...getInputProps()} />
                <div className="mb-3">
                  <i className="display-4 text-muted uil uil-cloud-upload" />
                </div>
                <h4>Upload other documents</h4>
                <h5>Drop files here or click to upload.</h5>
              </div>
            </div>
          )}
        </Dropzone>
      )}
      <div className="mt-3">
        {selectedFiles.length ? <h5>Other Documents</h5> : null}
        {selectedFiles.map((item, index) => (
          <Row className="document-container p-1" key={item.key}>
            <Col lg={3}>
              <a href={item.url || item.location} target="_blank" rel="noreferrer">
                <img
                  src={documentImage[item.contentType.split('/').pop()]}
                  alt={item.key}
                  height="50"
                  width="50"
                />
              </a>
            </Col>
            <Col lg={4} className="text-break">
              {item.key}
            </Col>
            <Col>{formatFileSize(item)}</Col>
            {!view && (
              <Col>
                <div className="cross" onClick={() => handleDelete(index)}>
                  X
                </div>
              </Col>
            )}
          </Row>
        ))}
      </div>
      <div className="mt-3">
        {rental?.[0] ? <h5>Rental Document</h5> : null}
        {rental?.[0] &&
          (rental[0]?.value || rental).map(item => (
            <Row className="document-container p-1" key={item.key}>
              <Col lg={3}>
                <a href={item.url || item.location} target="_blank" rel="noreferrer">
                  <img
                    src={documentImage[item.contentType.split('/').pop()]}
                    alt={item.key}
                    height="50"
                    width="50"
                  />
                </a>
              </Col>
              <Col lg={4} className="text-break">
                {item.key}
              </Col>
              <Col>{formatFileSize(item)}</Col>
            </Row>
          ))}
      </div>
    </>
  );
};

export default DocumentUpload;
