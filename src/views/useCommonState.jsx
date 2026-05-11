import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router';
import { toast } from 'react-toastify';

const useCommonState = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  return {
    dispatch,
    navigate,
    useState,
    useEffect,
    useSelector,
    useCallback,
    toast,
    location,
  };
};

export default useCommonState;
