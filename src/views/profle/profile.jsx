import React, { useState, useEffect } from 'react';
import { Container } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import SweetAlert from 'react-bootstrap-sweetalert';
import PhoneInput from 'react-phone-input-2';

import ChangePassword from 'views/auth/Login/ChangePassword';
import PhoneInputModal from 'components/PhoneInputModal';
import Breadcrumb from 'components/UI/Common/Breadcrumb';
import { GetUserProfile } from 'store/actions';
import OtpModal from 'components/OtpModal';

import 'react-phone-input-2/lib/style.css';
import './profile.css';

const getInitials = (name = '') => {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'A';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const MyProfile = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector(state => state.user);

  const [isOtpModal, setOtpModal] = useState(false);
  const [updatedNumber, setUpdatedNumber] = useState({});
  const [passwordModal, setPasswordModal] = useState(false);
  const [phoneModal, setPhoneModal] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);
  const [copied, setCopied] = useState(false);
  const [successAlertOtp, setSuccessAlertOtp] = useState(false);

  const handlePassword = () => setPasswordModal(prev => !prev);
  const handlePhone = () => setPhoneModal(prev => !prev);

  const handleOtpModal = val => {
    setUpdatedNumber(val);
    setOtpModal(prev => !prev);
  };

  const copyToClipboard = value => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  useEffect(() => {
    dispatch(GetUserProfile());
  }, []);

  const mobileUpdatedCB = () => {
    setSuccessAlertOtp(true);
    dispatch(GetUserProfile());
  };

  const initials = getInitials(userData?.name || '');
  const walletAddress = userData?.blockchainAddress || '';
  const shortWallet = walletAddress
    ? `${walletAddress.slice(0, 6)}…${walletAddress.slice(-4)}`
    : null;

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumb items={[{ name: 'Profile' }]} />

        <div className="profile-card">
          {/* Header banner */}
          <div className="profile-header">
            <div className="profile-avatar">{initials}</div>
            <div className="profile-header-info">
              <h2 className="profile-name">{userData?.name || 'Admin'}</h2>
              <span className="profile-role">Administrator</span>
              {shortWallet && (
                <div className="profile-wallet">
                  <span title={walletAddress}>{shortWallet}</span>
                  {copied ? (
                    <span className="profile-copied"><i className="fas fa-check" /> Copied</span>
                  ) : (
                    <i
                      className="fas fa-clone profile-copy-icon"
                      title="Copy wallet address"
                      onClick={() => copyToClipboard(walletAddress)}
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Info fields */}
          <div className="profile-body">
            <div className="profile-fields">

              <div className="profile-field">
                <label className="profile-label">Full Name</label>
                <div className="profile-input-wrap">
                  <i className="fas fa-user profile-field-icon" />
                  <input
                    className="profile-input"
                    type="text"
                    value={userData?.name || ''}
                    disabled
                    readOnly
                  />
                </div>
              </div>

              <div className="profile-field">
                <label className="profile-label">Email Address</label>
                <div className="profile-input-wrap">
                  <i className="fas fa-envelope profile-field-icon" />
                  <input
                    className="profile-input"
                    type="email"
                    value={userData?.email || ''}
                    disabled
                    readOnly
                  />
                </div>
              </div>

              <div className="profile-field">
                <label className="profile-label">Mobile Number</label>
                <PhoneInput
                  country="us"
                  value={`${userData?.countryCode || ''}${userData?.mobileNumber || ''}`}
                  autoFormat={false}
                  countryCodeEditable={false}
                  disabled
                  inputClass="profile-phone-input"
                  containerClass="profile-phone-container"
                />
              </div>

            </div>

            {/* Action buttons */}
            <div className="profile-actions">
              <button
                type="button"
                className="profile-btn profile-btn-primary"
                onClick={handlePassword}
              >
                <i className="fas fa-lock" />
                Update Password
              </button>
              <button
                type="button"
                className="profile-btn profile-btn-outline"
                onClick={handlePhone}
              >
                <i className="fas fa-mobile-alt" />
                Update Phone Number
              </button>
            </div>
          </div>
        </div>
      </Container>

      {passwordModal && <ChangePassword close={handlePassword} />}
      {phoneModal && <PhoneInputModal close={handlePhone} next={handleOtpModal} />}
      {isOtpModal && <OtpModal close={handleOtpModal} data={updatedNumber} next={mobileUpdatedCB} />}

      {successAlert && (
        <SweetAlert
          title="Password updated successfully"
          success
          confirmBtnBsStyle="success"
          onConfirm={() => setSuccessAlert(false)}
        />
      )}
      {successAlertOtp && (
        <SweetAlert
          title="Mobile number updated successfully"
          success
          confirmBtnBsStyle="success"
          onConfirm={() => setSuccessAlertOtp(false)}
        />
      )}
    </div>
  );
};

export default MyProfile;
