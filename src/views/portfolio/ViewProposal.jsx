import { Button, Card, CardBody, Container } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import moment from 'moment';

import { MultiProgress } from 'components/Table/tableComponents';
import { getAssetsSummery, commonSaga } from 'store/actions';
import Breadcrumb from 'components/UI/Common/Breadcrumb';
import CurrencyFormat from 'components/CurrencyFormat';
import CustomModel from 'components/CustomModel';
import avatar from 'assets/images/avatar.jpg';
import '../viewcommon.css';

const ViewProposal = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { assetsSummery } = useSelector(state => state.portfolio);
  const { commonData } = useSelector(state => ({
    commonData: state.common,
  }));
  const [voteDialog, setVoteDialog] = useState({ show: false, data: {} });
  const urlParams = new URLSearchParams(window.location.search);
  const propertyId = urlParams.get('property');
  const via = urlParams.get('via');

  let pathItems = [];
  if (via === 'governance') {
    pathItems = [{ name: 'Governance', link: '/governance' }];
  } else {
    pathItems = [
      { name: 'My Portfolio', link: '/portfolio' },
      { name: 'Property', link: `/portfolio-property/${propertyId}` },
      { name: 'Proposals', link: `/property-proposals/${propertyId}` },
    ];
  }

  useEffect(() => {
    if (propertyId) {
      dispatch(getAssetsSummery({ id: propertyId }));
    }
    dispatch(
      commonSaga({
        endPoint: `/proposals/details/${id}`,
        type: 'get',
        stateObj: 'proposalDetails',
        baseEP: 'INVESTOR',
      }),
    );
  }, []);

  useEffect(() => {
    if (commonData?.approvalProposal?.dataUpdated) {
      dispatch(
        commonSaga({
          endPoint: `/proposals/details/${id}`,
          type: 'get',
          stateObj: 'proposalDetails',
          baseEP: 'INVESTOR',
        }),
      );
    }
  }, [commonData?.approvalProposal]);

  useEffect(() => {
    if (commonData?.voteForProposal?.dataSaved) {
      setVoteDialog({ show: false, data: {} });
      dispatch(
        commonSaga({
          endPoint: `/proposals/details/${id}`,
          type: 'get',
          stateObj: 'proposalDetails',
          baseEP: 'INVESTOR',
        }),
      );
    }
  }, [commonData?.voteForProposal]);

  const voteDialogHandler = (flag, flagLabel) => {
    const title = `<p>You will be casting <i>${assetsSummery?.holdings}</i> votes ${flagLabel} the proposal. Please click Confirm to cast your vote.</p>`;
    setVoteDialog({ show: true, data: { title, flag, heading: 'Confirmation', titleHtml: true } });
  };

  const voteHandler = data => {
    dispatch(
      commonSaga({
        endPoint: `/proposals/vote/${id}`,
        type: 'post',
        stateObj: 'voteForProposal',
        dataToPost: { label: data?.flag },
        msg: 'Voted Successfully!',
        showAlert: true,
        baseEP: 'INVESTOR',
      }),
    );
  };

  const approvalHandler = flag => {
    dispatch(
      commonSaga({
        endPoint: `/proposals/approveProposals/${id}`,
        type: 'patch',
        stateObj: 'approvalProposal',
        dataToPost: { approvalStatus: flag },
        msg: `Proposal ${flag} Successfully!`,
        showAlert: true,
        baseEP: 'INVESTOR',
      }),
    );
  };

  return (
    <div className="page-content">
      <Breadcrumb items={[...pathItems, { name: commonData?.proposalDetails?.dataObj?.title }]} />
      <Container fluid>
        <Card>
          <CardBody className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <div>
                <img
                  src={assetsSummery?.property?.mainImage?.url || avatar}
                  alt=""
                  className="avatar-md rounded-circle img-thumbnail me-3"
                />
              </div>
              <div>
                <div>
                  <h5>{commonData?.proposalDetails?.dataObj?.propertyId?.name}</h5>
                  <i>
                    {assetsSummery?.property?.city}, {assetsSummery?.property?.state}
                  </i>
                </div>
              </div>
            </div>
            {commonData?.proposalDetails?.dataObj?.approvalStatus === 'Pending' &&
              via === 'governance' && (
                <div className="d-flex button-header">
                  <Button
                    className="w-100"
                    color="success"
                    onClick={() => approvalHandler('Approved')}
                  >
                    Approve
                  </Button>
                  <Button
                    className="ms-2 w-100"
                    color="danger"
                    onClick={() => approvalHandler('Rejected')}
                  >
                    Reject
                  </Button>
                </div>
              )}
            {commonData?.proposalDetails?.dataObj?.approvalStatus !== 'Pending' &&
              via === 'governance' && (
                <div>
                  Proposal Status is{' '}
                  <strong> {commonData?.proposalDetails?.dataObj?.approvalStatus}</strong>
                </div>
              )}
          </CardBody>
        </Card>
        <Card>
          <CardBody className="d-flex justify-content-between align-items-center proposal-detail">
            <div>{commonData?.proposalDetails?.dataObj?.title}</div>
            {commonData?.proposalDetails?.dataObj?.votingStartDate && (
              <div>
                Publish date :{' '}
                {moment(new Date(commonData?.proposalDetails?.dataObj?.votingStartDate)).format(
                  'lll',
                )}
              </div>
            )}
            {commonData?.proposalDetails?.dataObj?.votingEndDate && (
              <div className="d-flex align-items-center">
                <i className="uil-clock-three fa-2x me-2" />
                <div>
                  Proposal end at{' '}
                  {moment(new Date(commonData?.proposalDetails?.dataObj?.votingEndDate)).format(
                    'lll',
                  )}
                </div>
              </div>
            )}
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="d-flex justify-content-between align-items-baseline">
              <div className="d-flex flex-column">
                <div className="summary">
                  <h5>Summary</h5>
                  <p>{commonData?.proposalDetails?.dataObj?.summary}</p>
                </div>
                {commonData?.proposalDetails?.dataObj?.amount && (
                  <div className="summary mt-3">
                    <h5>Amount</h5>
                    <p>
                      {CurrencyFormat({
                        value: commonData?.proposalDetails?.dataObj?.amount,
                        prefix: '$',
                      })}
                    </p>
                  </div>
                )}
                {commonData?.proposalDetails?.dataObj?.type && (
                  <div className="summary mt-3">
                    <h5>Type</h5>
                    <p>{commonData?.proposalDetails?.dataObj?.type}</p>
                  </div>
                )}
              </div>
              {via !== 'governance' && !commonData?.proposalDetails?.isLoading && (
                <div className="vote-card">
                  <h5>Status</h5>
                  <div className="d-flex justify-content-between w-100">
                    <p>
                      Votes {commonData?.proposalDetails?.dataObj?.voteOptions?.[0]?.label}(
                      {CurrencyFormat({
                        value: commonData?.proposalDetails?.dataObj?.votedFor,
                        zeroAllowed: false,
                      })}
                      )
                    </p>
                    <p>
                      Votes {commonData?.proposalDetails?.dataObj?.voteOptions?.[1]?.label}(
                      {CurrencyFormat({
                        value: commonData?.proposalDetails?.dataObj?.votedAgainst,
                        zeroAllowed: false,
                      })}
                      )
                    </p>
                  </div>
                  <div>
                    <MultiProgress
                      success={commonData?.proposalDetails?.dataObj?.votedFor}
                      light={
                        commonData?.proposalDetails?.dataObj?.propertyId?.numberOfTokens -
                        (commonData?.proposalDetails?.dataObj?.votedFor +
                          commonData?.proposalDetails?.dataObj?.votedAgainst)
                      }
                      danger={commonData?.proposalDetails?.dataObj?.votedAgainst}
                    />
                  </div>
                  {commonData?.proposalDetails?.dataObj?.voted && (
                    <p className="error_msg">
                      You have already Voted as {commonData?.proposalDetails?.dataObj?.yourVote} for
                      this proposal.
                    </p>
                  )}
                  {!commonData?.proposalDetails?.dataObj?.voted && (
                    <div className="d-flex justify-content-between mt-4">
                      <Button
                        disabled={
                          commonData?.proposalDetails?.dataObj?.approvalStatus === 'Pending'
                        }
                        className="w-100 vote-button"
                        color="success"
                        onClick={() =>
                          voteDialogHandler(
                            commonData?.proposalDetails?.dataObj?.voteOptions?.[0]?.label,
                            'for',
                          )
                        }
                      >
                        Vote {commonData?.proposalDetails?.dataObj?.voteOptions?.[0]?.label}
                      </Button>
                      {commonData?.proposalDetails?.dataObj?.approvalStatus === 'Pending' && (
                        <p className="error_msg">Please wait for Proposal approval to Vote</p>
                      )}
                      <Button
                        disabled={
                          commonData?.proposalDetails?.dataObj?.approvalStatus === 'Pending'
                        }
                        className="ms-2 w-100 vote-button"
                        color="danger"
                        onClick={() =>
                          voteDialogHandler(
                            commonData?.proposalDetails?.dataObj?.voteOptions?.[1]?.label,
                            'against',
                          )
                        }
                      >
                        Vote {commonData?.proposalDetails?.dataObj?.voteOptions?.[1]?.label}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div>
              <div className="description mt-3">
                <h5>Description</h5>
                <div
                  dangerouslySetInnerHTML={{
                    __html: commonData?.proposalDetails?.dataObj?.description,
                  }}
                />
              </div>
              <div className="attachments">
                {commonData?.proposalDetails?.dataObj?.documents?.length > 0 &&
                  commonData?.proposalDetails?.dataObj?.documents?.map((item,ind) =>
                    item?.contentType.includes('image') ? (
                      <img key={ind} src={item?.url} alt={item?.key} height="200" />
                    ) : item?.contentType.includes('video') ? (
                      <video key={ind} height="200" controls>
                        <source src={item?.url} type="video/mp4" />
                        <track
                          src="captions_en.vtt"
                          kind="captions"
                          srcLang="en"
                          label="english_captions"
                        />
                      </video>
                    ) : (
                      <a key={ind} href={item?.url} target="_blank" rel="noreferrer">
                        {item?.key} {item?.contentType}
                      </a>
                    ),
                  )}
              </div>
            </div>
          </CardBody>
        </Card>
        {voteDialog?.show && (
          <CustomModel
            onClose={() => setVoteDialog({ show: false, data: {} })}
            onSubmit={voteHandler}
            isLoading={commonData?.voteForProposal?.isLoading}
            data={voteDialog?.data}
          />
        )}
      </Container>
    </div>
  );
};

export default ViewProposal;
