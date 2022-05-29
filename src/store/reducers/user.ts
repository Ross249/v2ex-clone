import { IBalance } from '@/interfaces/balance';
import { ILoginParams } from '@/interfaces/user';
import { userService } from '@/services';
import { parser, userCrawler } from '@/services/crawler';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IMyNode } from '@/interfaces/node';
import { Alert } from '@/utils';
import { goBack } from '@/navigations/root';
import Toast from 'react-native-toast-message';
import dayjs from 'dayjs';
import { CONSTANTS } from '@/config';

export const fetchUserInfoById = 